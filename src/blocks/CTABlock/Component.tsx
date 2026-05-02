/**
 * @description
 * Renders the CTA block with rich text, links, and variant-driven styling.
 *
 * Key features:
 * - Three visual variants: light (default), dark, purple
 * - Rich text content rendered server-side
 * - CTA link buttons with appearance mapping
 *
 * @dependencies
 * - Container from ui components
 * - CMSLink for rendering link fields
 *
 * @notes
 * - Light variant: white bg, dark text
 * - Dark variant: dark bg, white text
 * - Purple variant: primary purple bg, white text
 */
import React from 'react'

import { Container } from '@/components/ui'
import { CMSLink } from '@/components/CMSLink'
import { RichText } from '@/components/RichText'

type CTABlockProps = {
  richText?: Record<string, unknown> | null
  links?: Array<{ link: Record<string, unknown> }>
  variant?: 'light' | 'dark' | 'purple' | null
  blockType: 'cta'
}

const variantStyles: Record<string, string> = {
  light: 'bg-white border-y border-gray-200 text-text-primary',
  dark: 'bg-gray-900 text-white',
  purple: 'bg-primary text-white',
}

export const CTABlockComponent: React.FC<CTABlockProps> = ({
  richText,
  links,
  variant = 'light',
}) => {
  const styles = variantStyles[variant || 'light'] || variantStyles.light

  return (
    <section className={`py-10 md:py-14 ${styles}`} data-testid="block-cta">
      <Container>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          {richText && (
            <div className="flex-1 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_p]:mt-2 [&_p]:opacity-80">
              <RichText content={richText} />
            </div>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="flex flex-wrap gap-3 shrink-0">
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

