import { useState, useEffect, useRef } from 'react'
import { Star, Send, Sparkles, CheckCircle2, Award, Eye, Users, MessageSquare, Shield, ShieldCheck, X, Edit, Trash, Lock, Search, Filter, RefreshCw, Upload, FileImage, ShieldAlert, ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '../hooks/useScrollAnimation'
import { subscribeToRatings, submitRating, incrementViewCount, adminLogin, adminGetReviews, adminApproveReview, adminRejectReview, adminEditReview, adminDeleteReview, getAdminToken, removeAdminToken } from '../services/ratingsService'
import './WebsiteRating.css'

export default function WebsiteRating() {
  const [ref, isVisible] = useScrollAnimation()
  
  // Public reviews state
  const [reviewsList, setReviewsList] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [averageRating, setAverageRating] = useState(5.0)
  const [distribution, setDistribution] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
  const [counts, setCounts] = useState({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
  const [satisfactionRate, setSatisfactionRate] = useState(100)
  const [viewCount, setViewCount] = useState(847)
  const [loading, setLoading] = useState(true)
  
  // Submit review form state
  const [selectedStar, setSelectedStar] = useState(5)
  const [hoverStar, setHoverStar] = useState(0)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [userCompany, setUserCompany] = useState('')
  const [userComment, setUserComment] = useState('')
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [profileImagePreview, setProfileImagePreview] = useState('')
  
  const [submittingReview, setSubmittingReview] = useState(false)
  const [userHasRated, setUserHasRated] = useState(false)
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState('')
  const [submitErrorMsg, setSubmitErrorMsg] = useState('')
  const [submitAnim, setSubmitAnim] = useState(false)
  
  // Pagination
  const [visibleCount, setVisibleCount] = useState(12)

  // Admin section state
  const [showAdminPortal, setShowAdminPortal] = useState(false)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false)
  const [adminUsername, setAdminUsername] = useState('')
  const [adminPassword, setAdminPassword] = useState('')
  const [adminError, setAdminError] = useState('')
  const [adminReviews, setAdminReviews] = useState([])
  const [adminSearch, setAdminSearch] = useState('')
  const [adminRatingFilter, setAdminRatingFilter] = useState('')
  const [adminStatusFilter, setAdminStatusFilter] = useState('')
  const [adminLoading, setAdminLoading] = useState(false)
  
  // Edit review modal state
  const [editingReview, setEditingReview] = useState(null)
  const [editName, setEditName] = useState('')
  const [editCompany, setEditCompany] = useState('')
  const [editStar, setEditStar] = useState(5)
  const [editComment, setEditComment] = useState('')
  
  const fileInputRef = useRef(null)
  const scrollStreamRef = useRef(null)

  const safeAdminReviews = Array.isArray(adminReviews) ? adminReviews : []

  const scrollStream = (direction) => {
    if (scrollStreamRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      scrollStreamRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  useEffect(() => {
    // Increment view count locally
    incrementViewCount().then(views => setViewCount(views))

    // Check if admin is already logged in (has token)
    const token = getAdminToken()
    if (token) {
      setIsAdminLoggedIn(true)
    }

    // Secret keyboard shortcut to toggle admin portal: Ctrl+Alt+A or Cmd+Alt+A
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault()
        setShowAdminPortal(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)

    // Subscribe to real-time ratings updates
    const unsubscribe = subscribeToRatings((data) => {
      if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
        setReviewsList(data.reviews)
        setTotalCount(data.totalCount || data.reviews.length)
        setAverageRating(data.averageRating || 5.0)
        setDistribution(data.distribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
        setCounts(data.counts || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 })
        setSatisfactionRate(data.satisfactionRate || 100)
      }
      setLoading(false)
    })

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      unsubscribe()
    }
  }, [])

  // Refetch admin reviews whenever filters change
  useEffect(() => {
    if (isAdminLoggedIn && showAdminPortal) {
      loadAdminReviews()
    }
  }, [isAdminLoggedIn, showAdminPortal, adminSearch, adminRatingFilter, adminStatusFilter])

  const loadAdminReviews = async () => {
    setAdminLoading(true)
    try {
      const res = await adminGetReviews({
        search: adminSearch,
        rating: adminRatingFilter,
        status: adminStatusFilter
      })
      const list = Array.isArray(res) ? res : (res && Array.isArray(res.reviews) ? res.reviews : [])
      setAdminReviews(list)
    } catch (err) {
      console.error(err)
      setAdminReviews([])
    } finally {
      setAdminLoading(false)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit.')
        return
      }
      setProfileImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    if (!userName.trim()) {
      setSubmitErrorMsg('Full Name is required.')
      return
    }
    if (!userComment.trim()) {
      setSubmitErrorMsg('Review message is required.')
      return
    }
    
    setSubmittingReview(true)
    setSubmitErrorMsg('')
    setSubmitSuccessMsg('')

    try {
      const res = await submitRating({
        name: userName,
        email: userEmail,
        star: selectedStar,
        comment: userComment,
        company: userCompany,
        profileImageFile
      })

      if (res.success) {
        setUserName('')
        setUserEmail('')
        setUserCompany('')
        setUserComment('')
        setProfileImageFile(null)
        setProfileImagePreview('')
        
        setUserHasRated(true)
        setSubmitSuccessMsg(res.message)
        setSubmitAnim(true)
        setTimeout(() => setSubmitAnim(false), 800)
      }
    } catch (err) {
      setSubmitErrorMsg(err.message || 'Failed to submit review. Please try again.')
    } finally {
      setSubmittingReview(false)
    }
  }

  // Admin Actions
  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setAdminError('')
    try {
      const res = await adminLogin(adminUsername, adminPassword)
      if (res.success) {
        setIsAdminLoggedIn(true)
        setAdminUsername('')
        setAdminPassword('')
      }
    } catch (err) {
      setAdminError(err.message || 'Authentication failed.')
    }
  }

  const handleAdminLogout = () => {
    removeAdminToken()
    setIsAdminLoggedIn(false)
    setShowAdminPortal(false)
  }

  const handleApprove = async (id) => {
    try {
      await adminApproveReview(id)
      loadAdminReviews()
      window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
    } catch (err) {
      alert('Error approving review: ' + err.message)
    }
  }

  const handleReject = async (id) => {
    try {
      await adminRejectReview(id)
      loadAdminReviews()
      window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
    } catch (err) {
      alert('Error rejecting review: ' + err.message)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this review?')) return
    try {
      await adminDeleteReview(id)
      loadAdminReviews()
      window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
    } catch (err) {
      alert('Error deleting review: ' + err.message)
    }
  }

  const openEditModal = (review) => {
    setEditingReview(review)
    setEditName(review.name)
    setEditCompany(review.company || '')
    setEditStar(review.star)
    setEditComment(review.comment)
  }

  const handleSaveEdit = async (e) => {
    e.preventDefault()
    try {
      await adminEditReview(editingReview.id, {
        name: editName,
        company: editCompany,
        star: editStar,
        comment: editComment
      })
      setEditingReview(null)
      loadAdminReviews()
      window.dispatchEvent(new CustomEvent('svt_reviews_changed'))
    } catch (err) {
      alert('Error saving review edits: ' + err.message)
    }
  }

  return (
    <section className="rating-section section" id="website-rating">
      <div className="container">
        
        {/* Public Header */}
        <div ref={ref} className={`animate-on-scroll ${isVisible ? 'visible' : ''}`}>
          <div className="rating-badge">
            <Sparkles size={14} />
            <span>Community Reviews & Feedback</span>
            <Lock 
              size={13} 
              className="admin-secret-lock" 
              onClick={() => setShowAdminPortal(!showAdminPortal)} 
              title="Admin Portal (Ctrl+Alt+A)" 
            />
          </div>
          <h2 className="section-title">
            Live User <span className="gradient-text">Ratings & Reviews</span>
          </h2>
          <p className="section-subtitle">
            Real feedback from real users. Every rating updates dynamically in real-time across all visitors.
          </p>
        </div>

        {/* ── ADMIN MANAGEMENT PORTAL ── */}
        {showAdminPortal ? (
          <div className="admin-portal-container glass-card animate-pop">
            {!isAdminLoggedIn ? (
              // Login Form
              <div className="admin-login-box">
                <div className="login-header">
                  <Lock size={32} className="lock-icon" />
                  <h3>Administrator Console Login</h3>
                  <p>Authenticate to approve, edit, reject, and moderate ratings.</p>
                </div>
                <form onSubmit={handleAdminLogin} className="admin-login-form">
                  <div className="form-group">
                    <label>Username</label>
                    <input 
                      type="text" 
                      placeholder="Enter administrator username" 
                      value={adminUsername}
                      onChange={e => setAdminUsername(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter security password" 
                      value={adminPassword}
                      onChange={e => setAdminPassword(e.target.value)}
                      required
                    />
                  </div>
                  {adminError && <div className="admin-error-banner"><ShieldAlert size={14} /> {adminError}</div>}
                  <button type="submit" className="btn-accent admin-login-btn">
                    Authenticate Session
                  </button>
                </form>
              </div>
            ) : (
              // Admin Review Dashboard
              <div className="admin-dashboard-box">
                <div className="dashboard-header">
                  <div className="header-titles">
                    <h3><ShieldCheck size={20} /> Review Moderation Dashboard</h3>
                    <p>Only Approved ratings will display live on the website.</p>
                  </div>
                  <button onClick={handleAdminLogout} className="btn-secondary-light logout-btn">
                    Logout Console
                  </button>
                </div>

                {/* Dashboard Stats */}
                <div className="admin-stats-summary-row">
                  <div className="admin-stat-card-mini">
                    <span className="mini-num">{safeAdminReviews.length}</span>
                    <span className="mini-lbl">Total Reviews</span>
                  </div>
                  <div className="admin-stat-card-mini pending-card">
                    <span className="mini-num">{safeAdminReviews.filter(r => r.status === 'Pending').length}</span>
                    <span className="mini-lbl">Pending Review</span>
                  </div>
                  <div className="admin-stat-card-mini approved-card">
                    <span className="mini-num">{safeAdminReviews.filter(r => r.status === 'Approved').length}</span>
                    <span className="mini-lbl">Approved Live</span>
                  </div>
                  <div className="admin-stat-card-mini rejected-card">
                    <span className="mini-num">{safeAdminReviews.filter(r => r.status === 'Rejected').length}</span>
                    <span className="mini-lbl">Rejected</span>
                  </div>
                </div>

                {/* Filter and Search Moderation Bar */}
                <div className="moderation-controls-bar">
                  <div className="search-box">
                    <Search size={16} className="search-icon" />
                    <input 
                      type="text" 
                      placeholder="Search by customer name, comment, or company..."
                      value={adminSearch}
                      onChange={e => setAdminSearch(e.target.value)}
                    />
                  </div>
                  <div className="filters-row">
                    <div className="filter-select-wrapper">
                      <Filter size={12} className="filter-icon" />
                      <select 
                        value={adminRatingFilter} 
                        onChange={e => setAdminRatingFilter(e.target.value)}
                      >
                        <option value="">All Star Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                      </select>
                    </div>
                    <div className="filter-select-wrapper">
                      <Filter size={12} className="filter-icon" />
                      <select 
                        value={adminStatusFilter} 
                        onChange={e => setAdminStatusFilter(e.target.value)}
                      >
                        <option value="">All Statuses</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <button onClick={loadAdminReviews} className="refresh-btn" title="Refresh Feed">
                      <RefreshCw size={14} className={adminLoading ? 'spin-anim' : ''} />
                    </button>
                  </div>
                </div>

                {/* Moderation Reviews Feed Grid */}
                <div className="admin-reviews-table-wrapper">
                  {adminLoading ? (
                    <div className="admin-skeleton-loading">
                      <RefreshCw size={24} className="spin-anim loading-icon" />
                      <p>Querying reviews database...</p>
                    </div>
                  ) : safeAdminReviews.length === 0 ? (
                    <div className="admin-empty-state">
                      <MessageSquare size={32} />
                      <p>No reviews match your filter parameters.</p>
                    </div>
                  ) : (
                    <div className="admin-reviews-grid">
                      {safeAdminReviews.map(review => (
                        <div key={review.id} className={`admin-review-card-item status-${review.status.toLowerCase()}`}>
                          <div className="card-top-row">
                            <div className="user-profile-meta">
                              {review.profileImage ? (
                                <img src={review.profileImage} alt={review.name} className="review-avatar-img" />
                              ) : (
                                <span className="review-avatar-initials">{review.name.charAt(0).toUpperCase()}</span>
                              )}
                              <div className="user-text-info">
                                <strong className="user-name">{review.name}</strong>
                                <span className="user-email-tag">{review.email || 'No email provided'}</span>
                                {review.company && <span className="user-company-tag">{review.company}</span>}
                              </div>
                            </div>
                            <span className={`status-badge status-${review.status.toLowerCase()}`}>
                              {review.status}
                            </span>
                          </div>

                          <div className="card-stars-row">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                fill={i < review.star ? '#f59e0b' : 'none'} 
                                color={i < review.star ? '#f59e0b' : '#cbd5e1'}
                              />
                            ))}
                            <span className="card-date-badge">{review.date}</span>
                          </div>

                          <p className="card-comment-text">"{review.comment}"</p>

                          <div className="card-actions-row">
                            <div className="edit-delete-btns">
                              <button onClick={() => openEditModal(review)} className="action-btn edit-btn" title="Edit Review">
                                <Edit size={14} /> Edit
                              </button>
                              <button onClick={() => handleDelete(review.id)} className="action-btn delete-btn" title="Delete Review">
                                <Trash size={14} /> Delete
                              </button>
                            </div>
                            <div className="status-toggle-btns">
                              {review.status !== 'Approved' && (
                                <button onClick={() => handleApprove(review.id)} className="action-btn approve-btn">
                                  Approve
                                </button>
                              )}
                              {review.status !== 'Rejected' && (
                                <button onClick={() => handleReject(review.id)} className="action-btn reject-btn">
                                  Reject
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          // ── PUBLIC VIEW RATING SYSTEM ──
          <>
            {/* Live Stats Summary Row */}
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
                  <span className="counter-label">Approved Ratings</span>
                </div>
              </div>
              <div className="live-counter-pill">
                <MessageSquare size={16} className="counter-icon reviews-icon" />
                <div className="counter-data">
                  <span className="counter-number">{reviewsList.length}</span>
                  <span className="counter-label">Live Reviews</span>
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
              
              {/* Star statistics summary grid */}
              <div className="rating-stats-grid">
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
                  <span className="overall-count">Based on {totalCount} approved ratings</span>
                  <span className="overall-satisfaction">{satisfactionRate}% Customer Satisfaction</span>
                </div>

                <div className="rating-breakdown-box">
                  {[5, 4, 3, 2, 1].map((starLevel) => {
                    const pct = distribution[starLevel] || 0
                    const starCount = counts[starLevel] || 0
                    return (
                      <div key={starLevel} className="breakdown-row">
                        <span className="star-level-label">{starLevel} ★</span>
                        <div className="breakdown-bar-bg">
                          <div
                            className={`breakdown-bar-fill star-bar-${starLevel}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="breakdown-percent">
                          {pct}% <span className="star-count-tag">({starCount})</span>
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="rating-divider" />

              {/* Submit Form */}
              <div className="rating-form-container">
                {userHasRated ? (
                  <div className="user-submitted-box animate-pop">
                    <CheckCircle2 size={44} className="submitted-check-icon" />
                    <h3>Review Submitted Successfully!</h3>
                    <p className="submitted-info">{submitSuccessMsg}</p>
                    <button
                      className="btn-secondary-light change-rating-btn"
                      onClick={() => setUserHasRated(false)}
                    >
                      Submit Another Rating / Review
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="interactive-rating-form">
                    <h3 className="form-heading">Leave a Customer Rating & Review</h3>
                    <p className="form-sub-heading">Share your experience! Ratings are saved and show live to all visitors in real-time.</p>

                    <div className="star-selector-wrapper">
                      <label className="picker-label">Click to Select Your Rating *</label>
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

                    <div className="form-inputs-grid-review">
                      <div className="form-field">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          placeholder="Enter your full name"
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="rating-field-input"
                          required
                        />
                      </div>
                      <div className="form-field">
                        <label>Email Address (optional)</label>
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={userEmail}
                          onChange={(e) => setUserEmail(e.target.value)}
                          className="rating-field-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>Company Name (optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Acme Corp"
                          value={userCompany}
                          onChange={(e) => setUserCompany(e.target.value)}
                          className="rating-field-input"
                        />
                      </div>
                    </div>

                    {/* Profile Photo Upload */}
                    <div className="form-field file-upload-field">
                      <label>Profile Image (optional)</label>
                      <div className="profile-upload-row">
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()} 
                          className="btn-secondary-light file-select-trigger"
                        >
                          <Upload size={14} /> Select Photo
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          accept="image/*" 
                          className="hidden-file-input"
                          style={{ display: 'none' }}
                        />
                        {profileImagePreview ? (
                          <div className="profile-photo-preview-box">
                            <img src={profileImagePreview} alt="Preview" className="preview-round-avatar" />
                            <button type="button" onClick={() => {setProfileImageFile(null); setProfileImagePreview('')}} className="remove-preview-btn">
                              <X size={10} />
                            </button>
                          </div>
                        ) : (
                          <span className="upload-file-status-label">No image selected (Max 2MB)</span>
                        )}
                      </div>
                    </div>

                    <div className="form-field text-area-field">
                      <label>Review Message *</label>
                      <textarea
                        placeholder="Share details of your experience working with SriVoraTech..."
                        value={userComment}
                        onChange={(e) => setUserComment(e.target.value)}
                        rows={3}
                        className="rating-field-textarea"
                        required
                      />
                    </div>

                    {submitErrorMsg && <div className="form-error-banner"><ShieldAlert size={14} /> {submitErrorMsg}</div>}

                    <button 
                      type="submit" 
                      className="btn-accent submit-review-btn"
                      disabled={submittingReview}
                    >
                      <Send size={16} />
                      {submittingReview ? 'Submitting Review...' : `Submit Client Rating`}
                    </button>
                  </form>
                )}
              </div>

              {/* Public Reviews Stream */}
              <div className="recent-reviews-stream">
                <div className="stream-header">
                  <h4 className="stream-title">
                    <MessageSquare size={16} /> Client Feedback & Sprints Reviews ({totalCount})
                  </h4>
                  {reviewsList.length > 0 && (
                    <div className="stream-nav-controls">
                      <button 
                        type="button" 
                        onClick={() => scrollStream('left')} 
                        className="carousel-nav-btn" 
                        title="Scroll Left"
                        aria-label="Scroll reviews left"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => scrollStream('right')} 
                        className="carousel-nav-btn" 
                        title="Scroll Right"
                        aria-label="Scroll reviews right"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}
                </div>

                {loading ? (
                  // Skeletons
                  <div className="reviews-loading-skeletons">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="review-skeleton-card">
                        <div className="skeleton-avatar" />
                        <div className="skeleton-lines">
                          <div className="skeleton-line" />
                          <div className="skeleton-line short" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : reviewsList.length === 0 ? (
                  <div className="admin-empty-state">
                    <MessageSquare size={32} />
                    <p>No approved customer reviews found. Be the first to leave one!</p>
                  </div>
                ) : (
                  <div className="reviews-carousel-wrapper" ref={scrollStreamRef}>
                    <div className="reviews-carousel-track">
                      {reviewsList.map((review) => (
                        <div key={review.id} className="review-card-item">
                          <div className="review-card-top">
                            <div className="review-name-group">
                              {review.profileImage ? (
                                <img src={review.profileImage} alt={review.name} className="customer-avatar-img" />
                              ) : (
                                <span className="review-avatar">
                                  {review.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                              <div className="customer-info-meta">
                                <strong className="r-name">{review.name}</strong>
                                {review.company && <span className="r-company">{review.company}</span>}
                              </div>
                            </div>
                            <div className="r-stars">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={13} 
                                  fill={i < review.star ? '#f59e0b' : 'none'} 
                                  color={i < review.star ? '#f59e0b' : '#cbd5e1'} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="r-comment">"{review.comment}"</p>
                          <span className="r-date">{review.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

      </div>

      {/* Editing modal for admin */}
      {editingReview && (
        <div className="edit-modal-overlay">
          <div className="edit-modal-content glass-card animate-pop">
            <div className="modal-header">
              <h4>Edit Customer Review</h4>
              <button onClick={() => setEditingReview(null)} className="close-btn">
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="edit-modal-form">
              <div className="form-group">
                <label>Customer Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Company (optional)</label>
                <input 
                  type="text" 
                  value={editCompany}
                  onChange={e => setEditCompany(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Star Rating (1-5)</label>
                <select 
                  value={editStar}
                  onChange={e => setEditStar(parseInt(e.target.value, 10))}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div className="form-group">
                <label>Review Comment</label>
                <textarea 
                  value={editComment}
                  onChange={e => setEditComment(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setEditingReview(null)} className="btn-secondary-light">
                  Cancel
                </button>
                <button type="submit" className="btn-accent">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  )
}
