/**
 * @description
 * Annual Report page template — reuses T3B content page pattern.
 * Content page with sidebar nav + rich text body + PDF links.
 *
 * Key features:
 * - Dynamic route: /[board]/about/annual-report
 * - Content from pages collection
 * - Sidebar navigation for About section
 * - Rich text body with downloadable PDF links
 *
 * @dependencies
 * - Container: Max-width wrapper
 * - RichText: Rich text renderer
 * - Breadcrumb: Navigation trail
 * - getPageBySlug, getBoardBySlug: CMS fetch helpers
 *
 * @notes
 * - Follows T3B pattern (content + section nav sidebar)
 * - Board param used for routing context
 * - Sidebar nav is a simple link list (not the interactive SectionNav)
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

import { Container } from '@/components/ui/Container'
import { RichText } from '@/components/RichText'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getPageBySlug, getBoardBySlug } from '@/lib/payload-helpers'

type PageProps = {
  params: Promise<{ board: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { board: boardSlug } = await params
  const board = await getBoardBySlug(boardSlug)
  return {
    title: `Annual Report — ${board?.name || boardSlug.toUpperCase()} — FRAS Canada`,
    description: `Annual report for ${board?.name || boardSlug.toUpperCase()}.`,
  }
}

export default async function AnnualReportPage({ params }: PageProps) {
  const { board: boardSlug } = await params
  const [board, page] = await Promise.all([
    getBoardBySlug(boardSlug),
    getPageBySlug(`${boardSlug}-annual-report`),
  ])

  if (!board) {
    notFound()
  }

  const boardName = board.name

  // Sidebar navigation items for About section
  const aboutNavItems = [
    { label: 'About', href: `/${boardSlug}/about` },
    { label: 'Annual Report', href: `/${boardSlug}/about/annual-report`, active: true },
    { label: 'Board Members', href: `/${boardSlug}/about/members` },
    { label: 'Committees', href: `/${boardSlug}/about/committees` },
  ]

  return (
    <Container as="section" className="py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: boardName, href: `/boards/${boardSlug}` },
          { label: 'About', href: `/${boardSlug}/about` },
          { label: 'Annual Report' },
        ]}
      />

      <div data-testid="page-annual-report" className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        {/* Section Nav Sidebar */}
        <aside data-testid="sidebar-nav" className="hidden lg:block">
          <nav className="sticky top-24 flex flex-col gap-1">
            {aboutNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded px-3 py-2 text-sm transition-colors ${
                  item.active
                    ? 'border-l-2 border-primary bg-primary/5 font-semibold text-primary'
                    : 'text-text-secondary hover:bg-surface-subtle hover:text-text-primary'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main data-testid="main-content" className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-text-primary">
            {page?.title || 'Annual Report'}
          </h1>

          {/* Rich text body from hero.richText */}
          {page?.hero?.richText ? (
            <RichText
              content={page.hero.richText as unknown as Record<string, unknown>}
              className="prose max-w-none"
            />
          ) : (
            <p className="text-text-muted italic">
              Annual report content is not yet available. Please check back soon.
            </p>
          )}
        </main>
      </div>
    </Container>
  )
}
