/**
 * @description
 * Newsletter call-to-action component with heading, description,
 * email input, subscribe button, and LinkedIn CTA link.
 *
 * Used in the footer and potentially on other pages to encourage
 * newsletter subscriptions. Submits to HubSpot Forms API (placeholder
 * action for now until HubSpot integration in later epics).
 *
 * @dependencies
 * - Button: Primary button from ui/
 * - Design tokens from globals.css: colors, typography
 *
 * @notes
 * - Client component due to form state management
 * - Email validation done client-side before submission
 * - Submits to HubSpot Forms API via server action (keeps credentials server-side)
 * - LinkedIn icon is an inline SVG
 */
'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui'
import { subscribeToNewsletter } from '@/actions/newsletter'

type NewsletterCTAProps = {
  /** Heading text */
  heading?: string
  /** Optional description paragraph */
  description?: string
  className?: string
}

export function NewsletterCTA({
  heading = 'Trusted by 3,000+ professionals across Canada',
  description,
  className = '',
}: NewsletterCTAProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setStatus('error')
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setStatus('submitting')

    try {
      const result = await subscribeToNewsletter(email)
      if (result.success) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
        setErrorMessage(result.message)
      }
    } catch {
      setStatus('error')
      setErrorMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className={`${className}`.trim()} data-testid="newsletter-cta">
      {heading && (
        <h2 className="text-2xl font-bold text-text-primary">{heading}</h2>
      )}

      {description && <p className="mt-2 text-base text-text-muted">{description}</p>}

      {status === 'success' ? (
        <p className="mt-4 text-sm font-medium text-green-700" role="status">
          Thank you for subscribing!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
          <div className="flex-1">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                if (status === 'error') setStatus('idle')
              }}
              placeholder="Enter your email"
              required
              className="w-full rounded-sm border border-gray-300 bg-white px-4 py-2.5 text-base text-text-primary placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
              aria-invalid={status === 'error'}
              aria-describedby={status === 'error' ? 'newsletter-error' : undefined}
              data-testid="newsletter-email"
            />
            {status === 'error' && (
              <p id="newsletter-error" className="mt-1 text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}
          </div>
          <Button
            type="submit"
            variant="primary"
            disabled={status === 'submitting'}
            data-testid="newsletter-submit"
          >
            {status === 'submitting' ? 'Subscribing...' : 'Subscribe'}
          </Button>
        </form>
      )}

      {/* LinkedIn CTA */}
      <a
        href="https://www.linkedin.com/company/fras-canada"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-vivid"
        data-testid="newsletter-linkedin"
      >
        {/* LinkedIn icon */}
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        Follow us on LinkedIn
      </a>
    </div>
  )
}
