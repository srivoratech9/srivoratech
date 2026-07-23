// Real-time Ratings & Admin Review Service
// Communicates with our server database with instant zero-flashing master persistence

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

function getStoredMasterReviews() {
  try {
    const data = localStorage.getItem('svt_master_reviews_store')
    if (data) {
      const parsed = JSON.parse(data)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {}
  return []
}

function saveStoredMasterReviews(reviews) {
  try {
    localStorage.setItem('svt_master_reviews_store', JSON.stringify(reviews))
  } catch (e) {}
}

function mergeUniqueReviews(existing = [], incoming = []) {
  const map = new Map()
  
  // 1. Add incoming server reviews
  incoming.forEach(r => {
    if (r && r.id) {
      map.set(String(r.id), r)
    }
  })

  // 2. Merge existing local reviews so user ratings are never lost across cold serverless containers
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
 * Polls the public reviews endpoint directly from server with persistent fallback
 */
export function subscribeToRatings(callback) {
  let prevReviewsString = ''

  // 1. Render master stored reviews immediately in 0ms (no loading skeleton delay, no flickering)
  const initialLocal = getStoredMasterReviews()
  if (initialLocal.length > 0) {
    prevReviewsString = JSON.stringify(initialLocal)
    callback(calculateMetrics(initialLocal))
  }

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
        const localMaster = getStoredMasterReviews()
        const mergedReviews = mergeUniqueReviews(localMaster, data.reviews)
        saveStoredMasterReviews(mergedReviews)

        const currentReviewsString = JSON.stringify(mergedReviews)

        if (currentReviewsString !== prevReviewsString) {
          prevReviewsString = currentReviewsString
          callback(calculateMetrics(mergedReviews))
        }
      }
    } catch (err) {
      console.warn('Live ratings fetch status:', err.message)
    }
  }

  // Fetch immediately from server
  fetchUpdatedRatings()

  // Listen to immediate refresh events & tab focus
  window.addEventListener('svt_reviews_changed', fetchUpdatedRatings)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      fetchUpdatedRatings()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Fast polling every 2.5 seconds for instant multi-user synchronization
  const interval = setInterval(fetchUpdatedRatings, 2500)

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

    // Save submitted review to local master store immediately
    if (result && result.review) {
      const localMaster = getStoredMasterReviews()
      const updatedMaster = mergeUniqueReviews(localMaster, [result.review])
      saveStoredMasterReviews(updatedMaster)
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
  try {
    const current = localStorage.getItem('svt_page_views') || '847'
    const count = parseInt(current, 10) + 1
    localStorage.setItem('svt_page_views', count.toString())
    return count
  } catch (e) {
    return 847
  }
}

// ── Admin Section Services ──

/**
 * Admin Login
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

  if (result.token) {
    saveAdminToken(result.token)
  }
  return result
}

/**
 * Get all reviews for admin console directly from server & database
 */
export async function adminGetReviews({ search = '', rating = '', status = '' } = {}) {
  const token = getAdminToken()
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (rating) params.append('rating', rating)
  if (status) params.append('status', status)

  const response = await fetch(`/api/admin/reviews?${params.toString()}`, {
    headers: {
      'x-admin-token': token
    }
  })

  const result = await response.json()
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch reviews')
  }

  return Array.isArray(result.reviews) ? result.reviews : (Array.isArray(result) ? result : [])
}

/**
 * Approve a review in server database
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
 * Reject a review in server database
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
 * Edit a review in server database
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
 * Delete a review from server database
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

  // Remove deleted review from local master store
  try {
    const localMaster = getStoredMasterReviews()
    const filtered = localMaster.filter(r => String(r.id) !== String(id) && Number(r.id) !== parseInt(id, 10))
    saveStoredMasterReviews(filtered)
  } catch (e) {}

  window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
  return result
}

/**
 * Increment helpful count for a review
 */
export async function markReviewHelpful(id) {
  try {
    const response = await fetch(`/api/reviews?action=helpful&id=${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    const result = await response.json()
    window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
    return result
  } catch (e) {
    return { success: false }
  }
}
