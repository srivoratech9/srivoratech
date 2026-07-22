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

