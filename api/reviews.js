// Vercel Serverless Function for /api/reviews and /api/admin/reviews
// Automatically deployed by Vercel for https://srivoratech.vercel.app/api/reviews

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
  },
  {
    id: 2,
    name: 'Narasimha Reddy (Founder, TFS Fintech)',
    email: 'narasimha@tfsfintech.com',
    star: 5,
    comment: "SriVoraTech transformed our vision into India's 1st subscription fintech app within 2 months!",
    date: 'Jul 18, 2026',
    status: 'Approved',
    timestamp: 1784361600000,
    company: 'TFS Fintech',
    profileImage: ''
  },
  {
    id: 3,
    name: 'Sujith Reddy (Founder, FluentPro AI)',
    email: 'sujith@fluentpro.ai',
    star: 5,
    comment: 'FluentPro AI voice engine was engineered from scratch by SriVoraTech — 85,000+ active learners love it!',
    date: 'Jul 15, 2026',
    status: 'Approved',
    timestamp: 1784102400000,
    company: 'FluentPro AI',
    profileImage: ''
  }
]

// Serverless persistent memory database
let inMemoryReviews = [...DEFAULT_REVIEWS]

function checkAdminAuth(req) {
  const token = req.headers['x-admin-token']
  return token === ADMIN_TOKEN
}

export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-token'
  )

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const url = req.url || ''

  // ── 1. Admin Login Endpoint ──
  if (url.includes('/admin/login')) {
    if (req.method !== 'POST') return res.status(405).json({ success: false, message: 'Method Not Allowed' })
    let body = req.body || {}
    if (typeof body === 'string') {
      try { body = JSON.parse(body) } catch(e) {}
    }
    const { username, password } = body
    if (username === 'admin' && password === 'admin_password_srivoratech_2026') {
      return res.status(200).json({ success: true, token: ADMIN_TOKEN })
    }
    return res.status(401).json({ success: false, message: 'Invalid administrative credentials' })
  }

  // ── 2. Admin Operations Endpoint ──
  if (url.includes('/admin/reviews')) {
    if (!checkAdminAuth(req)) {
      return res.status(403).json({ success: false, message: 'Access denied: Administrator token required' })
    }

    // Admin GET reviews list (search & filter)
    if (req.method === 'GET') {
      const urlObj = new URL(url, `http://${req.headers.host || 'localhost'}`)
      const search = urlObj.searchParams.get('search') || ''
      const rating = urlObj.searchParams.get('rating') || ''
      const status = urlObj.searchParams.get('status') || ''

      let resultList = [...inMemoryReviews]
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
      let body = req.body || {}
      if (typeof body === 'string') {
        try { body = JSON.parse(body) } catch(e) {}
      }

      const reviewId = parseInt(url.split('/').pop().replace(/[^0-9]/g, ''), 10)
      const reviewIndex = inMemoryReviews.findIndex(r => r.id === reviewId)

      if (reviewIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' })
      }

      if (url.includes('/approve')) {
        inMemoryReviews[reviewIndex].status = 'Approved'
        return res.status(200).json({ success: true, message: 'Review approved', review: inMemoryReviews[reviewIndex] })
      }
      if (url.includes('/reject')) {
        inMemoryReviews[reviewIndex].status = 'Rejected'
        return res.status(200).json({ success: true, message: 'Review rejected', review: inMemoryReviews[reviewIndex] })
      }
    }

    // Admin PUT (Edit review)
    if (req.method === 'PUT') {
      let body = req.body || {}
      if (typeof body === 'string') {
        try { body = JSON.parse(body) } catch(e) {}
      }

      const reviewId = parseInt(url.split('/').pop().replace(/[^0-9]/g, ''), 10)
      const reviewIndex = inMemoryReviews.findIndex(r => r.id === reviewId)

      if (reviewIndex === -1) {
        return res.status(404).json({ success: false, message: 'Review not found' })
      }

      const { name, company, star, comment } = body
      if (name) inMemoryReviews[reviewIndex].name = String(name).replace(/<[^>]*>/g, '').trim()
      if (company !== undefined) inMemoryReviews[reviewIndex].company = String(company).replace(/<[^>]*>/g, '').trim()
      if (star) inMemoryReviews[reviewIndex].star = parseInt(star, 10) || 5
      if (comment) inMemoryReviews[reviewIndex].comment = String(comment).replace(/<[^>]*>/g, '').trim()

      return res.status(200).json({ success: true, message: 'Review updated successfully', review: inMemoryReviews[reviewIndex] })
    }

    // Admin DELETE (Delete review)
    if (req.method === 'DELETE') {
      const reviewId = parseInt(url.split('/').pop().replace(/[^0-9]/g, ''), 10)
      inMemoryReviews = inMemoryReviews.filter(r => r.id !== reviewId)
      return res.status(200).json({ success: true, message: 'Review deleted successfully' })
    }
  }

  // ── 3. Public GET /api/reviews Endpoint (Approved Only) ──
  if (req.method === 'GET') {
    const approved = inMemoryReviews.filter(r => r.status === 'Approved')
    approved.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    const totalApproved = approved.length
    const sum = approved.reduce((acc, curr) => acc + curr.star, 0)
    const averageRating = totalApproved > 0 ? parseFloat((sum / totalApproved).toFixed(1)) : 5.0

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    approved.forEach(r => {
      if (distribution[r.star] !== undefined) {
        distribution[r.star]++
      }
    })

    const percentages = {}
    Object.keys(distribution).forEach(star => {
      percentages[star] = totalApproved > 0 
        ? Math.round((distribution[star] / totalApproved) * 100)
        : 0
    })

    const highRatings = distribution[5] + distribution[4]
    const satisfactionRate = totalApproved > 0
      ? Math.round((highRatings / totalApproved) * 100)
      : 100

    return res.status(200).json({
      success: true,
      reviews: approved,
      totalCount: totalApproved,
      averageRating,
      distribution: percentages,
      satisfactionRate
    })
  }

  // ── 4. Public POST /api/reviews Endpoint (Defaults to Pending) ──
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

      const { name, rating, comment, email, company } = body
      if (!name || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Name, Star Rating, and Review Message are required.'
        })
      }

      const newReview = {
        id: Date.now() + Math.floor(Math.random() * 1000),
        name: String(name).replace(/<[^>]*>/g, '').trim(),
        email: email ? String(email).replace(/<[^>]*>/g, '').trim() : '',
        star: parseInt(rating, 10) || 5,
        comment: String(comment).replace(/<[^>]*>/g, '').trim(),
        company: company ? String(company).replace(/<[^>]*>/g, '').trim() : '',
        status: 'Pending', // ALWAYS Pending until Admin approves!
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      }

      inMemoryReviews.unshift(newReview)

      return res.status(200).json({
        success: true,
        message: 'Review submitted successfully. It will display on the website once approved by our administrator.',
        review: newReview
      })
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  res.status(405).json({ success: false, message: 'Method Not Allowed' })
}
