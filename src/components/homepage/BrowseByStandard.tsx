/**
 * @description
 * "Browse by Standard" section for the homepage.
 * 4-column card grid showing standard categories: Sustainability, Accounting,
 * Public Sector, and Assurance. Each card contains a category heading and a
 * list of standard/board links.
 *
 * Key features:
 * - 4-column grid on desktop, stacks on mobile
 * - Mobile: expandable accordion cards (click to expand)
 * - Each card links to standards sections and board detail pages
 * - Homepage-only one-off component (per CLAUDE.md: PromoCardGrid is not reusable)
 *
 * @dependencies
 * - Container: Max-width wrapper
 *
 * @notes
 * - Data is hardcoded per wireframe until standards collection exists (Epic 1.2)
 * - Links route to /boards/[slug] for boards and /standards/[slug] for standards
 * - Mobile accordion uses client-side state for expand/collapse
 * - RASOC is NOT included (oversight council, no standards)
 */
'use client'

import React, { useState } from 'react'
import { Container } from '@/components/ui'

type StandardLink = {
  label: string
  href: string
}

type StandardCategory = {
  title: string
  links: StandardLink[]
}

/** Hardcoded standard categories from wireframe spec (Frame 3) */
const STANDARD_CATEGORIES: StandardCategory[] = [
  {
    title: 'Sustainability',
    links: [
      { label: 'CSDS', href: '/standards/csds' },
      { label: 'CSSB', href: '/boards/cssb' },
    ],
  },
  {
    title: 'Accounting',
    links: [
      { label: 'Part I: IFRS Accounting Standards', href: '/standards/ifrs' },
      { label: 'Part II: Private Enterprises', href: '/standards/aspe' },
      { label: 'Part III: NFP Organizations', href: '/standards/nfp' },
      { label: 'Part IV: Pension Plans', href: '/standards/pension' },
      { label: 'AcSB', href: '/boards/acsb' },
    ],
  },
  {
    title: 'Public Sector',
    links: [
      { label: 'PSAS', href: '/standards/psas' },
      { label: 'IPSAS Activities', href: '/standards/ipsas' },
      { label: 'PSAB', href: '/boards/psab' },
    ],
  },
  {
    title: 'Assurance',
    links: [
      { label: 'CSQM', href: '/standards/csqm' },
      { label: 'CAS', href: '/standards/cas' },
      { label: 'Other', href: '/standards/other-assurance' },
      { label: 'AASB', href: '/boards/aasb' },
    ],
  },
]

type CategoryCardProps = {
  category: StandardCategory
}

function CategoryCard({ category }: CategoryCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      {/* Desktop: always visible */}
      <div className="hidden md:block p-6">
        <h3 className="mb-4 text-lg font-bold text-primary">{category.title}</h3>
        <ul className="space-y-2">
          {category.links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm text-link hover:text-link-hover hover:underline"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: expandable accordion */}
      <div className="md:hidden">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between p-4 text-left"
          aria-expanded={isExpanded}
        >
          <h3 className="text-lg font-bold text-primary">{category.title}</h3>
          <span
            className={`text-text-muted transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            aria-hidden="true"
          >
            &#9660;
          </span>
        </button>
        {isExpanded && (
          <ul className="space-y-2 px-4 pb-4">
            {category.links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
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

export function BrowseByStandard() {
  return (
    <section data-testid="section-browse-by-standard" className="py-12 md:py-16">
      <Container>
        <h2 className="mb-8 text-3xl font-black text-text-primary">
          Browse by Standard
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {STANDARD_CATEGORIES.map((category) => (
            <CategoryCard key={category.title} category={category} />
          ))}
        </div>
      </Container>
    </section>
  )
}
