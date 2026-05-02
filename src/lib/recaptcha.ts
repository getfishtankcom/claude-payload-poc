/**
 * @description
 * Server-side reCAPTCHA v3 token verification.
 * Posts token to Google's siteverify endpoint and checks score.
 *
 * Key features:
 * - Verifies reCAPTCHA token against Google API
 * - Returns pass/fail with score
 * - Configurable score threshold (default 0.5)
 *
 * @dependencies
 * - Google reCAPTCHA siteverify API
 *
 * @notes
 * - RECAPTCHA_SECRET_KEY must be set in .env
 * - Score ranges from 0.0 (bot) to 1.0 (human)
 * - If secret key is missing, returns true (allows forms in dev)
 */

type VerifyResult = {
  success: boolean
  score?: number
  action?: string
  errorCodes?: string[]
}

/**
 * Verify a reCAPTCHA v3 token server-side.
 * @param token - The token from the client-side reCAPTCHA execution
 * @param expectedAction - The expected action name (optional validation)
 * @param threshold - Minimum score to consider human (default 0.5)
 */
export async function verifyRecaptcha(
  token: string,
  expectedAction?: string,
  threshold = 0.5,
): Promise<VerifyResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY

  // In development without secret key, allow all submissions
  if (!secretKey) {
    console.warn('[ReCaptcha] RECAPTCHA_SECRET_KEY not set — skipping verification')
    return { success: true, score: 1.0 }
  }

  if (!token) {
    return { success: false, errorCodes: ['missing-input-response'] }
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: secretKey,
        response: token,
      }),
    })

    const data = await response.json()

    if (!data.success) {
      return { success: false, errorCodes: data['error-codes'] }
    }

    // Check score threshold
    if (data.score < threshold) {
      return { success: false, score: data.score, action: data.action }
    }

    // Verify action matches if provided
    if (expectedAction && data.action !== expectedAction) {
      return { success: false, score: data.score, action: data.action }
    }

    return { success: true, score: data.score, action: data.action }
  } catch (error) {
    console.error('[ReCaptcha] Verification error:', error)
    return { success: false, errorCodes: ['network-error'] }
  }
}
