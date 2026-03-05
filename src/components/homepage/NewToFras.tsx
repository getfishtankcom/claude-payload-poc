/**
 * @description
 * "New to FRAS?" CTA section for the homepage.
 * Compact horizontal banner with intro text and a "Get Started" action button.
 * Content is designed to be editable via the `homepage` Payload global (Epic 9).
 *
 * Key features:
 * - Heading + description text on the left
 * - "Get Started" ghost/outline button on the right
 * - Horizontal layout on desktop, stacked on mobile
 * - Compact section with top/bottom border styling
 *
 * @dependencies
 * - Button: Ghost variant from design primitives
 * - Container: Max-width wrapper
 *
 * @notes
 * - Content is hardcoded until the `homepage` global is created in Epic 9
 * - Button links to a configurable URL (defaults to /about)
 * - Section uses subtle border styling per wireframe (divider pattern)
 */
import { Button, Container } from '@/components/ui'

type NewToFrasProps = {
  heading?: string
  description?: string
  buttonText?: string
  buttonUrl?: string
}

export function NewToFras({
  heading = 'New to FRAS?',
  description = 'Let us guide you through the essentials.',
  buttonText = 'Get Started',
  buttonUrl = '/about',
}: NewToFrasProps) {
  return (
    <section
      data-testid="section-new-to-fras"
      className="border-y border-gray-200 bg-white py-6"
    >
      <Container>
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-text-primary">{heading}</h2>
            <p className="mt-1 text-text-muted">{description}</p>
          </div>
          <Button variant="secondary" href={buttonUrl} className="shrink-0">
            {buttonText}
          </Button>
        </div>
      </Container>
    </section>
  )
}
