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
import { getTranslations } from 'next-intl/server'
import { PageHeader } from '@/components/PageHeader'
import { NewsListingClient } from './NewsListingClient'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  return {
    title: `${t('title')} — RAS Canada`,
    description: t('latestNews'),
  }
}

export const revalidate = 60

export default async function NewsListingPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-news-listing">
      <PageHeader title={t('title')} />
      <NewsListingClient />
    </div>
  )
}
