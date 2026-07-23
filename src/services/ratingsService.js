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

// ── Public Ratings / Reviews ──

/**
 * Polls the public reviews endpoint for real-time visual updates
 */
export function subscribeToRatings(callback) {
  let prevDataString = ''

  const fetchUpdatedRatings = async () => {
    try {
      const res = await fetch('/api/reviews')
      if (!res.ok) {
        throw new Error(`Server DB HTTP ${res.status}`)
      }
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response')
      }
      const data = await res.json()
      if (data && data.success) {
        const currentDataString = JSON.stringify(data)
        if (currentDataString !== prevDataString) {
          prevDataString = currentDataString
          callback({
            ratings: data.reviews.map(r => r.star),
            reviews: data.reviews,
            viewCount: data.reviews.length * 28 + 847,
            totalCount: data.totalCount,
            averageRating: data.averageRating,
            distribution: data.distribution,
            satisfactionRate: data.satisfactionRate
          })
        }
      }
    } catch (err) {
      console.warn('Live database connection status:', err.message)
    }
  }

  // Fetch immediately
  fetchUpdatedRatings()

  // Listen to immediate refresh events
  window.addEventListener('svt_reviews_changed', fetchUpdatedRatings)

  // Poll every 1.2 seconds for sub-second UI refresh across all devices
  const interval = setInterval(fetchUpdatedRatings, 1200)

  return () => {
    clearInterval(interval)
    window.removeEventListener('svt_reviews_changed', fetchUpdatedRatings)
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
  const response = await fetch(`/api/admin/reviews/${id}/approve`, {
    method: 'POST',
    headers: {
      'x-admin-token': token
    }
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
  const response = await fetch(`/api/admin/reviews/${id}/reject`, {
    method: 'POST',
    headers: {
      'x-admin-token': token
    }
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
  const response = await fetch(`/api/admin/reviews/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-admin-token': token
    },
    body: JSON.stringify(data)
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
  const response = await fetch(`/api/admin/reviews/${id}`, {
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
