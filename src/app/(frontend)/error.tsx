/**
 * @description
 * Custom 500 error page with brand styling and home CTA.
 * Renders when an unhandled error occurs during rendering.
 *
 * Key features:
 * - Brand colors and typography
 * - "Back to Home" CTA button
 * - Error reset functionality
 * - Minimal layout, no sidebar
 *
 * @dependencies
 * - Button: CTA component
 * - Container: Max-width wrapper
 *
 * @notes
 * - Must be a client component (Next.js requirement for error boundaries)
 * - Header/footer come from the parent layout
 * - reset() allows users to try re-rendering the page
 */
'use client'

import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

type ErrorPageProps = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <Container as="main" variant="narrow" className="py-20 md:py-32">
      <div
        data-testid="page-500"
        className="flex flex-col items-center gap-6 text-center"
      >
        <p className="text-6xl font-black text-primary md:text-8xl">500</p>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Something Went Wrong
        </h1>
        <p className="max-w-md text-base text-text-secondary">
          We encountered an unexpected error. Please try again or return
          to our homepage.
        </p>
        <div className="flex gap-4">
          <Button onClick={reset} variant="secondary" size="lg">
            Try Again
          </Button>
          <Button href="/" variant="primary" size="lg">
            Back to Home
          </Button>
        </div>
      </div>
    </Container>
  )
}
