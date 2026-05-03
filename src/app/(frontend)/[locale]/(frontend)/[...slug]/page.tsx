/**
 * @description
 * Dynamic catch-all route for content pages (Templates 3A and 3B).
 * Fetches page data from Payload CMS and conditionally renders with
 * either a staff contact sidebar or section nav sidebar.
 *
 * Key features:
 * - Handles any depth of URL via [...slug] catch-all
 * - Fetches page by joined slug from pages collection
 * - sidebar_type field determines layout variant:
 *   - 'staff_contact': Template 3A with StaffContactCard
 *   - 'section_nav': Template 3B with SectionNavSidebar
 *   - 'none': Full-width content
 * - Rich text body rendered from page layout blocks
 * - Section tabs from CMS page data
 *
 * @dependencies
 * - payload-helpers: getPageByFullSlug, getLatestNews
 * - StaffContactCard, SectionNavSidebar, SectionTabs, Breadcrumbs
 * - RenderBlocks for page builder content
 *
 * @notes
 * - Server component — fetches CMS data at request time
 * - notFound() for missing pages
 * - Staff contacts populated via relationship
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getPageByFullSlug,
  getLatestNews,
  getBoardBySlug,
  toPayloadLocale,
} from '@/lib/payload-helpers'
import { StaffContactCard } from '@/components/StaffContactCard'
import { SectionNavSidebar } from '@/components/SectionNavSidebar'
import { SectionTabs } from '@/components/SectionTabs'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { BoardLanding } from '@/components/board/BoardLanding'

type PageProps = {
  params: Promise<{ locale: string; slug: string[] }>
}

// RASOC is an oversight council, not a standards board — no board landing per
// CLAUDE.md "RASOC Rules". Fall through to the pages-collection lookup so any
// existing /en/rasoc Page (e.g. an "About RASOC" page) still renders.
const RASOC_SLUGS = new Set(['rasoc'])

/**
 * Per-page metadata for board landings. Without this, all 4 boards
 * inherited the locale layout's generic title — bad for SEO + browser
 * tabs / bookmarks. (#150 / QA-102)
 *
 * For non-board single-segment URLs and multi-segment slugs we fall
 * back to the layout default (or any nested route's own
 * generateMetadata).
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params

  if (slug.length === 1 && !RASOC_SLUGS.has(slug[0])) {
    const board = await getBoardBySlug(slug[0], toPayloadLocale(locale))
    if (board) {
      // Return JUST the title segment — the layout's
      // `metadata.title.template` appends " — RAS Canada" so we
      // don't double-suffix. (#150 / QA-102)
      const title = board.abbreviation
        ? `${board.abbreviation} — ${board.name}`
        : board.name
      return {
        title,
        description: board.description ?? undefined,
      }
    }
  }

  // No override — let the layout default + any deeper route metadata
  // flow through.
  return {}
}

export default async function CatchAllPage({ params }: PageProps) {
  const { locale, slug } = await params

  // Single-segment URL → if it matches a non-RASOC board, render the
  // dedicated Board Landing body. Otherwise fall through to the pages
  // collection lookup below.
  if (slug.length === 1 && !RASOC_SLUGS.has(slug[0])) {
    const board = await getBoardBySlug(slug[0], toPayloadLocale(locale))
    if (board) {
      return <BoardLanding board={board} locale={locale} />
    }
  }

  const page = await getPageByFullSlug(slug)

  if (!page) {
    notFound()
  }

  // Type-safe access to page fields
  const pageData = page as unknown as Record<string, unknown>
  const sidebarType = (pageData.sidebar_type as string) || 'none'
  const title = pageData.title as string
  const layout = pageData.layout as Array<Record<string, unknown>> | undefined

  // Build breadcrumbs from slug segments
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...slug.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: index < slug.length - 1 ? `/${slug.slice(0, index + 1).join('/')}` : undefined,
    })),
  ]

  // Get section tabs if page has them configured
  const sectionTabs = (pageData.sectionTabs as Array<{ label: string; href: string; isActive: boolean }>) || []

  // Get staff contacts for sidebar (populated relationship)
  const staffContacts = (pageData.staffContacts as Array<{
    name: string
    title: string
    phone: string
    email: string
  }>) || []

  // Get section nav links for sidebar
  const sectionNavLinks = (pageData.sectionNavLinks as Array<{
    label: string
    href: string
    isActive: boolean
  }>) || []

  // CTA block data
  const ctaBlock = pageData.ctaBlock as {
    heading?: string
    description?: string
    buttonLabel?: string
    buttonHref?: string
    variant?: string
  } | undefined

  // News section
  const showNews = pageData.newsSection as boolean
  const newsItems = showNews ? await getLatestNews(3) : []

  const hasSidebar = sidebarType === 'staff_contact' || sidebarType === 'section_nav'

  return (
    <div data-testid="page-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Section Tabs */}
      {sectionTabs.length > 0 && <SectionTabs tabs={sectionTabs} />}

      <div className={`mt-6 pb-16 ${hasSidebar ? 'lg:flex lg:gap-10' : ''}`}>
        {/* Main content area */}
        <div className={hasSidebar ? 'lg:w-[70%]' : 'w-full'} data-testid="main-content">
          <h1 className="mb-6 text-3xl font-bold text-primary">{title}</h1>

          {/* Page builder blocks */}
          {layout && layout.length > 0 && (
            <div className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-link">
              <RenderBlocks blocks={layout as Array<{ blockType: string; [key: string]: unknown }>} locale={locale} />
            </div>
          )}

          {/* CTA block (dark purple, Template 3A) */}
          {ctaBlock?.heading && (
            <div
              className={`mt-8 rounded-md p-6 ${
                ctaBlock.variant === 'dark-purple'
                  ? 'bg-feature text-white'
                  : 'bg-alt text-text-primary'
              }`}
            >
              <h2
                className={`mb-2 text-lg font-bold ${
                  ctaBlock.variant === 'dark-purple' ? 'text-white' : 'text-text-primary'
                }`}
              >
                {ctaBlock.heading}
              </h2>
              {ctaBlock.description && (
                <p
                  className={`mb-4 text-sm ${
                    ctaBlock.variant === 'dark-purple' ? 'text-text-on-dark-muted' : 'text-text-muted'
                  }`}
                >
                  {ctaBlock.description}
                </p>
              )}
              {ctaBlock.buttonLabel && ctaBlock.buttonHref && (
                <a
                  href={ctaBlock.buttonHref}
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${
                    ctaBlock.variant === 'dark-purple'
                      ? 'text-white hover:text-text-on-dark-muted'
                      : 'text-link hover:text-link-hover'
                  }`}
                >
                  {ctaBlock.buttonLabel}
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </a>
              )}
            </div>
          )}

          {/* News section (Template 3A) */}
          {showNews && newsItems.length > 0 && (
            <section className="mt-10">
              <h2 className="mb-4 text-xl font-bold text-primary">News</h2>
              <div className="space-y-3">
                {newsItems.map((item) => {
                  const news = item as unknown as Record<string, unknown>
                  return (
                    <div key={news.id as string} className="flex gap-4 border-b border-gray-100 pb-3">
                      <span className="shrink-0 text-sm text-text-muted">
                        {new Date(news.publishedDate as string).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <a
                        href={`/news/${news.slug as string}`}
                        className="text-sm text-link hover:underline"
                      >
                        {news.title as string}
                      </a>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        {sidebarType === 'staff_contact' && staffContacts.length > 0 && (
          <aside className="mt-8 lg:mt-0 lg:w-[30%]" data-testid="right-rail">
            <div className="sticky top-8">
              <StaffContactCard contacts={staffContacts} />
            </div>
          </aside>
        )}

        {sidebarType === 'section_nav' && sectionNavLinks.length > 0 && (
          <aside className="mt-8 lg:mt-0 lg:w-[30%]" data-testid="right-rail">
            <div className="sticky top-8">
              <SectionNavSidebar
                sectionLabel={slug[slug.length - 2]?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'Navigation'}
                links={sectionNavLinks}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
