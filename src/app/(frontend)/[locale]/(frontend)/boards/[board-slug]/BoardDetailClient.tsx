/**
 * @description
 * Client wrapper for Board Detail page that handles tab/section switching.
 * Manages active section state and passes it to the SectionNav component.
 *
 * @dependencies
 * - SectionNav: Left sidebar navigation
 * - QuickActions: Right sidebar action buttons
 * - UpcomingEvents: Right sidebar events list
 * - ResourcesList: Right sidebar resource links
 * - RecentNews: Main content recent news section
 *
 * @notes
 * - Client component due to section switching state
 * - Data is passed from server component parent via props
 * - Tab content uses Payload rich text (rendered as HTML)
 */
'use client'

import React, { useState } from 'react'
import {
  SectionNav,
  QuickActions,
  UpcomingEvents,
  ResourcesList,
  RecentNews,
} from '@/components/board'
import type { SectionNavItem } from '@/components/board'
import type { QuickAction } from '@/components/board'
import type { UpcomingEventItem } from '@/components/board'
import type { ResourceItem } from '@/components/board'
import type { RecentNewsItem } from '@/components/board'

type TabData = {
  label: string
  slug: string
  content?: unknown
  id?: string | null
}

type BoardDetailClientProps = {
  boardName: string
  boardSlug: string
  tabs: TabData[]
  quickActions: QuickAction[]
  events: UpcomingEventItem[]
  resources: ResourceItem[]
  news: RecentNewsItem[]
}

export function BoardDetailClient({
  boardName,
  boardSlug,
  tabs,
  quickActions,
  events,
  resources,
  news,
}: BoardDetailClientProps) {
  const navItems: SectionNavItem[] = tabs.map((tab) => ({
    label: tab.label,
    slug: tab.slug,
  }))

  const [activeSection, setActiveSection] = useState(navItems[0]?.slug || '')

  return (
    <div
      className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr_280px] lg:px-8"
      data-testid="page-board-detail"
    >
      {/* Left sidebar: Section navigation */}
      <aside data-testid="sidebar-nav">
        <SectionNav
          items={navItems}
          activeItem={activeSection}
          onItemSelect={setActiveSection}
          boardName={boardName}
        />
      </aside>

      {/* Main content area */}
      <div data-testid="main-content">
        {/* Active tab content placeholder */}
        {tabs.map((tab) => (
          <section
            key={tab.slug}
            className={tab.slug === activeSection ? 'block' : 'hidden'}
            data-testid={`section-${tab.slug}`}
          >
            {/* Rich text content would render here if tab.content exists */}
            {tab.slug === 'overview' || tab.slug === activeSection ? (
              <div>
                {/* Overview section shows projects and news */}
                <div className="space-y-10">
                  <RecentNews
                    news={news}
                    boardSlug={boardSlug}
                  />
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-text-muted">
                <p>Content for &ldquo;{tab.label}&rdquo; will be available when configured in the CMS.</p>
              </div>
            )}
          </section>
        ))}

        {/* Fallback when no tabs configured */}
        {tabs.length === 0 && (
          <div className="py-8 text-center text-text-muted">
            <p>No content sections configured for this board.</p>
          </div>
        )}
      </div>

      {/* Right sidebar */}
      <aside className="space-y-8" data-testid="right-rail">
        <QuickActions actions={quickActions} />
        <UpcomingEvents events={events} boardSlug={boardSlug} />
        <ResourcesList resources={resources} />
      </aside>
    </div>
  )
}
