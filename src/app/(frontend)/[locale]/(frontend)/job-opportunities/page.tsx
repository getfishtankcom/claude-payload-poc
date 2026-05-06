/**
 * @description
 * Template 17: Simple Content / Empty State page (Job Opportunities).
 * Full-width layout with rich text intro, HR divider, and dynamic job listings.
 * Renders empty state when no published jobs exist.
 *
 * Key features:
 * - H1 heading and rich text intro from CMS pages collection
 * - HR divider between intro and listings
 * - Bold "Open Positions" heading from CMS listingHeading field
 * - Dynamic job listings or empty state
 * - No sidebar, no filtering, no pagination
 *
 * @dependencies
 * - payload-helpers: getPageBySlug
 * - JobListings (server component, fetches its own data)
 * - RenderBlocks for intro content
 *
 * @notes
 * - Server component — fetches page config from CMS
 * - JobListings component handles its own data fetching
 * - Empty state is the default/expected state
 */
import type { Metadata } from 'next'
import { getPageBySlug } from '@/lib/cms'
import { JobListings } from '@/components/JobListings'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export const metadata: Metadata = {
  title: 'Job Opportunities — RAS Canada',
  description: 'Current job openings at RAS Canada. Browse volunteer and employment opportunities with Canadian accounting standards boards.',
}

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function JobOpportunitiesPage({ params }: PageProps) {
  const { locale } = await params
  const page = await getPageBySlug('job-opportunities')

  // Extract page fields with fallbacks for when CMS data isn't seeded
  const pageData = page as unknown as Record<string, unknown> | null
  const title = (pageData?.title as string) || 'Become a part of something special!'
  const layout = (pageData?.layout as Array<Record<string, unknown>>) || []
  const listingHeading = (pageData?.listingHeading as string) || 'Open Positions'
  const emptyStateMessage = (pageData?.emptyStateMessage as string) || undefined

  return (
    <div data-testid="page-job-opportunities" className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* H1 heading */}
      <h1 className="mb-6 text-3xl font-bold text-text-primary">{title}</h1>

      {/* Rich text intro content (body paragraphs) */}
      {layout.length > 0 && (
        <div className="prose prose-lg max-w-none prose-headings:text-primary prose-a:text-link mb-6">
          <RenderBlocks blocks={layout as Array<{ blockType: string; [key: string]: unknown }>} locale={locale} />
        </div>
      )}

      {/* Divider */}
      <hr className="my-8 border-gray-200" />

      {/* Listing heading */}
      <h2 className="mb-4 text-xl font-bold text-text-primary">{listingHeading}</h2>

      {/* Dynamic job listings (server component — fetches its own data) */}
      <JobListings emptyStateMessage={emptyStateMessage} />
    </div>
  )
}
