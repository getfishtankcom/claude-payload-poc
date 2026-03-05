/**
 * @description
 * Low-impact hero variant with simple text content and optional links.
 * Used on interior pages (board detail, project detail, etc.).
 *
 * Key features:
 * - Light background with heading text
 * - Rich text content area
 * - Optional CTA links
 * - Clean, minimal layout
 *
 * @dependencies
 * - Container from ui components
 * - CMSLink for rendering CMS-configured links
 *
 * @notes
 * - Much simpler than HighImpact — no gradient, no search bar, no media
 * - Used as default hero type for interior content pages
 */
import React from 'react'

import type { Page } from '@/payload-types'

import { Container } from '@/components/ui'
import { CMSLink } from '@/components/CMSLink'

type LowImpactHeroProps = Page['hero']

export const LowImpactHero: React.FC<LowImpactHeroProps> = ({ links, richText }) => {
  return (
    <section data-testid="hero-section" className="border-b border-gray-200 bg-white py-10 md:py-14">
      <Container>
        <div className="max-w-3xl">
          {richText && (
            <div className="[&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-text-heading [&_h1]:leading-tight [&_p]:mt-3 [&_p]:text-base [&_p]:text-text-muted [&_p]:leading-relaxed">
              <RichTextRenderer content={richText} />
            </div>
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
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

/**
 * Simple rich text renderer — same as HighImpact version.
 * Will be replaced by shared Payload RichText component.
 */
function RichTextRenderer({ content }: { content: Record<string, unknown> | null | undefined }) {
  if (!content) return null
  if (typeof content === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: content as string }} />
  }
  return null
}
