/**
 * @description
 * Homepage route — the main landing page at `/`.
 * Server component that composes 4 homepage sections:
 * 1. HeroSection — gradient background, H1, subtitle, project search bar
 * 2. NewToFras — "New to FRAS?" CTA banner
 * 3. NewsEventsGrid — 3-column grid (news, exposure drafts, events)
 * 4. BrowseByStandard — 4-column standard category card grid
 *
 * Key features:
 * - Server component for fast initial load
 * - Data fetched in parallel from CMS (when collections exist)
 * - Empty state handling for all data-driven sections
 * - Page metadata set for SEO (title, description, og:image)
 *
 * @dependencies
 * - HeroSection: Client component (search bar interaction)
 * - NewToFras: Server component (static content)
 * - NewsEventsGrid: Server component (receives data as props)
 * - BrowseByStandard: Client component (mobile accordion interaction)
 *
 * @notes
 * - CMS collections (news, events, document-for-comment) don't exist yet (Epic 1)
 * - Homepage global doesn't exist yet (Epic 9)
 * - Data fetching uses try/catch with empty fallbacks until collections are created
 * - Once Epic 1 is complete, replace empty arrays with Payload local API queries
 */
import type { Metadata } from 'next'
import { HeroSection, NewToFras, NewsEventsGrid, BrowseByStandard } from '@/components/homepage'
import type { News, Event, DocumentForComment } from '@/__mocks__/cms-data'

export const metadata: Metadata = {
  title: "FRAS Canada — Canada's Official Hub for Financial Reporting Standards",
  description:
    'FRAS provides resources and guidance to help professionals navigate Canadian accounting, auditing, and sustainability standards. Home of AcSB, PSAB, AASB, and CSSB.',
  openGraph: {
    title: "FRAS Canada — Canada's Official Hub for Financial Reporting Standards",
    description:
      'FRAS provides resources and guidance to help professionals navigate Canadian accounting, auditing, and sustainability standards.',
    type: 'website',
  },
}

/**
 * Fetches homepage data from CMS collections.
 * Returns empty arrays until collections are created in Epic 1.
 */
async function getHomepageData(): Promise<{
  news: News[]
  exposureDrafts: DocumentForComment[]
  events: Event[]
}> {
  // TODO: Replace with Payload local API queries after Epic 1
  // const payload = await getPayload({ config })
  // const [newsResult, docsResult, eventsResult] = await Promise.all([
  //   payload.find({ collection: 'news', limit: 3, sort: '-publishedDate' }),
  //   payload.find({ collection: 'document-for-comment', where: { status: { equals: 'open' } }, limit: 3 }),
  //   payload.find({ collection: 'events', where: { date: { greater_than: new Date().toISOString() } }, limit: 3, sort: 'date' }),
  // ])
  return {
    news: [],
    exposureDrafts: [],
    events: [],
  }
}

export default async function HomePage() {
  const { news, exposureDrafts, events } = await getHomepageData()

  return (
    <main data-testid="page-homepage" className="min-h-screen">
      <HeroSection />
      <NewToFras />
      <NewsEventsGrid
        news={news}
        exposureDrafts={exposureDrafts}
        events={events}
      />
      <BrowseByStandard />
    </main>
  )
}
