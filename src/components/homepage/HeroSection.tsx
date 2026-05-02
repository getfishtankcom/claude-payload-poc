/**
 * @description
 * Homepage hero section with gradient background, H1 heading, subtitle text,
 * and a project-scoped search bar. The search bar is a visual trigger that
 * opens the SearchModal (built in Epic 5) — no search logic is implemented here.
 *
 * Key features:
 * - Full-width gradient background using `hero-gradient` utility class
 * - White text on gradient for contrast (WCAG compliant)
 * - Search bar with "Find an active project" placeholder (project-scoped, not sitewide)
 * - Responsive: stacks vertically on mobile (<768px)
 *
 * @dependencies
 * - Container: Max-width wrapper from design primitives
 * - Design tokens: --gradient-hero (via .hero-gradient class), text-on-dark colors
 *
 * @notes
 * - Hero search is project-only scope (per Notion specs), NOT sitewide search
 * - Sitewide search is via header search icon (built in Epic 3)
 * - SearchModal integration is a placeholder until Epic 5 is built
 * - data-testid attributes required by self-test config (epic-04.json)
 */
'use client'

import React, { useState } from 'react'
import { Container } from '@/components/ui'

type HeroSectionProps = {
  heading?: string
  subtitle?: string
}

export function HeroSection({
  heading = "Canada's Official Hub for Financial Reporting Standards",
  subtitle = 'RAS provides resources and guidance to help professionals navigate Canadian accounting, auditing, and sustainability standards.',
}: HeroSectionProps) {
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  return (
    <section
      data-testid="hero-section"
      className="hero-gradient py-16 md:py-20 lg:py-24"
    >
      <div data-testid="hero-gradient" aria-hidden="true" />
      <Container>
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            {heading}
          </h1>
          <p className="mt-4 text-base md:text-lg text-text-on-dark-muted leading-relaxed max-w-2xl">
            {subtitle}
          </p>

          {/* Search bar — triggers SearchModal on click/focus */}
          <div className="mt-8 flex max-w-xl" data-testid="hero-search-bar">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex-1 rounded-l-sm border border-white/30 bg-white/10 px-4 py-3 text-left text-white/60 backdrop-blur-sm transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              aria-label="Search for active projects"
            >
              Find an active project
            </button>
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="rounded-r-sm bg-dark px-6 py-3 font-semibold text-white transition-colors hover:bg-gray-800"
            >
              Search
            </button>
          </div>

          {/* SearchModal placeholder — will be replaced by Epic 5.1 */}
          {searchModalOpen && (
            <div
              className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24"
              role="dialog"
              aria-modal="true"
              aria-label="Search"
            >
              <div className="mx-4 w-full max-w-2xl rounded-md bg-white p-8 shadow-lg">
                <p className="text-lg font-semibold text-text-primary">
                  Search Modal
                </p>
                <p className="mt-2 text-text-muted">
                  Full search experience will be built in Epic 5.
                </p>
                <button
                  type="button"
                  onClick={() => setSearchModalOpen(false)}
                  className="mt-4 rounded-sm bg-primary px-4 py-2 text-sm text-white hover:bg-primary-vivid"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  )
}
