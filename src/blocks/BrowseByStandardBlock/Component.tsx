/**
 * @description
 * Renders the Browse by Standard block as a 4-column card grid.
 * Each card shows a standard category with nested links.
 *
 * Key features:
 * - 4-column grid on desktop, 2-column on tablet, stacked on mobile
 * - Mobile: expandable accordion cards
 * - Category heading in primary color
 * - Links styled as text links
 *
 * @dependencies
 * - Container from ui components
 *
 * @notes
 * - Client component due to mobile accordion state
 * - Replaces hardcoded BrowseByStandard from Epic 4
 * - Empty state shows message when no categories configured
 */
'use client'

import React, { useState } from 'react'

import { Container } from '@/components/ui'

type CategoryLink = {
  label: string
  url: string
  id?: string
}

type Category = {
  name: string
  links?: CategoryLink[] | null
  id?: string
}

type BrowseByStandardBlockProps = {
  heading?: string | null
  categories?: Category[] | null
  blockType: 'browseByStandard'
}

function CategoryCard({ category }: { category: Category }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const populatedLinks = (category.links || []).filter((l) => l.label && l.url)

  // Don't render an empty card — the surrounding component already filters
  // these out, but guard anyway so a partially-populated CMS row can't emit
  // empty <h3> / <a> nodes that fail axe-core's empty-heading rule.
  if (!category.name && populatedLinks.length === 0) return null

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      {/* Desktop: always visible */}
      <div className="hidden md:block p-6">
        {category.name && (
          <h3 className="mb-4 text-lg font-bold text-primary">{category.name}</h3>
        )}
        {populatedLinks.length > 0 && (
          <ul className="space-y-2">
            {populatedLinks.map((link, i) => (
              <li key={link.id || i}>
                <a
                  href={link.url}
                  className="text-sm text-link hover:text-link-hover hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile: expandable accordion */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 text-left"
          aria-expanded={isExpanded}
        >
          {category.name ? (
            <h3 className="text-lg font-bold text-primary">{category.name}</h3>
          ) : (
            <span className="text-lg font-bold text-primary">Standards</span>
          )}
          <span
            className={`text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            &#9660;
          </span>
        </button>
        {isExpanded && populatedLinks.length > 0 && (
          <ul className="space-y-2 px-4 pb-4">
            {populatedLinks.map((link, i) => (
              <li key={link.id || i}>
                <a
                  href={link.url}
                  className="text-sm text-link hover:text-link-hover hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export const BrowseByStandardBlockComponent: React.FC<BrowseByStandardBlockProps> = ({
  heading,
  categories,
}) => {
  if (!categories?.length) {
    return (
      <div data-testid="block-browse-by-standard">
        <Container>
          <p className="text-sm text-text-muted">No standard categories configured.</p>
        </Container>
      </div>
    )
  }

  return (
    <section data-testid="block-browse-by-standard" className="py-12 md:py-16">
      <Container>
        {heading && (
          <h2 className="mb-8 text-3xl font-black text-text-primary">{heading}</h2>
        )}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, i) => (
            <CategoryCard key={category.id || i} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}
