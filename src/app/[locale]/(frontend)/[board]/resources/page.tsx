/**
 * @description
 * Template 11: Resources listing page.
 * Full-width layout with category pills, sort/filter bar, listing items, and pagination.
 *
 * Key features:
 * - CategoryPills (All Items, Article, Guidance, In Brief, Other, Webinar)
 * - SortFilterBar (type filter + date range)
 * - ListingItem list with pagination
 * - Client-side filtering via API route
 * - generateStaticParams for 11 standards sections
 *
 * @dependencies
 * - PageHeader, ResourcesListingClient
 * - API route: GET /api/resources
 *
 * @notes
 * - Data fetched from `resources` collection (canonical name, NOT 'documents')
 * - Route uses [board] param for board slug (shared dynamic segment)
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { getAllStandardsSlugs } from '@/lib/payload-helpers'
import { ResourcesListingClient } from './ResourcesListingClient'

type Props = {
  params: Promise<{ board: string }>
}

export const metadata: Metadata = {
  title: 'Resources — FRAS Canada',
  description: 'Browse articles, guidance, webinars, and other resources.',
}

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllStandardsSlugs()
  return slugs.map((s) => ({ board: s }))
}

export default async function ResourcesListingPage({ params }: Props) {
  const { board: standardSlug } = await params

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-resources-listing">
      <PageHeader title="Resources" />
      <ResourcesListingClient standardSlug={standardSlug} />
    </div>
  )
}
