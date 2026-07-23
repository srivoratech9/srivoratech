// Vercel Serverless Function for /api/reviews
// Automatically deployed by Vercel for https://srivoratech.vercel.app/api/reviews

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

let inMemoryReviews = [...DEFAULT_REVIEWS]

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

  if (req.method === 'POST') {
    try {
      const { name, rating, comment, email, company } = req.body || {}
      if (!name || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: 'Name, Star Rating, and Review Message are required.'
        })
      }

      const newReview = {
        id: Date.now(),
        name: String(name).replace(/<[^>]*>/g, '').trim(),
        email: email ? String(email).replace(/<[^>]*>/g, '').trim() : '',
        star: parseInt(rating, 10) || 5,
        comment: String(comment).replace(/<[^>]*>/g, '').trim(),
        company: company ? String(company).replace(/<[^>]*>/g, '').trim() : '',
        status: 'Approved', // Auto approve on serverless instance
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timestamp: Date.now()
      }

      inMemoryReviews.unshift(newReview)

      return res.status(200).json({
        success: true,
        message: 'Review submitted successfully!',
        review: newReview
      })
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message })
    }
  }

  res.status(405).json({ success: false, message: 'Method Not Allowed' })
}
