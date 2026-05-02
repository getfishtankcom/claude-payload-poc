/**
 * @description
 * ReCaptcha v3 (invisible) integration for form bot prevention.
 * Wraps react-google-recaptcha-v3 with a provider and hook.
 *
 * Key features:
 * - ReCaptchaProvider wraps the app with Google ReCaptcha v3 context
 * - useReCaptcha hook returns a getToken function for form submission
 * - Invisible — no user interaction required
 *
 * @dependencies
 * - react-google-recaptcha-v3: Google ReCaptcha v3 React bindings
 *
 * @notes
 * - Site key comes from NEXT_PUBLIC_RECAPTCHA_SITE_KEY env var
 * - If site key is missing, provider renders children without ReCaptcha
 * - Server-side verification lives in src/lib/recaptcha.ts
 */
'use client'

import React from 'react'
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from 'react-google-recaptcha-v3'

type ReCaptchaProviderProps = {
  children: React.ReactNode
}

/**
 * Wraps the application with Google ReCaptcha v3 context.
 * Reads site key from NEXT_PUBLIC_RECAPTCHA_SITE_KEY env var.
 * If site key is missing, renders children without ReCaptcha (dev/test mode).
 */
export function ReCaptchaProvider({ children }: ReCaptchaProviderProps) {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

  if (!siteKey) {
    return <>{children}</>
  }

  return (
    <GoogleReCaptchaProvider reCaptchaKey={siteKey}>
      {children}
    </GoogleReCaptchaProvider>
  )
}

/**
 * Hook that returns a function to get a reCAPTCHA token for form submission.
 * Call getToken('action_name') before submitting a form.
 * Returns empty string if ReCaptcha is not available (graceful degradation).
 */
export function useReCaptcha() {
  const { executeRecaptcha } = useGoogleReCaptcha()

  const getToken = React.useCallback(
    async (action = 'submit'): Promise<string> => {
      if (!executeRecaptcha) {
        return ''
      }
      return executeRecaptcha(action)
    },
    [executeRecaptcha],
  )

  return { getToken, isReady: !!executeRecaptcha }
}
