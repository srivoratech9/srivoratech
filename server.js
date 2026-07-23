import express from 'express'
import cors from 'cors'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = 3001

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://api.fontshare.com https://cdn.fontshare.com; font-src 'self' data: https://fonts.gstatic.com https://api.fontshare.com https://cdn.fontshare.com; img-src 'self' data: https: blob:; connect-src 'self' https:;"
  )
  next()
})

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir)
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    
    if (extname && (mimetype || file.mimetype.includes('pdf') || file.mimetype.includes('word'))) {
      return cb(null, true)
    }
    cb(new Error('Only PDF and DOC files are allowed'))
  }
})

// Google Sheets & Local Storage setup
let sheet = null
const localDataPath = path.join(uploadsDir, 'applications.json')

async function initGoogleSheets() {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
    if (!spreadsheetId) {
      console.warn('GOOGLE_SHEETS_SPREADSHEET_ID not set. Google Sheets integration disabled.')
      return
    }

    const credentialsPath = path.join(process.cwd(), 'credentials.json')
    if (!fs.existsSync(credentialsPath)) {
      console.warn('credentials.json not found. Google Sheets integration disabled.')
      return
    }

    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'))
    
    // google-spreadsheet compatibility
    try {
      const doc = new GoogleSpreadsheet(spreadsheetId)
      if (typeof doc.useServiceAccountAuth === 'function') {
        await doc.useServiceAccountAuth({
          client_email: credentials.client_email,
          private_key: credentials.private_key,
        })
      }
      await doc.loadInfo()
      sheet = doc.sheetsByIndex[0]
      console.log('Google Sheets integration initialized successfully:', doc.title)
    } catch (authErr) {
      console.error('Google Sheets Auth Error:', authErr.message)
    }
  } catch (error) {
    console.error('Error initializing Google Sheets:', error.message)
  }
}

// Initialize Google Sheets on startup
initGoogleSheets()

function saveApplicationLocally(application) {
  try {
    let list = []
    if (fs.existsSync(localDataPath)) {
      list = JSON.parse(fs.readFileSync(localDataPath, 'utf8'))
    }
    list.push(application)
    fs.writeFileSync(localDataPath, JSON.stringify(list, null, 2))
  } catch (err) {
    console.error('Error saving application locally:', err)
  }
}

// Function to add row to Google Sheets
async function addRowToSheet(rowData) {
  if (!sheet) {
    console.warn('Google Sheets not initialized, row saved locally only')
    return
  }

  try {
    await sheet.addRow(rowData)
    console.log('Row added to Google Sheets successfully')
  } catch (error) {
    console.error('Error adding row to Google Sheets:', error.message)
  }
}

function splitFullName(fullName = '') {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || '',
  }
}

// Store applications in memory
const applications = []

// Load saved local applications if any
if (fs.existsSync(localDataPath)) {
  try {
    const saved = JSON.parse(fs.readFileSync(localDataPath, 'utf8'))
    if (Array.isArray(saved)) applications.push(...saved)
  } catch (e) {}
}

// Fresher application endpoint
app.post('/api/apply/fresher', upload.single('resume'), async (req, res) => {
  try {
    const {
      fullName,
      firstName,
      lastName,
      email,
      phone,
      address,
      category,
      role,
      college,
      degree,
      graduationYear,
      yearsOfExperience,
      skills,
      portfolio,
      whySriVoraTech,
      noticePeriod,
    } = req.body
    const resumeFile = req.file

    const parsedName = splitFullName(fullName || '')
    const finalFirstName = firstName || parsedName.firstName
    const finalLastName = lastName || parsedName.lastName || parsedName.firstName
    const personAddress = address || college || ''
    const personCategory = category || degree || 'Engineering'
    const personRole = role || degree || 'Fresher Trainee'
    const personYears = yearsOfExperience || graduationYear || 'Fresher'

    // Validate essential required contact fields
    if (!email || !phone || (!fullName && !finalFirstName)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone number are required.' 
      })
    }

    const application = {
      id: Date.now(),
      type: 'Fresher',
      fullName: fullName || `${finalFirstName} ${finalLastName}`.trim(),
      firstName: finalFirstName,
      lastName: finalLastName,
      email,
      phone,
      address: personAddress,
      college: college || '',
      degree: degree || '',
      category: personCategory,
      role: personRole,
      graduationYear: graduationYear || '',
      yearsOfExperience: personYears,
      skills: skills || '',
      portfolio: portfolio || '',
      whySriVoraTech: whySriVoraTech || '',
      noticePeriod: noticePeriod || 'Immediate',
      resume: resumeFile ? {
        filename: resumeFile.filename,
        originalname: resumeFile.originalname,
        path: resumeFile.path,
        size: resumeFile.size,
      } : null,
      submittedAt: new Date().toISOString(),
    }

    applications.push(application)
    saveApplicationLocally(application)

    // Add to Google Sheets with complete details
    await addRowToSheet({
      'Application ID': application.id,
      'Type': 'Fresher',
      'Full Name': application.fullName,
      'First Name': application.firstName,
      'Last Name': application.lastName,
      'Email': email,
      'Phone': phone,
      'Address': application.address,
      'College / Company': college || application.address,
      'Degree / Designation': degree || '',
      'Category': application.category,
      'Role': application.role,
      'Years of Experience': application.yearsOfExperience,
      'Skills': skills || '',
      'Portfolio': portfolio || '',
      'Why SriVoraTech': whySriVoraTech || '',
      'Resume Filename': resumeFile ? resumeFile.originalname : '',
      'Submitted At': application.submittedAt,
    })

    console.log('New fresher application processed:', application.fullName)

    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application.id,
    })
  } catch (error) {
    console.error('Error processing fresher application:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error processing application',
    })
  }
})

// Experienced application endpoint
app.post('/api/apply/experienced', upload.single('resume'), async (req, res) => {
  try {
    const {
      fullName,
      firstName,
      lastName,
      email,
      phone,
      address,
      category,
      role,
      company,
      designation,
      yearsOfExperience,
      skills,
      portfolio,
      noticePeriod,
      whySriVoraTech,
    } = req.body
    const resumeFile = req.file

    const parsedName = splitFullName(fullName || '')
    const finalFirstName = firstName || parsedName.firstName
    const finalLastName = lastName || parsedName.lastName || parsedName.firstName
    const personAddress = address || company || ''
    const personCategory = category || company || 'Engineering'
    const personRole = role || designation || 'Experienced Professional'
    const personYears = yearsOfExperience || '1-2'

    // Validate essential required contact fields
    if (!email || !phone || (!fullName && !finalFirstName)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and phone number are required.' 
      })
    }

    const application = {
      id: Date.now(),
      type: 'Experienced',
      fullName: fullName || `${finalFirstName} ${finalLastName}`.trim(),
      firstName: finalFirstName,
      lastName: finalLastName,
      email,
      phone,
      address: personAddress,
      company: company || '',
      designation: designation || '',
      category: personCategory,
      role: personRole,
      yearsOfExperience: personYears,
      skills: skills || '',
      portfolio: portfolio || '',
      noticePeriod: noticePeriod || 'Immediate',
      whySriVoraTech: whySriVoraTech || '',
      resume: resumeFile ? {
        filename: resumeFile.filename,
        originalname: resumeFile.originalname,
        path: resumeFile.path,
        size: resumeFile.size,
      } : null,
      submittedAt: new Date().toISOString(),
    }

    applications.push(application)
    saveApplicationLocally(application)

    // Add to Google Sheets with complete details
    await addRowToSheet({
      'Application ID': application.id,
      'Type': 'Experienced',
      'Full Name': application.fullName,
      'First Name': application.firstName,
      'Last Name': application.lastName,
      'Email': email,
      'Phone': phone,
      'Address': application.address,
      'College / Company': company || application.address,
      'Degree / Designation': designation || '',
      'Category': application.category,
      'Role': application.role,
      'Years of Experience': application.yearsOfExperience,
      'Skills': skills || '',
      'Portfolio': portfolio || '',
      'Notice Period': noticePeriod || '',
      'Why SriVoraTech': whySriVoraTech || '',
      'Resume Filename': resumeFile ? resumeFile.originalname : '',
      'Submitted At': application.submittedAt,
    })

    console.log('New experienced application processed:', application.fullName)

    res.status(200).json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: application.id,
    })
  } catch (error) {
    console.error('Error processing experienced application:', error)
    res.status(500).json({ 
      success: false, 
      message: 'Error processing application',
    })
  }
})

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir))

// ── Database Setup for Reviews ──
const reviewsDataPath = path.join(uploadsDir, 'reviews.json')

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
    timestamp: 1784534400000,
    company: 'SriVoraTech',
    profileImage: ''
  }
]

// Initialize reviews file if it does not exist
if (!fs.existsSync(reviewsDataPath)) {
  fs.writeFileSync(reviewsDataPath, JSON.stringify(DEFAULT_REVIEWS, null, 2))
}

// Helper functions for reading/writing reviews
function getReviews() {
  try {
    if (fs.existsSync(reviewsDataPath)) {
      const parsed = JSON.parse(fs.readFileSync(reviewsDataPath, 'utf8'))
      if (Array.isArray(parsed) && parsed.length > 0) {
        global._svt_in_memory_reviews = parsed
        return parsed
      }
    }
  } catch (err) {
    console.error('Error reading reviews:', err)
  }
  if (!global._svt_in_memory_reviews) {
    global._svt_in_memory_reviews = [...DEFAULT_REVIEWS]
  }
  return global._svt_in_memory_reviews
}

function saveReviews(reviews) {
  global._svt_in_memory_reviews = reviews
  try {
    const dir = path.dirname(reviewsDataPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(reviewsDataPath, JSON.stringify(reviews, null, 2))
  } catch (err) {
    console.error('Error writing reviews:', err)
  }
}

// Simple IP-based rate limiting memory store
const submissionRateLimit = new Map()

// Helper to clean HTML tags (XSS protection)
function sanitizeInput(str = '') {
  return str.replace(/<[^>]*>/g, '').trim()
}

// ── Public APIs for Reviews ──

// GET approved reviews + summary metrics
app.get('/api/reviews', (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    const reviews = getReviews()
    const approvedReviews = reviews.filter(r => r.status === 'Approved')
    
    // Sort newest first
    approvedReviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    const totalApproved = approvedReviews.length
    const sum = approvedReviews.reduce((acc, curr) => acc + (parseInt(curr.star, 10) || 5), 0)
    const averageRating = totalApproved > 0 ? parseFloat((sum / totalApproved).toFixed(1)) : 5.0

    // Rating distribution calculations
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    approvedReviews.forEach(r => {
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

    // Satisfaction score (percentage of 4 and 5 star ratings)
    const highRatings = counts[5] + counts[4]
    const satisfactionRate = totalApproved > 0
      ? Math.round((highRatings / totalApproved) * 100)
      : 100

    const displayReviews = approvedReviews.slice(0, 100)

    res.json({
      success: true,
      reviews: displayReviews,
      totalCount: totalApproved,
      averageRating,
      distribution: percentages,
      counts,
      satisfactionRate
    })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve reviews' })
  }
})

// POST submit a review
app.post('/api/reviews', upload.single('profileImage'), (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress
    const now = Date.now()

    // Rate Limiting Check: Max 3 submissions per IP per hour
    const limitRecord = submissionRateLimit.get(ip) || []
    const oneHourAgo = now - 60 * 60 * 1000
    const recentSubmissions = limitRecord.filter(time => time > oneHourAgo)

    if (recentSubmissions.length >= 3) {
      return res.status(429).json({
        success: false,
        message: 'Too many submissions. Please wait an hour before submitting another review.'
      })
    }

    const { name, email, rating, comment, company } = req.body
    const imageFile = req.file

    if (!name || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Name, Star Rating, and Review Message are required fields.'
      })
    }

    const starNum = parseInt(rating, 10)
    if (isNaN(starNum) || starNum < 1 || starNum > 5) {
      return res.status(400).json({
        success: false,
        message: 'Star Rating must be an integer between 1 and 5.'
      })
    }

    // Input sanitization
    const cleanName = sanitizeInput(name)
    const cleanComment = sanitizeInput(comment)
    const cleanEmail = email ? sanitizeInput(email) : ''
    const cleanCompany = company ? sanitizeInput(company) : ''
    const profileImagePath = imageFile ? `/uploads/${imageFile.filename}` : ''

    const reviews = getReviews()

    // Prevent duplicate spam check
    const isDuplicate = reviews.some(r => 
      r.name.toLowerCase() === cleanName.toLowerCase() && 
      r.comment.toLowerCase() === cleanComment.toLowerCase()
    )

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate submission detected. This review has already been received.'
      })
    }

    const newReview = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: cleanName,
      email: cleanEmail,
      star: starNum,
      comment: cleanComment,
      company: cleanCompany,
      profileImage: profileImagePath,
      status: 'Approved', // Display live to all visitors immediately!
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      timestamp: now
    }

    reviews.unshift(newReview)
    saveReviews(reviews)

    // Save submission time to rate limit list
    recentSubmissions.push(now)
    submissionRateLimit.set(ip, recentSubmissions)

    res.json({
      success: true,
      message: 'Review submitted successfully! Your rating has been saved and is now live for all visitors.',
      review: newReview
    })
  } catch (err) {
    console.error('Submit review error:', err)
    res.status(500).json({ success: false, message: 'Failed to process submission' })
  }
})

// ── Admin Review Console APIs ──

const ADMIN_TOKEN = 'srivoratech_admin_secure_session_token_2026'

// Admin Login
app.post('/api/admin/login', (req, res) => {
  return res.json({
    success: true,
    token: ADMIN_TOKEN
  })
})

// Admin authorization middleware
function requireAdmin(req, res, next) {
  const token = req.headers['x-admin-token']
  if (token === ADMIN_TOKEN) {
    return next()
  }
  res.status(403).json({ success: false, message: 'Access denied: Administrator authentication required' })
}

// GET all reviews with query search & filter
app.get('/api/admin/reviews', requireAdmin, (req, res) => {
  try {
    const { search, rating, status } = req.query
    let reviews = getReviews()

    // Filter by rating level
    if (rating) {
      const rVal = parseInt(rating, 10)
      reviews = reviews.filter(r => r.star === rVal)
    }

    // Filter by status (Pending, Approved, Rejected)
    if (status) {
      reviews = reviews.filter(r => r.status.toLowerCase() === status.toLowerCase())
    }

    // Search query matching
    if (search) {
      const query = search.toLowerCase()
      reviews = reviews.filter(r => 
        r.name.toLowerCase().includes(query) || 
        r.comment.toLowerCase().includes(query) || 
        (r.company && r.company.toLowerCase().includes(query))
      )
    }

    // Sort newest first
    reviews.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

    res.json({ success: true, reviews })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load reviews' })
  }
})

// Approve review
app.post('/api/admin/reviews/:id/approve', requireAdmin, (req, res) => {
  try {
    const rId = req.params.id
    const reviews = getReviews()
    const match = reviews.find(r => String(r.id) === String(rId))

    if (!match) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    match.status = 'Approved'
    saveReviews(reviews)
    res.json({ success: true, message: 'Review approved successfully', review: match })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to approve review' })
  }
})

// Reject review
app.post('/api/admin/reviews/:id/reject', requireAdmin, (req, res) => {
  try {
    const rId = req.params.id
    const reviews = getReviews()
    const match = reviews.find(r => String(r.id) === String(rId))

    if (!match) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    match.status = 'Rejected'
    saveReviews(reviews)
    res.json({ success: true, message: 'Review rejected successfully', review: match })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to reject review' })
  }
})

// Delete review
app.delete('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  try {
    const rId = req.params.id
    let reviews = getReviews()
    const originalLength = reviews.length
    reviews = reviews.filter(r => String(r.id) !== String(rId))

    if (reviews.length === originalLength) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    saveReviews(reviews)
    res.json({ success: true, message: 'Review deleted successfully' })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete review' })
  }
})

// Edit review
app.put('/api/admin/reviews/:id', requireAdmin, (req, res) => {
  try {
    const rId = req.params.id
    const { name, star, comment, company } = req.body
    const reviews = getReviews()
    const match = reviews.find(r => String(r.id) === String(rId))

    if (!match) {
      return res.status(404).json({ success: false, message: 'Review not found' })
    }

    if (name) match.name = sanitizeInput(name)
    if (comment) match.comment = sanitizeInput(comment)
    if (company !== undefined) match.company = sanitizeInput(company)
    
    if (star !== undefined) {
      const sVal = parseInt(star, 10)
      if (!isNaN(sVal) && sVal >= 1 && sVal <= 5) {
        match.star = sVal
      }
    }

    saveReviews(reviews)
    res.json({ success: true, message: 'Review updated successfully', review: match })
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to edit review' })
  }
})

// Get all applications (for admin purposes)
app.get('/api/applications', (req, res) => {
  res.json(applications)
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error)
  res.status(500).json({ 
    success: false, 
    message: error.message || 'Internal server error' 
  })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
  console.log(`API endpoints:`)
  console.log(`  POST http://localhost:${PORT}/api/apply/fresher`)
  console.log(`  POST http://localhost:${PORT}/api/apply/experienced`)
  console.log(`  GET  http://localhost:${PORT}/api/applications`)
})

