/**
 * Google Apps Script Web App URL
 * 
 * HOW TO SET UP:
 * 1. Open Google Sheets → Extensions → Apps Script
 * 2. Paste contents of google-apps-script.js
 * 3. Deploy → New Deployment → Web App
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 4. Copy the Web App URL and paste below
 * 
 * URL looks like: https://script.google.com/macros/s/AKfycb.../exec
 */
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzzB8S5E3JqKFYuj-2RX7oHWXkv0taRPv0aQBAjIr2TQkVp0K0grPCIcZWVrbbXQlSo/exec'

// Local backend endpoints (fallback when Apps Script URL is not set)
const backendEndpoints = {
  fresher: '/api/apply/fresher',
  experience: '/api/apply/experienced',
  experienced: '/api/apply/experienced',
  contact: '/api/contact',
}

/**
 * Submit form data to Google Sheets via Apps Script Web App,
 * with fallback to local backend server.
 * @param {'fresher' | 'experience' | 'experienced'} formType
 * @param {Object} data - The form data to submit
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
export async function submitToSheet(formType, data) {
  // Build the payload (strip File objects for JSON — can't send files via JSON)
  const jsonPayload = {}
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return
    if (value instanceof File) {
      jsonPayload[key + '_filename'] = value.name
    } else {
      jsonPayload[key] = value
    }
  })
  jsonPayload.type = formType === 'fresher' ? 'Fresher' : formType === 'contact' ? 'Contact' : 'Experienced'

  // --- Strategy 1: Google Apps Script Web App (direct, no backend server needed) ---
  if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.includes('script.google.com')) {
    try {
      console.log('Submitting form data to Google Sheets via Apps Script...')
      console.log('Payload:', JSON.stringify(jsonPayload, null, 2))

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Required for Google Apps Script from browsers
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(jsonPayload),
      })

      // no-cors responses are opaque (status=0, body unreadable),
      // but if fetch() resolved without throwing, the request was sent.
      console.log('✅ Form submitted to Google Sheets successfully via Apps Script')
      return { success: true }
    } catch (err) {
      console.warn('❌ Google Apps Script submission failed:', err.message)
      console.warn('Falling back to local backend server...')
    }
  } else {
    console.warn('⚠️ GOOGLE_SCRIPT_URL is not configured. Trying local backend...')
  }

  // --- Strategy 2: Local backend server (fallback) ---
  const endpoint = backendEndpoints[formType]
  if (!endpoint) {
    return { success: false, error: `Unsupported form type: ${formType}` }
  }

  try {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return
      formData.append(key, value)
    })

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const body = await response.json().catch(() => null)
      return {
        success: false,
        error: body?.message || `Server error: ${response.status}`,
      }
    }

    console.log('✅ Form submitted via local backend server')
    return { success: true }
  } catch (error) {
    console.error('❌ Form submission error (both strategies failed):', error)
    return {
      success: false,
      error: 'Unable to submit application. Please check your connection and try again.',
    }
  }
}
