/**
 * @description
 * Template 12 (board variant): Board-specific news listing page.
 * Pre-filtered to a specific board's news items.
 *
 * @dependencies
 * - NewsListingClient from global news-listings
 * - PageHeader
 * - payload-helpers: getAllBoards
 *
 * @notes
 * - Board slug from route params pre-filters the news listing
 * - Same UI as global news but scoped to one board
 * - Route uses [board] param for board slug (shared dynamic segment)
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { getAllBoards } from '@/lib/payload-helpers'
import { NewsListingClient } from '../../news-listings/NewsListingClient'

type Props = {
  params: Promise<{ board: string }>
}

export const metadata: Metadata = {
  title: 'News — FRAS Canada',
  description: 'Browse news items for this board.',
}

export const revalidate = 60

export async function generateStaticParams() {
  const boards = await getAllBoards()
  return boards.map((b) => ({ board: b.slug }))
}

export default async function BoardNewsListingPage({ params }: Props) {
  const { board: boardSlug } = await params

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-board-news-listing">
      <PageHeader title="News" />
      <NewsListingClient boardSlug={boardSlug} />
    </div>
  )
}
