/**
 * @description
 * High-impact hero variant with gradient background, rich text content,
 * CTA links, and optional project search bar. Used on the homepage.
 *
 * Key features:
 * - Full-width gradient background (hero-gradient utility class)
 * - Rich text rendered via Lexical serializer
 * - Link group rendered as CTA buttons
 * - Optional search bar (controlled by search_enabled field)
 * - Responsive layout — stacks vertically on mobile
 *
 * @dependencies
 * - Container from ui components
 * - RichText from @payloadcms/richtext-lexical/react (for serializing Lexical content)
 *
 * @notes
 * - Search bar is project-scoped (not sitewide) per component architecture rules
 * - When search_enabled is false, no search bar renders
 * - Links render as Button components with appearance-driven variants
 * - data-testid attributes for self-test compatibility
 */
import React from 'react'

import type { Page } from '@/payload-types'

import { Container } from '@/components/ui'
import { CMSLink } from '@/components/CMSLink'
import { RichText } from '@/components/RichText'

type HighImpactHeroProps = Page['hero']

export const HighImpactHero: React.FC<HighImpactHeroProps> = ({
  links,
  richText,
  search_enabled,
}) => {
  return (
    <section
      data-testid="hero-section"
      className="hero-gradient py-16 md:py-20 lg:py-24"
    >
      <Container>
        <div className="max-w-3xl">
          {/* Rich text content — heading + subtitle */}
          {richText && (
            <div className="text-white [&_h1]:text-3xl [&_h1]:md:text-4xl [&_h1]:font-black [&_h1]:leading-tight [&_p]:mt-4 [&_p]:text-base [&_p]:md:text-lg [&_p]:text-white/80 [&_p]:leading-relaxed [&_p]:max-w-2xl">
              <RichText content={richText} />
            </div>
          )}

          {/* CTA links */}
          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-4">
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} className="text-white" />
              ))}
            </div>
          )}

          {/* Project search bar — only when search_enabled is true */}
          {search_enabled && (
            <div className="mt-8 flex max-w-xl" data-testid="hero-search-bar">
              <div
                className="flex-1 rounded-l-sm border border-white/30 bg-white/10 px-4 py-3 text-left text-white/60 backdrop-blur-sm"
              >
                Find an active project
              </div>
              <button
                type="button"
                className="rounded-r-sm bg-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Search
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}

