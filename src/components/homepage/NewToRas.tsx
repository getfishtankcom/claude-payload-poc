/**
 * "New to RAS?" CTA section for the homepage. Compact horizontal banner
 * with intro text and a "Get Started" action button. Content is editable
 * via the `homepage` Payload global.
 */
import { Button, Container } from '@/components/ui'

type NewToRasProps = {
  heading?: string
  description?: string
  buttonText?: string
  buttonUrl?: string
}

export function NewToRas({
  heading = 'New to RAS?',
  description = 'Let us guide you through the essentials.',
  buttonText = 'Get Started',
  buttonUrl = '/about',
}: NewToRasProps) {
  return (
    <section
      data-testid="section-new-to-ras"
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
