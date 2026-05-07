/**
 * @description
 * Template 5: Standards Overview (Tabbed) page.
 * Full-width layout with BoardLogoHero, breadcrumbs, H1, section tabs,
 * ActiveProjectsTable, FeatureCTABlock, and 3-column news feed.
 *
 * Key features:
 * - BoardLogoHero with board crest and brand color
 * - 5-6 section tabs (IFRS gets 6th tab for IFRIC Agenda Decisions)
 * - Active projects table with linked project names
 * - Feature CTA blocks (light/dark-purple variants)
 * - 3-item news feed in 3-column card layout
 * - generateStaticParams for 11 standards sections
 *
 * @dependencies
 * - payload-helpers: getStandardsSectionBySlug, getAllStandardsSections, getLatestNews
 * - BoardLogoHero, SectionTabs, ActiveProjectsTable, FeatureCTABlock, Breadcrumbs
 *
 * @notes
 * - Server component — fetches from standards-sections collection
 * - Active tab determined by matching current route
 * - News items fetched separately via board filter
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getStandardsSectionBySlug,
  getAllStandardsSections,
  getLatestNews,
} from '@/lib/cms'
import type { Board, Media, Project } from '@/payload-types'
import { BoardLogoHero } from '@/components/BoardLogoHero'
import { SectionTabs } from '@/components/SectionTabs'
import { ActiveProjectsTable } from '@/components/ActiveProjectsTable'
import { FeatureCTABlock } from '@/components/FeatureCTABlock'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type PageProps = {
  params: Promise<{ standard: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { standard: standardSlug } = await params
  const section = await getStandardsSectionBySlug(standardSlug)
  const title = section ? section.title : standardSlug.toUpperCase()
  return {
    title: `${title} — RAS Canada`,
    description: `Overview of ${title} standards including active projects, effective dates, and resources.`,
  }
}

export async function generateStaticParams() {
  const sections = await getAllStandardsSections()
  return sections.map((s) => ({ standard: s.slug }))
}

export default async function StandardsOverviewPage({ params }: PageProps) {
  const { standard: standardSlug } = await params
  const section = await getStandardsSectionBySlug(standardSlug)

  if (!section) {
    notFound()
  }

  const { title } = section
  const boardName = section.boardName ?? ''
  const logoUrl =
    typeof section.boardLogo === 'object' && section.boardLogo !== null
      ? ((section.boardLogo as Media).url ?? undefined)
      : undefined

  // Tabs — mark "Overview" as active
  const sectionTabs = section.tabs.map((tab) => ({
    label: tab.label,
    href: tab.href,
    isActive: tab.href === `/${standardSlug}` || tab.href === `/${standardSlug}/`,
  }))
  // Default first tab to active if none matched
  if (sectionTabs.length > 0 && !sectionTabs.some((t) => t.isActive)) {
    sectionTabs[0].isActive = true
  }

  // Active projects — only the populated (non-ID) entries are renderable.
  const populatedProjects = (section.activeProjects ?? []).filter(
    (p): p is Project => typeof p === 'object' && p !== null,
  )
  const projectRows = populatedProjects.map((p) => {
    const projectBoardSlug =
      typeof p.board === 'object' && p.board !== null ? (p.board as Board).slug : 'acsb'
    return {
      name: p.title ?? '',
      href: `/active-projects/${projectBoardSlug}/${p.slug}`,
      description: '',
    }
  })

  // Feature CTAs — coerce Payload's optional shape to the FeatureCTABlock prop.
  const featureCTAs = (section.featureCTAs ?? []).map((c) => ({
    heading: c.heading,
    description: c.description ?? '',
    buttonLabel: c.buttonLabel ?? '',
    buttonHref: c.buttonHref ?? '',
    variant: (c.variant ?? 'light') as 'light' | 'dark-purple',
  }))

  // News (3 items)
  const newsItems = await getLatestNews(3)

  // Board relationship — populated when the section was queried with depth ≥1.
  const populatedBoard =
    typeof section.board === 'object' && section.board !== null ? (section.board as Board) : null
  const boardColor = '#601F5B'
  const boardAbbr = populatedBoard?.abbreviation ?? ''

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(boardAbbr && populatedBoard
      ? [{ label: boardAbbr, href: `/boards/${populatedBoard.slug}` }]
      : []),
    { label: title },
  ]

  return (
    <div data-testid="page-standards-overview">
      {/* Board Logo Hero */}
      {logoUrl && (
        <BoardLogoHero logo={logoUrl} boardName={boardName} backgroundColor={boardColor} />
      )}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={breadcrumbs} />

        {/* Page Title */}
        <h1 className="mt-4 mb-4 text-3xl font-bold text-primary">{title}</h1>

        {/* Section Tabs */}
        {sectionTabs.length > 0 && <SectionTabs tabs={sectionTabs} />}

        {/* Active Projects Section */}
        <section className="mt-10" data-testid="section-active-projects">
          <h2 className="mb-4 text-xl font-bold text-primary">Active Projects</h2>
          <hr className="mb-6 border-gray-200" />
          <ActiveProjectsTable projects={projectRows} />
        </section>

        {/* Feature CTA Block */}
        {featureCTAs.length > 0 && (
          <section className="mt-10" data-testid="section-feature-ctas">
            <FeatureCTABlock cards={featureCTAs} />
          </section>
        )}

        {/* News Feed */}
        <section className="mt-10 pb-16" data-testid="section-news">
          <h2 className="mb-4 text-xl font-bold text-primary">News</h2>
          <hr className="mb-6 border-gray-200" />
          {newsItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {newsItems.map((news) => (
                <div
                  key={news.id}
                  className="rounded-md border border-gray-200 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  <p className="mb-2 text-xs text-text-muted">
                    {new Date(news.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                  <h3 className="mb-3 text-sm font-semibold text-text-primary">{news.title}</h3>
                  <a
                    href={`/news/${news.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline"
                  >
                    Read More
                    <svg
                      className="h-3 w-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm italic text-text-muted">No recent news items.</p>
          )}
        </section>
      </div>
    </div>
  )
}
