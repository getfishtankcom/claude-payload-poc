/**
 * @description
 * Template 13: Meetings & Events listing page.
 * Tab toggle (Upcoming/Past) with items per page and server-side pagination.
 *
 * Key features:
 * - TabToggle (Upcoming/Past) — default: Past active
 * - Items Per Page dropdown (10 default)
 * - Meeting items: H2 linked title + excerpt paragraph
 * - Server-side pagination (AcSB has 180+ items)
 * - No category filters, no sort dropdown, no date range
 *
 * @dependencies
 * - MeetingsListingClient: Client wrapper for interactive controls
 * - payload-helpers: getAllBoards
 * - API: GET /api/meetings
 *
 * @notes
 * - Data fetched from `events` collection (canonical name, NOT 'meetings')
 * - Upcoming: date >= today, sort ascending
 * - Past: date < today, sort descending
 * - generateStaticParams for 5 boards
 * - Route uses [board] param for board slug (shared dynamic segment)
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { getAllBoards } from '@/lib/payload-helpers'
import { MeetingsListingClient } from './MeetingsListingClient'

type Props = {
  params: Promise<{ board: string }>
}

export const metadata: Metadata = {
  title: 'Meetings & Events — RAS Canada',
  description: 'Browse upcoming and past meetings and events.',
}

export const revalidate = 60

export async function generateStaticParams() {
  const boards = await getAllBoards()
  return boards.map((b) => ({ board: b.slug }))
}

export default async function MeetingsAndEventsPage({ params }: Props) {
  const { board: boardSlug } = await params

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-meetings-listing">
      <PageHeader title="Meetings & Events" />
      <MeetingsListingClient boardSlug={boardSlug} />
    </div>
  )
}
