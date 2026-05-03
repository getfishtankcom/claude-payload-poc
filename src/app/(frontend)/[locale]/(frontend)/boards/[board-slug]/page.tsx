/**
 * @description
 * Board Detail page route. Renders a 3-column layout for each board:
 * SectionNav (left) | Main content with tabs (center) | Quick Actions + Events + Resources (right).
 *
 * Key features:
 * - generateStaticParams for SSG (4 boards: CSSB, AcSB, PSAB, AASB)
 * - Fetches board data + related projects, news, events server-side
 * - Breadcrumb: Home > Boards > [Board Name]
 * - Page metadata set from board data
 *
 * @dependencies
 * - payload-helpers: getBoardBySlug, getAllBoards, getProjectsByBoard, getNewsByBoard, getEventsByBoard
 * - Breadcrumb component for navigation trail
 * - BoardDetailClient for interactive tab switching
 *
 * @notes
 * - RASOC excluded from static params (oversight council, no board detail page)
 * - Data fetched in parallel via Promise.all for performance
 * - Empty states handled gracefully when CMS not seeded
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import {
  getBoardBySlug,
  getActiveBoards,
  getProjectsByBoard,
  getNewsByBoard,
  getEventsByBoard,
  toPayloadLocale,
} from '@/lib/payload-helpers'
import { BoardDetailClient } from './BoardDetailClient'
import { BreadcrumbSchema } from '@/components/StructuredData'
import type { Event as EventType, News as NewsType } from '@/payload-types'

type PageProps = {
  params: Promise<{ locale: string; 'board-slug': string }>
}

/** Pre-generate pages for 4 boards (excluding RASOC at the data layer per #78). */
export async function generateStaticParams() {
  const boards = await getActiveBoards()
  return boards.map((b) => ({ 'board-slug': b.slug }))
}

/** Dynamic metadata from board data */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, 'board-slug': slug } = await params
  const board = await getBoardBySlug(slug, toPayloadLocale(locale))
  if (!board) return { title: 'Board Not Found' }

  return {
    title: `${board.name} — RAS Canada`,
    description: board.description || `Learn about the ${board.name} and its standards activities.`,
  }
}

/** Revalidate every 60s — ISR for CMS-driven content */
export const revalidate = 60

export default async function BoardDetailPage({ params }: PageProps) {
  const { locale, 'board-slug': slug } = await params
  const board = await getBoardBySlug(slug, toPayloadLocale(locale))

  if (!board) notFound()

  // Fetch related data in parallel
  const [_projects, news, events] = await Promise.all([
    getProjectsByBoard(board.id, 20, toPayloadLocale(locale)),
    getNewsByBoard(board.id, 4, toPayloadLocale(locale)),
    getEventsByBoard(board.id, 3, toPayloadLocale(locale)),
  ])

  // Transform CMS data to component prop shapes
  const quickActions = (board.quick_actions || []).map((qa) => ({
    label: qa.label,
    url: qa.url,
    icon: qa.icon || null,
  }))

  const upcomingEvents = events.map((evt: EventType) => ({
    id: String(evt.id),
    title: evt.title,
    slug: evt.slug,
    date: evt.date,
    type: evt.type.toLowerCase() as 'meeting' | 'webinar' | 'deadline' | 'decision-summary',
  }))

  const resourceItems = (board.resources || []).map((r) => ({
    title: r.title,
    file_url: r.file_url,
    type: r.type || null,
  }))

  const newsItems = news.map((n: NewsType) => ({
    title: n.title,
    date: n.date,
    excerpt: n.excerpt || '',
    slug: n.slug,
    category: n.category || undefined,
    board: board.abbreviation ? { abbreviation: board.abbreviation } : undefined,
  }))

  // Default tabs if board has none configured
  const tabs = board.tabs && board.tabs.length > 0
    ? board.tabs.map((t) => ({ label: t.label, slug: t.slug, content: t.content, id: t.id }))
    : [{ label: 'Overview', slug: 'overview', content: null, id: null }]

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Boards', href: '/boards' },
    { label: board.name, href: `/boards/${board.slug}` },
  ]

  return (
    <>
      <BreadcrumbSchema items={breadcrumbItems.map((b) => ({ name: b.label, url: b.href }))} />
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="mt-3 text-3xl font-bold text-primary">{board.name}</h1>
          {board.description && (
            <p className="mt-2 max-w-3xl text-base text-text-muted">{board.description}</p>
          )}
        </div>
      </div>
      <BoardDetailClient
        boardName={board.abbreviation || board.name}
        boardSlug={board.slug}
        tabs={tabs}
        quickActions={quickActions}
        events={upcomingEvents}
        resources={resourceItems}
        news={newsItems}
      />
    </>
  )
}
