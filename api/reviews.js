import fs from 'fs'
import path from 'path'
import { connectToDatabase } from './mongodb.js'

const ADMIN_TOKEN = 'srivoratech_admin_secure_session_token_2026'

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Badisa Srikanth (Founder & CEO)',
    email: 'srikanth@srivoratech.in',
    star: 5,
    comment: 'Building innovative software and AI-powered solutions that empower businesses to grow, automate, and succeed in the digital era.',
    date: 'Jul 20, 2026',
    status: 'Approved',
    timestamp: 1784534400000,
    company: 'SriVoraTech',
    profileImage: ''
  }
]

// Determine storage file path for persistent memory across serverless restarts safely
function getWritableStoragePath() {
  const tmpPath = path.join('/tmp', 'reviews.json')
  const uploadsDir = path.join(process.cwd(), 'uploads')
  const uploadsPath = path.join(uploadsDir, 'reviews.json')

  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const testFile = path.join(uploadsDir, '.write_test')
    fs.writeFileSync(testFile, 'test')
    fs.unlinkSync(testFile)
    return uploadsPath
  } catch (e) {
    return tmpPath
  }
}

function getLocalReviews() {
  const targetPath = getWritableStoragePath()
  const uploadsPath = path.join(process.cwd(), 'uploads', 'reviews.json')

  try {
    if (fs.existsSync(targetPath)) {
      const data = fs.readFileSync(targetPath, 'utf8')
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        global._svt_in_memory_reviews = parsed
        return parsed
      }
    }
  } catch (err) {}

  if (targetPath !== uploadsPath) {
    try {
      if (fs.existsSync(uploadsPath)) {
        const seedData = fs.readFileSync(uploadsPath, 'utf8')
        const seedParsed = JSON.parse(seedData)
        if (Array.isArray(seedParsed) && seedParsed.length > 0) {
          global._svt_in_memory_reviews = seedParsed
          return seedParsed
        }
      }
    } catch (err) {}
  }

  if (!global._svt_in_memory_reviews || global._svt_in_memory_reviews.length === 0) {
    global._svt_in_memory_reviews = [...DEFAULT_REVIEWS]
  }

  return global._svt_in_memory_reviews
}

function saveLocalReviews(reviews) {
  global._svt_in_memory_reviews = reviews
  try {
    const targetPath = getWritableStoragePath()
    const dir = path.dirname(targetPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(targetPath, JSON.stringify(reviews, null, 2))
  } catch (err) {}
}

async function getReviewsFromDb() {
  if (process.env.MONGODB_URI) {
    try {
      const { db } = await connectToDatabase()
      if (db) {
        const collection = db.collection('reviews')
        const docs = await collection.find({}).toArray()
        if (Array.isArray(docs) && docs.length > 0) {
          const normalized = docs.map(d => {
            const { _id, ...rest } = d
            return rest
          })
          global._svt_in_memory_reviews = normalized
          saveLocalReviews(normalized)
          return normalized
        } else {
          await collection.insertMany(DEFAULT_REVIEWS)
          global._svt_in_memory_reviews = [...DEFAULT_REVIEWS]
          saveLocalReviews(global._svt_in_memory_reviews)
          return global._svt_in_memory_reviews
        }
      }
    } catch (e) {
      console.warn('MongoDB Atlas fetch fallback:', e.message)
    }
  }
  return getLocalReviews()
}

async function saveReviewToDb(newReview) {
  if (process.env.MONGODB_URI) {
    try {
      const { db } = await connectToDatabase()
      if (db) {
        const collection = db.collection('reviews')
        await collection.updateOne(
          { id: newReview.id },
          { $set: newReview },
          { upsert: true }
        )
      }
    } catch (e) {
      console.warn('MongoDB Atlas save fallback:', e.message)
    }
  }
}

async function deleteReviewFromDb(targetId) {
  if (process.env.MONGODB_URI) {
    try {
      const { db } = await connectToDatabase()
      if (db) {
        const collection = db.collection('reviews')
        const numId = parseInt(targetId, 10)
        await collection.deleteMany({
          $or: [
            { id: targetId },
            { id: String(targetId) },
            { id: isNaN(numId) ? targetId : numId }
          ]
        })
      }
    } catch (e) {
      console.warn('MongoDB Atlas delete fallback:', e.message)
    }
  }
}

function checkAdminAuth(req) {
  const token = req.headers['x-admin-token']
  return token === ADMIN_TOKEN
}

function extractReviewId(url, req) {
  if (!url) return ''
  try {
    const urlObj = new URL(url, `http://${req?.headers?.host || 'localhost'}`)
    const queryId = urlObj.searchParams.get('id')
    if (queryId) return queryId

    let bodyId = null
    if (req?.body) {
      let b = req.body
      if (typeof b === 'string') {
        try { b = JSON.parse(b) } catch(e) {}
      }
      if (b && b.id) bodyId = String(b.id)
    }
    if (bodyId) return bodyId

    const cleanUrl = urlObj.pathname
    let match = cleanUrl.match(/\/admin\/reviews\/([^/]+)/)
    if (match && match[1]) return match[1]

    match = cleanUrl.match(/\/reviews\/([^/]+)/)
    if (match && match[1] && match[1] !== 'admin') return match[1]

    const parts = cleanUrl.split('/').filter(Boolean)
    const ignored = ['api', 'admin', 'reviews', 'approve', 'reject']
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!ignored.includes(parts[i].toLowerCase())) {
        return parts[i]
      }
    }
  } catch (e) {}
  return ''
}

function findReviewIndex(reviews, url, req) {
  const targetId = extractReviewId(url, req)
  if (!targetId) return -1
  let index = reviews.findIndex(r => String(r.id) === String(targetId))
  if (index === -1) {
    const numId = parseInt(targetId, 10)
    if (!isNaN(numId)) {
      index = reviews.findIndex(r => Number(r.id) === numId)
    }
  }
  return index
}

export default async function handler(req, res) {
  // CORS & Cache & CSP Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token'
  )
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com https://cdn.fontshare.com; font-src 'self' data: https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com; img-src 'self' data: https: blob:; connect-src 'self' https:;"
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const url = req.url || ''

  // ── 1. Admin Login Endpoint ──
  if (url.includes('login')) {
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' })
    return res.status(200).json({ success: true, token: ADMIN_TOKEN })
  }

  // ── 2. Admin Operations Endpoint ──
  const isAdminOp = req.headers['x-admin-token'] || 
                    url.includes('admin') || 
                    url.includes('/approve') || 
                    url.includes('/reject') || 
                    req.method === 'PUT' || 
                    req.method === 'DELETE'

  if (isAdminOp && (req.method !== 'GET' || url.includes('admin'))) {
    if (!checkAdminAuth(req)) {
      return res.status(403).json({ success: false, message: 'Access denied: Administrator token required' })
    }

    // Admin GET reviews list (search & filter)
    if (req.method === 'GET') {
      const urlObj = new URL(url, `http://${req.headers.host || 'localhost'}`)
      const search = urlObj.searchParams.get('search') || ''
      const rating = urlObj.searchParams.get('rating') || ''
      const status = urlObj.searchParams.get('status') || ''

      let resultList = await getReviewsFromDb()
      if (rating) {
        const rVal = parseInt(rating, 10)
        resultList = resultList.filter(r => r.star === rVal)
      }
      if (status) {
        resultList = resultList.filter(r => r.status.toLowerCase() === status.toLowerCase())
      }
      if (search) {
        const q = search.toLowerCase()
        resultList = resultList.filter(r => 
          r.name.toLowerCase().includes(q) || 
          r.comment.toLowerCase().includes(q) || 
          (r.company && r.company.toLowerCase().includes(q))
        )
      }

      resultList.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      return res.status(200).json({ success: true, reviews: resultList })
    }

    // Admin POST (Approve / Reject)
    if (req.method === 'POST') {
      const reviews = await getReviewsFromDb()
      const reviewIndex = findReviewIndex(reviews, url, req)

      if (reviewIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' })
      }

      if (url.includes('/approve')) {
        reviews[reviewIndex].status = 'Approved'
        saveLocalReviews(reviews)
        await saveReviewToDb(reviews[reviewIndex])
        return res.status(200).json({ success: true, message: 'Review approved successfully', review: reviews[reviewIndex] })
      }
      if (url.includes('/reject')) {
        reviews[reviewIndex].status = 'Rejected'
        saveLocalReviews(reviews)
        await saveReviewToDb(reviews[reviewIndex])
        return res.status(200).json({ success: true, message: 'Review rejected successfully', review: reviews[reviewIndex] })
      }
    }

    // Admin PUT (Edit review)
    if (req.method === 'PUT') {
      let body = req.body || {}
      if (typeof body === 'string') {
        try { body = JSON.parse(body) } catch(e) {}
      }

      const reviews = await getReviewsFromDb()
      const reviewIndex = findReviewIndex(reviews, url, req)

      if (reviewIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' })
      }

      const { name, company, star, comment } = body
      if (name) reviews[reviewIndex].name = String(name).replace(/<[^>]*>/g, '').trim()
      if (company !== undefined) reviews[reviewIndex].company = String(company).replace(/<[^>]*>/g, '').trim()
      if (star) reviews[reviewIndex].star = parseInt(star, 10) || 5
      if (comment) reviews[reviewIndex].comment = String(comment).replace(/<[^>]*>/g, '').trim()

      saveLocalReviews(reviews)
      await saveReviewToDb(reviews[reviewIndex])
      return res.status(200).json({ success: true, message: 'Review updated successfully', review: reviews[reviewIndex] })
    }

    // Admin DELETE (Delete review)
    if (req.method === 'DELETE') {
      let reviews = await getReviewsFromDb()
      const targetId = extractReviewId(url, req)
      const originalLength = reviews.length

      reviews = reviews.filter(r => String(r.id) !== String(targetId) && Number(r.id) !== parseInt(targetId, 10))

      if (reviews.length === originalLength) {
        return res.status(404).json({ success: false, message: 'Review not found' })
      }

      saveLocalReviews(reviews)
      await deleteReviewFromDb(targetId)
      return res.status(200).json({ success: true, message: 'Review deleted successfully' })
    }
  }

  // ── 3. Public GET /api/reviews Endpoint (Approved Only) ──
  if (req.method === 'GET') {
    const allReviews = await getReviewsFromDb()
    const approved = allReviews.filter(r => r.status === 'Approved')
    approved.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    const totalApproved = approved.length
    const sum = approved.reduce((acc, curr) => acc + (parseInt(curr.star, 10) || 5), 0)
    const averageRating = totalApproved > 0 ? parseFloat((sum / totalApproved).toFixed(1)) : 5.0

    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    approved.forEach(r => {
      const s = parseInt(r.star, 10) || 5
      if (counts[s] !== undefined) {
        counts[s]++
      }
    })

    const percentages = {}
    Object.keys(counts).forEach(star => {
      percentages[star] = totalApproved > 0 
        ? Math.round((counts[star] / totalApproved) * 100)
        : 0
    })

    const highRatings = counts[5] + counts[4]
    const satisfactionRate = totalApproved > 0
      ? Math.round((highRatings / totalApproved) * 100)
      : 100

    const displayReviews = approved.slice(0, 100)

    return res.status(200).json({
      success: true,
      reviews: displayReviews,
      totalCount: totalApproved,
      averageRating,
      distribution: percentages,
      counts,
      satisfactionRate
    })
  }

  // ── 4. Public POST /api/reviews Endpoint (Defaults to Approved) ──
  if (req.method === 'POST') {
    try {
      let body = req.body || {}
      if (typeof body === 'string') {
        try {
          body = JSON.parse(body)
        } catch (parseErr) {
          body = {}
        }
      }

      const { name, comment, email, company } = body
      const rawRating = body.rating !== undefined ? body.rating : body.star
      const starNum = parseInt(rawRating, 10)
      
      if (!name || isNaN(starNum) || starNum < 1 || starNum > 5 || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Name, valid Star Rating (1-5), and Review Message are required.'
        })
      }

      const newReview = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: String(name).replace(/<[^>]*>/g, '').trim(),
        email: email ? String(email).replace(/<[^>]*>/g, '').trim() : '',
        star: starNum,
        comment: String(comment).replace(/<[^>]*>/g, '').trim(),
        company: company ? String(company).replace(/<[^>]*>/g, '').trim() : '',
        status: 'Approved', // Display live to all visitors immediately!
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      }

      const reviews = await getReviewsFromDb()
      reviews.unshift(newReview)
      saveLocalReviews(reviews)
      await saveReviewToDb(newReview)

      return res.status(200).json({
        success: true,
        message: 'Review submitted successfully! Your rating has been saved and is now live for all visitors.',
        review: newReview
      })
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' })
}

