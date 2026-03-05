/**
 * @description
 * Aptify DB API client for member authentication.
 * Direct API calls to Aptify database — NOT OAuth/SAML.
 * Simple member True/False check.
 *
 * Key features:
 * - authenticateMember: Validates username + password against Aptify
 * - verifyMember: Checks if a user is a valid member (True/False)
 * - createAccount: Registers a new Aptify account
 * - recoverUsername: Sends username recovery email
 * - resetPassword: Initiates password reset flow
 *
 * @dependencies
 * - APTIFY_API_URL and APTIFY_API_KEY env vars
 *
 * @notes
 * - All functions are server-side only
 * - Aptify API returns simple True/False for membership
 * - If Aptify is unavailable, functions return failure gracefully
 * - In dev mode without API URL, returns mock responses for testing
 */

type AptifyAuthResult = {
  success: boolean
  isMember: boolean
  message?: string
  userId?: string
  email?: string
}

type AptifyAccountResult = {
  success: boolean
  message: string
}

const APTIFY_API_URL = process.env.APTIFY_API_URL
const APTIFY_API_KEY = process.env.APTIFY_API_KEY

/**
 * Authenticate a member against the Aptify DB API.
 * Returns success/failure with membership status.
 */
export async function authenticateMember(
  username: string,
  password: string,
): Promise<AptifyAuthResult> {
  // Dev mode without Aptify configured
  if (!APTIFY_API_URL || !APTIFY_API_KEY) {
    console.warn('[Aptify] API not configured — using dev mode authentication')
    // In dev, accept test@test.com / password
    if (username === 'test@test.com' && password === 'password') {
      return { success: true, isMember: true, userId: 'dev-user-1', email: username }
    }
    return { success: false, isMember: false, message: 'Invalid user name or password. Please try again.' }
  }

  try {
    const response = await fetch(`${APTIFY_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': APTIFY_API_KEY,
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      return { success: false, isMember: false, message: 'Invalid user name or password. Please try again.' }
    }

    const data = await response.json()
    return {
      success: true,
      isMember: Boolean(data.isMember),
      userId: data.userId,
      email: data.email,
    }
  } catch (error) {
    console.error('[Aptify] Authentication error:', error)
    return { success: false, isMember: false, message: 'Authentication service unavailable. Please try again later.' }
  }
}

/**
 * Verify if a user session represents a valid member.
 */
export async function verifyMember(userId: string): Promise<boolean> {
  if (!APTIFY_API_URL || !APTIFY_API_KEY) {
    return userId === 'dev-user-1'
  }

  try {
    const response = await fetch(`${APTIFY_API_URL}/members/${userId}/verify`, {
      headers: { 'X-API-Key': APTIFY_API_KEY },
    })
    if (!response.ok) return false
    const data = await response.json()
    return Boolean(data.isMember)
  } catch {
    return false
  }
}

/**
 * Create a new Aptify account.
 */
export async function createAccount(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
): Promise<AptifyAccountResult> {
  if (!APTIFY_API_URL || !APTIFY_API_KEY) {
    console.warn('[Aptify] API not configured — account creation simulated')
    return { success: true, message: 'Account created successfully. Please log in.' }
  }

  try {
    const response = await fetch(`${APTIFY_API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': APTIFY_API_KEY,
      },
      body: JSON.stringify({ email, password, firstName, lastName }),
    })

    if (!response.ok) {
      const data = await response.json().catch(() => null)
      return { success: false, message: data?.message || 'Registration failed. Please try again.' }
    }

    return { success: true, message: 'Account created successfully. Please log in.' }
  } catch (error) {
    console.error('[Aptify] Account creation error:', error)
    return { success: false, message: 'Registration service unavailable. Please try again later.' }
  }
}

/**
 * Request username recovery via email.
 */
export async function recoverUsername(email: string): Promise<AptifyAccountResult> {
  if (!APTIFY_API_URL || !APTIFY_API_KEY) {
    return { success: true, message: 'If an account exists with this email, you will receive your username shortly.' }
  }

  try {
    const response = await fetch(`${APTIFY_API_URL}/auth/recover-username`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': APTIFY_API_KEY,
      },
      body: JSON.stringify({ email }),
    })

    // Always return success message to prevent email enumeration
    if (response.ok || response.status === 404) {
      return { success: true, message: 'If an account exists with this email, you will receive your username shortly.' }
    }

    return { success: false, message: 'Something went wrong. Please try again later.' }
  } catch {
    return { success: false, message: 'Recovery service unavailable. Please try again later.' }
  }
}

/**
 * Request password reset via email.
 */
export async function resetPassword(username: string): Promise<AptifyAccountResult> {
  if (!APTIFY_API_URL || !APTIFY_API_KEY) {
    return { success: true, message: 'If an account exists with this username, a password reset link has been sent to your email.' }
  }

  try {
    const response = await fetch(`${APTIFY_API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': APTIFY_API_KEY,
      },
      body: JSON.stringify({ username }),
    })

    // Always return success message to prevent username enumeration
    if (response.ok || response.status === 404) {
      return { success: true, message: 'If an account exists with this username, a password reset link has been sent to your email.' }
    }

    return { success: false, message: 'Something went wrong. Please try again later.' }
  } catch {
    return { success: false, message: 'Password reset service unavailable. Please try again later.' }
  }
}
