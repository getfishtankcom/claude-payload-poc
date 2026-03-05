/**
 * @description
 * Search Results page route at `/search`.
 * Server component that fetches search config from CMS and renders
 * the client-side search experience.
 *
 * Key features:
 * - Fetches popular tags from search-config global for tag chips
 * - Wraps SearchPageClient (client component with react-instantsearch)
 * - SEO metadata for search page
 *
 * @dependencies
 * - payload-helpers: getSearchConfig() for CMS data
 * - SearchPageClient: Client-side search experience
 *
 * @notes
 * - Server component wrapper for client-side search
 * - Popular tags are fetched server-side and passed as props
 * - Suspense boundary wraps client component for streaming SSR
 */
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { getSearchConfig } from '@/lib/payload-helpers'
import { SearchPageClient } from './SearchPageClient'

export const metadata: Metadata = {
  title: 'Search Results — FRAS Canada',
  description: 'Search across standards, projects, news, documents, and more.',
}

export default async function SearchPage() {
  const searchConfig = await getSearchConfig()

  return (
    <div data-testid="page-search" className="min-h-screen">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24">
            <p className="text-text-muted">Loading search...</p>
          </div>
        }
      >
        <SearchPageClient popularTags={searchConfig?.popular_tags as { label: string; query: string; id?: string }[] | null | undefined} />
      </Suspense>
    </div>
  )
}
