// Real-time Ratings & Admin Review Service
// Communicates directly with our Express backend & MongoDB Atlas database

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

// ── Public Ratings / Reviews ──

/**
 * Polls the public reviews endpoint directly from server and MongoDB database
 */
export function subscribeToRatings(callback) {
  let prevReviewsString = ''

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
        const currentReviewsString = JSON.stringify(data.reviews)

        if (currentReviewsString !== prevReviewsString) {
          prevReviewsString = currentReviewsString
          callback({
            ratings: data.reviews.map(r => parseInt(r.star, 10) || 5),
            reviews: data.reviews,
            viewCount: data.reviews.length * 28 + 847,
            totalCount: data.totalCount !== undefined ? data.totalCount : data.reviews.length,
            averageRating: data.averageRating !== undefined ? data.averageRating : 5.0,
            distribution: data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            counts: data.counts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
            satisfactionRate: data.satisfactionRate !== undefined ? data.satisfactionRate : 100
          })
        }
      }
    } catch (err) {
      console.warn('Live database connection status:', err.message)
    }
  }

  // Fetch immediately from MongoDB server
  fetchUpdatedRatings()

  // Listen to immediate refresh events & tab focus
  window.addEventListener('svt_reviews_changed', fetchUpdatedRatings)
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      fetchUpdatedRatings()
    }
  }
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // Poll server & MongoDB Atlas every 3 seconds
  const interval = setInterval(fetchUpdatedRatings, 3000)

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

  return result
}

/**
 * Approve a review in MongoDB database
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
 * Reject a review in MongoDB database
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
 * Edit a review in MongoDB database
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
 * Delete a review from MongoDB database
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
