/**
 * @description
 * Template 12: Global News listing page.
 * Filtered news listing with category pills, sort/filter bar, and pagination.
 *
 * Key features:
 * - CategoryPills (All Items, Document for Comment, International Activity, Meeting Summary, News, Resource)
 * - SortFilterBar (items per page + sort + date range, NO type filter)
 * - ListingItem list with pagination
 * - Client-side filtering via API route
 *
 * @dependencies
 * - NewsListingClient: Client wrapper for interactive filtering
 *
 * @notes
 * - Global news listing (not board-specific)
 * - Volunteer variant is a separate concern (see acceptance criteria)
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { NewsListingClient } from './NewsListingClient'

export const metadata: Metadata = {
  title: 'News — RAS Canada',
  description: 'Browse the latest news, meeting summaries, and announcements.',
}

export const revalidate = 60

export default function NewsListingPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-news-listing">
      <PageHeader title="News" />
      <NewsListingClient />
    </div>
  )
}
