// Real-time Ratings Service
// Uses Firebase Realtime Database for cross-browser data sharing
// Falls back to localStorage if Firebase is not configured

import { db } from '../firebase'
import { ref, push, onValue, set, get } from 'firebase/database'

const FIREBASE_ENABLED = !!db

// ── localStorage fallback helpers ──
function getLocalRatings() {
  try {
    const saved = localStorage.getItem('svt_ratings_array')
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

function getLocalReviews() {
  try {
    const saved = localStorage.getItem('svt_user_reviews_list')
    return saved ? JSON.parse(saved) : null
  } catch { return null }
}

function getLocalViews() {
  return parseInt(localStorage.getItem('svt_page_views') || '847', 10)
}

// ── Firebase Real-time Listeners ──

/**
 * Subscribe to real-time reviews from Firebase
 * @param {Function} callback - receives { reviews: [], ratings: [], viewCount: number }
 * @returns {Function} unsubscribe function
 */
export function subscribeToRatings(callback) {
  if (!FIREBASE_ENABLED) {
    // Fallback: load from localStorage once
    const ratings = getLocalRatings() || [5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5]
    const reviews = getLocalReviews() || []
    const views = getLocalViews()
    callback({ ratings, reviews, viewCount: views })
    return () => {} // no-op unsubscribe
  }

  // Listen to reviews node
  const reviewsRef = ref(db, 'ratings/reviews')
  const viewsRef = ref(db, 'ratings/viewCount')

  const unsubReviews = onValue(reviewsRef, (snapshot) => {
    const data = snapshot.val()
    let reviews = []
    let ratings = [5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5] // base ratings

    if (data) {
      reviews = Object.values(data).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      // Add user-submitted ratings to base
      const userRatings = reviews.map(r => r.star)
      ratings = [...ratings, ...userRatings]
    }

    // Also get view count
    get(viewsRef).then((viewSnap) => {
      const viewCount = viewSnap.val() || 847
      callback({ ratings, reviews, viewCount })
    }).catch(() => {
      callback({ ratings, reviews, viewCount: 847 })
    })
  })

  return () => unsubReviews()
}

/**
 * Submit a new rating/review
 */
export async function submitRating({ name, star, comment }) {
  const review = {
    id: Date.now(),
    name: name.trim() || 'Verified Visitor',
    star,
    comment: comment.trim() || 'Great digital product engineering and smooth performance!',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timestamp: Date.now(),
  }

  if (FIREBASE_ENABLED) {
    try {
      const reviewsRef = ref(db, 'ratings/reviews')
      await push(reviewsRef, review)
      return review
    } catch (error) {
      console.warn('Firebase write failed, saving locally:', error)
    }
  }

  // Fallback: save to localStorage
  const existingRatings = getLocalRatings() || [5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5]
  const updatedRatings = [...existingRatings, star]
  localStorage.setItem('svt_ratings_array', JSON.stringify(updatedRatings))

  const existingReviews = getLocalReviews() || []
  const updatedReviews = [review, ...existingReviews]
  localStorage.setItem('svt_user_reviews_list', JSON.stringify(updatedReviews))

  localStorage.setItem('svt_my_rating', JSON.stringify(review))

  return review
}

/**
 * Increment page view counter
 */
export async function incrementViewCount() {
  if (FIREBASE_ENABLED) {
    try {
      const viewsRef = ref(db, 'ratings/viewCount')
      const snapshot = await get(viewsRef)
      const current = snapshot.val() || 847
      await set(viewsRef, current + 1)
      return current + 1
    } catch (error) {
      console.warn('Firebase view increment failed:', error)
    }
  }

  // Fallback: localStorage
  let views = getLocalViews()
  views += 1
  localStorage.setItem('svt_page_views', String(views))
  return views
}

export { FIREBASE_ENABLED }
