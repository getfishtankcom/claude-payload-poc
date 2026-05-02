/**
 * @description
 * Custom 404 page with brand styling, header/footer, and home CTA.
 * Renders when Next.js can't find a matching route.
 *
 * Key features:
 * - Brand colors and typography
 * - "Back to Home" CTA button
 * - Minimal layout, no sidebar
 * - Includes SiteHeader and SiteFooter (via root layout)
 *
 * @dependencies
 * - Button: CTA component
 * - Container: Max-width wrapper
 *
 * @notes
 * - This file lives at app/not-found.tsx (root level for all routes)
 * - Header/footer come from the parent layout
 */
import { Container } from '@/components/ui/Container'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <Container as="main" variant="narrow" className="py-20 md:py-32">
      <div
        data-testid="page-404"
        className="flex flex-col items-center gap-6 text-center"
      >
        <p className="text-6xl font-black text-primary md:text-8xl">404</p>
        <h1 className="text-2xl font-bold text-text-primary md:text-3xl">
          Page Not Found
        </h1>
        <p className="max-w-md text-base text-text-secondary">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Please check the URL or return to our homepage.
        </p>
        <Button href="/" variant="primary" size="lg">
          Back to Home
        </Button>
      </div>
    </Container>
  )
}
