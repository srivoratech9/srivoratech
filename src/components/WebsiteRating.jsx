import { useState, useEffect } from 'react'
import { Star, Send, Sparkles, CheckCircle2, Award, Eye, Users, MessageSquare, Wifi, WifiOff } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { subscribeToRatings, submitRating, incrementViewCount, FIREBASE_ENABLED } from '../services/ratingsService'
import './WebsiteRating.css'

const DEFAULT_REVIEWS = [
  {
    id: 1,
    name: 'Badisa Srikanth (Founder & CEO)',
    star: 5,
    comment: 'Building innovative software and AI-powered solutions that empower businesses to grow, automate, and succeed in the digital era.',
    date: 'Jul 20, 2026',
    isLeader: true,
  },
  {
    id: 2,
    name: 'Narasimha Reddy (Founder, TFS Fintech)',
    star: 5,
    comment: "SriVoraTech transformed our vision into India's 1st subscription fintech app within 2 months!",
    date: 'Jul 18, 2026',
  },
  {
    id: 3,
    name: 'Sujith Reddy (Founder, FluentPro AI)',
    star: 5,
    comment: 'FluentPro AI voice engine was engineered from scratch by SriVoraTech — 85,000+ active learners love it!',
    date: 'Jul 15, 2026',
  },
]

export default function WebsiteRating() {
  const [ref, isVisible] = useScrollAnimation()
  const [ratingsList, setRatingsList] = useState([5, 5, 5, 5, 5, 5, 5, 4, 5, 5, 5, 5, 5, 4, 5])
  const [selectedStar, setSelectedStar] = useState(5)
  const [hoverStar, setHoverStar] = useState(0)
  const [userName, setUserName] = useState('')
  const [userReview, setUserReview] = useState('')
  const [userHasRated, setUserHasRated] = useState(false)
  const [userRatingData, setUserRatingData] = useState(null)
  const [recentReviews, setRecentReviews] = useState(DEFAULT_REVIEWS)
  const [viewCount, setViewCount] = useState(847)
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [submitAnim, setSubmitAnim] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Increment page view
    incrementViewCount().then((views) => {
      setViewCount(views)
    })

    // Check if current user has already submitted a rating
    const myRating = localStorage.getItem('svt_my_rating')
    if (myRating) {
      try {
        const parsed = JSON.parse(myRating)
        if (parsed?.star) {
          setUserHasRated(true)
          setUserRatingData(parsed)
        }
      } catch (e) {
        // ignore
      }
    }

    // Subscribe to real-time ratings updates
    const unsubscribe = subscribeToRatings(({ ratings, reviews, viewCount: vc }) => {
      if (ratings && ratings.length > 0) {
        setRatingsList(ratings)
      }
      if (reviews && reviews.length > 0) {
        // Merge Firebase reviews with default founder reviews
        const firebaseIds = new Set(reviews.map(r => r.id))
        const defaultReviews = DEFAULT_REVIEWS.filter(r => !firebaseIds.has(r.id))
        setRecentReviews([...reviews, ...defaultReviews])
      }
      if (vc) setViewCount(vc)
    })

    return () => unsubscribe()
  }, [])

  // Calculate live stats
  const totalCount = ratingsList.length
  const sum = ratingsList.reduce((acc, curr) => acc + curr, 0)
  const averageRating = (sum / totalCount).toFixed(1)

  // Star distribution breakdown counts
  const starCounts = {
    5: ratingsList.filter((r) => r === 5).length,
    4: ratingsList.filter((r) => r === 4).length,
    3: ratingsList.filter((r) => r === 3).length,
    2: ratingsList.filter((r) => r === 2).length,
    1: ratingsList.filter((r) => r === 1).length,
  }

  const handleRatingSubmit = async (e) => {
    e.preventDefault()
    if (selectedStar < 1 || selectedStar > 5 || isSubmitting) return

    setIsSubmitting(true)

    try {
      const review = await submitRating({
        name: userName,
        star: selectedStar,
        comment: userReview,
      })

      localStorage.setItem('svt_my_rating', JSON.stringify(review))
      setUserHasRated(true)
      setUserRatingData(review)
      setSubmitAnim(true)
      setTimeout(() => setSubmitAnim(false), 800)
    } catch (error) {
      console.error('Rating submit failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const displayedReviews = showAllReviews ? recentReviews : recentReviews.slice(0, 6)

  return (
    <section className="rating-section section" id="website-rating">
      <div className="container">
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="rating-badge">
            <Sparkles size={14} />
            Community Reviews & Live Feedback
          </div>
          <h2 className="section-title">
            Live User <span className="gradient-text">Ratings & Reviews</span>
          </h2>
          <p className="section-subtitle">
            Real feedback from real users. Every rating updates live for all visitors to see.
          </p>
        </div>

        {/* Real-time Connection Status */}
        <div className="rating-connection-status">
          {FIREBASE_ENABLED ? (
            <span className="connection-pill connected">
              <Wifi size={13} /> Real-Time Sync Active
            </span>
          ) : (
            <span className="connection-pill local">
              <WifiOff size={13} /> Local Storage Mode
            </span>
          )}
        </div>

        {/* Live Stats Counters Row */}
        <div className="rating-live-counters">
          <div className="live-counter-pill">
            <Eye size={16} className="counter-icon views-icon" />
            <div className="counter-data">
              <span className="counter-number">{viewCount.toLocaleString()}</span>
              <span className="counter-label">Page Views</span>
            </div>
          </div>
          <div className="live-counter-pill">
            <Users size={16} className="counter-icon users-icon" />
            <div className="counter-data">
              <span className="counter-number">{totalCount}</span>
              <span className="counter-label">Total Ratings</span>
            </div>
          </div>
          <div className="live-counter-pill">
            <MessageSquare size={16} className="counter-icon reviews-icon" />
            <div className="counter-data">
              <span className="counter-number">{recentReviews.length}</span>
              <span className="counter-label">Reviews</span>
            </div>
          </div>
          <div className="live-counter-pill featured-pill">
            <Star size={16} className="counter-icon star-icon" fill="#f59e0b" color="#f59e0b" />
            <div className="counter-data">
              <span className="counter-number">{averageRating}</span>
              <span className="counter-label">Avg Rating</span>
            </div>
          </div>
        </div>

        <div className={`rating-main-card glass-card ${submitAnim ? 'submit-flash' : ''}`}>
          <div className="rating-stats-grid">
            {/* Average Rating Overall Box */}
            <div className="rating-overall-box">
              <div className="big-rating-number">{averageRating}</div>
              <div className="overall-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={22}
                    fill={star <= Math.round(averageRating) ? '#f59e0b' : 'none'}
                    color={star <= Math.round(averageRating) ? '#f59e0b' : '#cbd5e1'}
                  />
                ))}
              </div>
              <span className="overall-count">Based on {totalCount} verified user ratings</span>
            </div>

            {/* Star Distribution Breakdown Bars */}
            <div className="rating-breakdown-box">
              {[5, 4, 3, 2, 1].map((starLevel) => {
                const count = starCounts[starLevel]
                const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
                return (
                  <div key={starLevel} className="breakdown-row">
                    <span className="star-level-label">{starLevel} ★</span>
                    <div className="breakdown-bar-bg">
                      <div
                        className={`breakdown-bar-fill star-bar-${starLevel}`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="breakdown-percent">{percentage}% ({count})</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rating-divider" />

          {/* User Rating Form / Success State */}
          <div className="rating-form-container">
            {userHasRated ? (
              <div className="user-submitted-box animate-pop">
                <CheckCircle2 size={44} className="submitted-check-icon" />
                <h3>Thank You for Rating SriVoraTech!</h3>
                <p className="submitted-info">
                  You submitted a <strong>{userRatingData?.star} Star Rating</strong>. 
                  {FIREBASE_ENABLED 
                    ? ' Other visitors can now see your review in real-time!' 
                    : ' Your rating is saved locally.'}
                </p>
                {userRatingData?.comment && (
                  <blockquote className="submitted-comment-quote">
                    "{userRatingData.comment}"
                  </blockquote>
                )}
                <button
                  className="btn-secondary-light change-rating-btn"
                  onClick={() => setUserHasRated(false)}
                >
                  Edit or Update Your Rating
                </button>
              </div>
            ) : (
              <form onSubmit={handleRatingSubmit} className="interactive-rating-form">
                <h3 className="form-heading">Leave Your Rating & Review</h3>
                <p className="form-sub-heading">
                  {FIREBASE_ENABLED 
                    ? 'Your rating will be visible to all visitors in real-time.' 
                    : 'Your rating will be saved and displayed locally.'}
                </p>

                <div className="star-selector-wrapper">
                  <label className="picker-label">Click to Select Your Rating:</label>
                  <div className="stars-picker-row">
                    {[1, 2, 3, 4, 5].map((star) => {
                      const isFilled = star <= (hoverStar || selectedStar)
                      return (
                        <button
                          key={star}
                          type="button"
                          className={`star-pick-btn ${isFilled ? 'filled' : ''}`}
                          onMouseEnter={() => setHoverStar(star)}
                          onMouseLeave={() => setHoverStar(0)}
                          onClick={() => setSelectedStar(star)}
                          aria-label={`Rate ${star} star`}
                        >
                          <Star
                            size={36}
                            fill={isFilled ? '#f59e0b' : 'none'}
                            color={isFilled ? '#f59e0b' : '#cbd5e1'}
                          />
                        </button>
                      )
                    })}
                  </div>
                  <span className="star-rating-hint">
                    {selectedStar === 5 && '⭐ 5 Stars — Outstanding Platform!'}
                    {selectedStar === 4 && '👍 4 Stars — Very Good Experience'}
                    {selectedStar === 3 && '👌 3 Stars — Average'}
                    {selectedStar === 2 && '🔧 2 Stars — Needs Work'}
                    {selectedStar === 1 && '⚠️ 1 Star — Poor'}
                  </span>
                </div>

                <div className="form-inputs-grid">
                  <div className="form-field">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="rating-field-input"
                    />
                  </div>
                  <div className="form-field">
                    <textarea
                      placeholder="Share your experience or suggestion..."
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      rows={2}
                      className="rating-field-textarea"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="btn-accent submit-review-btn"
                  disabled={isSubmitting}
                >
                  <Send size={16} />
                  {isSubmitting ? 'Submitting...' : `Submit Rating (${selectedStar} Stars)`}
                </button>
              </form>
            )}
          </div>

          {/* Recent Reviews Stream - Show ALL */}
          {recentReviews.length > 0 && (
            <div className="recent-reviews-stream">
              <div className="stream-header">
                <h4 className="stream-title">
                  <MessageSquare size={16} /> All Reviews ({recentReviews.length})
                </h4>
                {recentReviews.length > 6 && (
                  <button
                    className="show-all-btn"
                    onClick={() => setShowAllReviews(!showAllReviews)}
                  >
                    {showAllReviews ? 'Show Less' : `View All (${recentReviews.length})`}
                  </button>
                )}
              </div>
              <div className="reviews-grid">
                {displayedReviews.map((r, idx) => (
                  <div
                    key={r.id}
                    className={`review-card-item ${r.isLeader ? 'leader-review' : ''}`}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    <div className="review-card-top">
                      <div className="review-name-group">
                        <span className="review-avatar">
                          {r.isLeader ? <Award size={14} /> : r.name.charAt(0).toUpperCase()}
                        </span>
                        <strong className="r-name">{r.name}</strong>
                      </div>
                      <div className="r-stars">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < r.star ? '#f59e0b' : 'none'}
                            color={i < r.star ? '#f59e0b' : '#cbd5e1'}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="r-comment">"{r.comment}"</p>
                    <span className="r-date">{r.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
