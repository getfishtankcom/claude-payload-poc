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
import { notFound } from 'next/navigation'
import {
  getStandardsSectionBySlug,
  getAllStandardsSections,
  getLatestNews,
} from '@/lib/payload-helpers'
import { BoardLogoHero } from '@/components/BoardLogoHero'
import { SectionTabs } from '@/components/SectionTabs'
import { ActiveProjectsTable } from '@/components/ActiveProjectsTable'
import { FeatureCTABlock } from '@/components/FeatureCTABlock'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type PageProps = {
  params: Promise<{ standard: string }>
}

export async function generateStaticParams() {
  const sections = await getAllStandardsSections()
  return sections.map((s) => ({
    standard: s.slug as string,
  }))
}

export default async function StandardsOverviewPage({ params }: PageProps) {
  const { standard: standardSlug } = await params
  const section = await getStandardsSectionBySlug(standardSlug)

  if (!section) {
    notFound()
  }

  const title = section.title as string
  const boardName = (section.boardName as string) || ''
  const boardLogo = section.boardLogo as Record<string, unknown> | undefined
  const logoUrl = boardLogo?.url as string | undefined

  // Tabs — mark "Overview" as active
  const tabs = (section.tabs as Array<{ label: string; href: string; isActive?: boolean }>) || []
  const sectionTabs = tabs.map((tab) => ({
    label: tab.label,
    href: tab.href,
    isActive: tab.href === `/${standardSlug}` || tab.href === `/${standardSlug}/`,
  }))
  // Default first tab to active if none matched
  if (sectionTabs.length > 0 && !sectionTabs.some((t) => t.isActive)) {
    sectionTabs[0].isActive = true
  }

  // Active projects
  const activeProjects = (section.activeProjects as Array<Record<string, unknown>>) || []
  const projectRows = activeProjects.map((p) => ({
    name: (p.title as string) || (p.name as string) || '',
    href: `/active-projects/${(p.board as Record<string, unknown>)?.slug || 'acsb'}/${p.slug as string}`,
    description: (p.summary as string) || (p.description as string) || '',
  }))

  // Feature CTAs
  const featureCTAs = (section.featureCTAs as Array<{
    heading: string
    description: string
    buttonLabel: string
    buttonHref: string
    variant: 'light' | 'dark-purple'
  }>) || []

  // News (3 items)
  const newsItems = await getLatestNews(3)

  // Board relationship for color
  const board = section.board as Record<string, unknown> | undefined
  const boardColor = (board?.color as string) || '#601F5B'
  const boardAbbr = (board?.abbreviation as string) || ''

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(boardAbbr ? [{ label: boardAbbr, href: `/boards/${board?.slug as string}` }] : []),
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
              {newsItems.map((item) => {
                const news = item as unknown as Record<string, unknown>
                return (
                  <div
                    key={news.id as string}
                    className="rounded-md border border-gray-200 p-5 transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <p className="mb-2 text-xs text-text-muted">
                      {new Date(news.publishedDate as string).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <h3 className="mb-3 text-sm font-semibold text-text-primary">
                      {news.title as string}
                    </h3>
                    <a
                      href={`/news/${news.slug as string}`}
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
                )
              })}
            </div>
          ) : (
            <p className="text-sm italic text-text-muted">No recent news items.</p>
          )}
        </section>
      </div>
    </div>
  )
}
