/**
 * API client for Meeting Minutes Generator
 * Handles communication with the FastAPI backend, timeouts, retries, and errors.
 */

const API_BASE_URL = '/api'
const DEFAULT_TIMEOUT_MS = 30000 // 30 seconds

/**
 * Custom error class for API errors with status code and details.
 */
export class ApiError extends Error {
  constructor(message, status = null, detail = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

/**
 * Fetch wrapper with timeout and abort support.
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    return response
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new ApiError(
        'Request timed out. The server took too long to respond.',
        408
      )
    }
    throw new ApiError(
      'Unable to connect to the server. Please check your network or verify the backend is running.',
      0
    )
  } finally {
    clearTimeout(timeoutId)
  }
}

/**
 * Generates meeting minutes from a transcript.
 *
 * @param {string} transcript - The raw meeting notes/transcript
 * @param {object} [options]
 * @param {number} [options.timeout] - Timeout in milliseconds (default: 30000)
 * @param {number} [options.maxRetries] - Max retry attempts for transient errors (default: 1)
 * @returns {Promise<object>} MeetingMinutes data object
 */
export async function generateMinutes(transcript, { timeout = DEFAULT_TIMEOUT_MS, maxRetries = 1 } = {}) {
  let attempt = 0

  while (attempt <= maxRetries) {
    try {
      const response = await fetchWithTimeout(
        `${API_BASE_URL}/meetings/generate`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ transcript }),
        },
        timeout
      )

      let data
      try {
        data = await response.json()
      } catch {
        throw new ApiError(
          'Invalid response received from the server.',
          response.status
        )
      }

      if (!response.ok) {
        if (response.status === 422) {
          const detailMsg = Array.isArray(data?.detail)
            ? data.detail.map((d) => d.msg).join(', ')
            : data?.detail || 'The transcript does not meet validation requirements.'
          throw new ApiError(detailMsg, 422, data?.detail)
        }

        if (response.status === 429) {
          throw new ApiError('Rate limit exceeded. Please wait a moment before trying again.', 429)
        }

        if (response.status >= 500) {
          throw new ApiError(
            data?.detail || data?.error || 'Server error occurred while generating minutes. Please try again.',
            response.status
          )
        }

        throw new ApiError(
          data?.detail || data?.error || `Request failed with status ${response.status}`,
          response.status
        )
      }

      if (data && data.success && data.data) {
        return data.data
      }

      if (data && data.summary) {
        return data
      }

      throw new ApiError('Unexpected response format from server.', response.status)
    } catch (err) {
      attempt++
      const isTransient = err.status === 0 || err.status === 503 || err.status === 408
      if (isTransient && attempt <= maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
        continue
      }
      throw err
    }
  }
}

export const api = {
  generateMinutes,
}

export default api

