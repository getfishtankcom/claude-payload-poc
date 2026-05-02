/**
 * @description
 * Server action for HubSpot newsletter form submission.
 * Posts email to HubSpot Forms API v3 endpoint.
 *
 * @dependencies
 * - HubSpot Forms API: https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}
 *
 * @notes
 * - HUBSPOT_PORTAL_ID and HUBSPOT_FORM_ID must be set in .env
 * - Server action keeps HubSpot credentials server-side (not exposed to client)
 * - Returns typed result for UI state management
 */
'use server'

type NewsletterResult = {
  success: boolean
  message: string
}

export async function subscribeToNewsletter(email: string): Promise<NewsletterResult> {
  // Validate email server-side
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { success: false, message: 'Please enter a valid email address.' }
  }

  const portalId = process.env.HUBSPOT_PORTAL_ID
  const formId = process.env.HUBSPOT_FORM_ID

  if (!portalId || !formId) {
    console.error('[Newsletter] Missing HUBSPOT_PORTAL_ID or HUBSPOT_FORM_ID env vars')
    return { success: false, message: 'Newsletter service is not configured. Please try again later.' }
  }

  try {
    const response = await fetch(
      `https://api.hsforms.com/submissions/v3/integration/submit/${portalId}/${formId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: [
            { name: 'email', value: email },
          ],
          context: {
            pageUri: process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca',
            pageName: 'RAS Canada Newsletter Signup',
          },
        }),
      },
    )

    if (response.ok) {
      return { success: true, message: 'Thank you for subscribing!' }
    }

    // HubSpot returns error details in the response body
    const errorData = await response.json().catch(() => null)
    const errorMessage = errorData?.message || 'Subscription failed. Please try again.'
    console.error('[Newsletter] HubSpot API error:', response.status, errorMessage)
    return { success: false, message: errorMessage }
  } catch (error) {
    console.error('[Newsletter] Network error:', error)
    return { success: false, message: 'Something went wrong. Please try again.' }
  }
}
