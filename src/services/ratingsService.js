// Real-time Ratings & Admin Review Service
// Communicates with our Express backend database

// Client helper to get the saved admin token
export function getAdminToken() {
  return localStorage.getItem('svt_admin_token') || ''
}

export function saveAdminToken(token) {
  localStorage.setItem('svt_admin_token', token)
}

export function removeAdminToken() {
  localStorage.removeItem('svt_admin_token')
}

function calculateMetrics(reviewsList = []) {
  const approved = reviewsList.filter(r => r.status === 'Approved')
  approved.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))

  const totalCount = approved.length
  const sum = approved.reduce((acc, curr) => acc + (parseInt(curr.star, 10) || 5), 0)
  const averageRating = totalCount > 0 ? parseFloat((sum / totalCount).toFixed(1)) : 5.0

  const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  approved.forEach(r => {
    const s = parseInt(r.star, 10) || 5
    if (counts[s] !== undefined) {
      counts[s]++
    }
  })

  const distribution = {}
  Object.keys(counts).forEach(star => {
    distribution[star] = totalCount > 0 
      ? Math.round((counts[star] / totalCount) * 100)
      : 0
  })

  const highRatings = counts[5] + counts[4]
  const satisfactionRate = totalCount > 0
    ? Math.round((highRatings / totalCount) * 100)
    : 100

  return {
    ratings: approved.map(r => parseInt(r.star, 10) || 5),
    reviews: approved,
    viewCount: approved.length * 28 + 847,
    totalCount,
    averageRating,
    distribution,
    counts,
    satisfactionRate
  }
}

function mergeUniqueReviews(existing = [], incoming = []) {
  const map = new Map()
  
  incoming.forEach(r => {
    if (r && r.id) {
      map.set(String(r.id), r)
    }
  })

  existing.forEach(r => {
    if (r && r.id) {
      if (!map.has(String(r.id))) {
        map.set(String(r.id), r)
      }
    }
  })

  const merged = Array.from(map.values())
  merged.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  return merged
}

// ── Public Ratings / Reviews ──

/**
 * Polls the public reviews endpoint for real-time visual updates
 */
export function subscribeToRatings(callback) {
  let prevReviewsString = ''
  let currentLocalReviews = []

  // 1. Read local cache immediately for zero-lag 0ms initial rendering
  try {
    const cached = localStorage.getItem('svt_reviews_cache')
    if (cached) {
      const parsedCache = JSON.parse(cached)
      if (parsedCache && Array.isArray(parsedCache.reviews) && parsedCache.reviews.length > 0) {
        currentLocalReviews = parsedCache.reviews
        prevReviewsString = JSON.stringify(currentLocalReviews)
        callback(calculateMetrics(currentLocalReviews))
      }
    }
  } catch (e) {}

  const fetchUpdatedRatings = async () => {
    try {
      const res = await fetch(`/api/reviews?_t=${Date.now()}`)
      if (!res.ok) {
        throw new Error(`Server DB HTTP ${res.status}`)
      }
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      const data = await res.json()
      if (data && data.success && Array.isArray(data.reviews)) {
        // Merge server reviews with local reviews so user ratings are never lost/dropped across serverless containers
        const mergedReviews = mergeUniqueReviews(currentLocalReviews, data.reviews)
        currentLocalReviews = mergedReviews
        const currentReviewsString = JSON.stringify(mergedReviews)

        if (currentReviewsString !== prevReviewsString) {
          prevReviewsString = currentReviewsString
          const payload = calculateMetrics(mergedReviews)
          try {
            localStorage.setItem('svt_reviews_cache', JSON.stringify({ ...payload, _raw: data }))
          } catch (e) {}
          callback(payload)
        }
      }
    } catch (err) {
      console.warn('Live database connection status:', err.message)
    }
  }

  // Fetch immediately
  fetchUpdatedRatings()

  // Listen to immediate refresh events & tab focus
  window.addEventListener('svt_reviews_changed', fetchUpdatedRatings)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      fetchUpdatedRatings()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Poll every 8 seconds for stable, non-glitching background sync
  const interval = setInterval(fetchUpdatedRatings, 8000)

  return () => {
    clearInterval(interval)
    window.removeEventListener('svt_reviews_changed', fetchUpdatedRatings)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
}

/**
 * Submit a customer rating with optional profile image upload
 */
export async function submitRating({ name, email, star, comment, company, profileImageFile }) {
  try {
    let response

    if (profileImageFile) {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('rating', star)
      formData.append('comment', comment)
      if (email) formData.append('email', email)
      if (company) formData.append('company', company)
      formData.append('profileImage', profileImageFile)

      response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData
      })
    } else {
      response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, rating: star, comment, company })
      })
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const contentType = response.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      throw new Error('Received non-JSON response')
    }

    const result = await response.json()
    if (!result.success) {
      throw new Error(result.message || 'Submission failed')
    }

    if (result && result.review) {
      try {
        const cachedStr = localStorage.getItem('svt_reviews_cache')
        let existingReviews = []
        if (cachedStr) {
          try {
            existingReviews = JSON.parse(cachedStr).reviews || []
          } catch (e) {}
        }
        const merged = mergeUniqueReviews(existingReviews, [result.review])
        const updatedMetrics = calculateMetrics(merged)
        localStorage.setItem('svt_reviews_cache', JSON.stringify({ ...updatedMetrics, _raw: result }))
      } catch (e) {}
    }

    window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
    return result
  } catch (err) {
    throw new Error(err.message || 'Unable to connect to database. Please check your network.')
  }
}

/**
 * Simple local page view incrementer
 */
export async function incrementViewCount() {
  let views = parseInt(localStorage.getItem('svt_page_views') || '847', 10)
  views += 1
  localStorage.setItem('svt_page_views', String(views))
  return views
}

// ── Admin Rating Management ──

/**
 * Admin login authentication
 */
export async function adminLogin(username, password) {
  const response = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Login failed')
  }

  if (result.success && result.token) {
    saveAdminToken(result.token)
  }

  return result
}

/**
 * Get all reviews (Approved/Pending/Rejected) for Admin console
 */
export async function adminGetReviews({ search = '', rating = '', status = '' } = {}) {
  const query = new URLSearchParams()
  if (search) query.append('search', search)
  if (rating) query.append('rating', rating)
  if (status) query.append('status', status)

  const token = getAdminToken()
  const response = await fetch(`/api/admin/reviews?${query.toString()}`, {
    headers: {
      'x-admin-token': token
    }
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Failed to load admin reviews')
  }

  return result.reviews || []
}

/**
 * Approve a review
 */
export async function adminApproveReview(id) {
  const token = getAdminToken()
  const response = await fetch(`/api/admin/reviews/${id}/approve?id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify({ id })
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Failed to approve review')
  }

  window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
  return result
}

/**
 * Reject a review
 */
export async function adminRejectReview(id) {
  const token = getAdminToken()
  const response = await fetch(`/api/admin/reviews/${id}/reject?id=${id}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify({ id })
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Failed to reject review')
  }

  window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
  return result
}

/**
 * Edit a review
 */
export async function adminEditReview(id, data) {
  const token = getAdminToken()
  const response = await fetch(`/api/admin/reviews/${id}?id=${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify({ ...data, id })
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update review')
  }

  window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
  return result
}

/**
 * Delete a review
 */
export async function adminDeleteReview(id) {
  const token = getAdminToken()
  const response = await fetch(`/api/admin/reviews/${id}?id=${id}`, {
    method: 'DELETE',
    headers: {
      'x-admin-token': token
    }
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete review')
  }

  window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
  return result
}
