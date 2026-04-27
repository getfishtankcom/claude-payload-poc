/**
 * @description
 * Decision Summaries listing page — reuses T13 listing pattern.
 * No upcoming/past toggle. Simple paginated list.
 *
 * Key features:
 * - Dynamic route: /[board]/decision-summaries
 * - Fetches from decision-summaries collection filtered by board
 * - Client-side pagination
 * - No TabToggle (all items in one list)
 *
 * @dependencies
 * - Container: Max-width wrapper
 * - Breadcrumb: Navigation trail
 * - getBoardBySlug: CMS fetch
 *
 * @notes
 * - Reuses listing pattern from T13 without TabToggle
 * - Board-filtered via relationship query
 * - Client wrapper handles pagination state
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'

import { Container } from '@/components/ui/Container'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { getBoardBySlug } from '@/lib/payload-helpers'
import { DecisionSummariesClient } from './DecisionSummariesClient'

type PageProps = {
  params: Promise<{ board: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { board: boardSlug } = await params
  const board = await getBoardBySlug(boardSlug)
  return {
    title: `Decision Summaries — ${board?.name || boardSlug.toUpperCase()} — RAS Canada`,
    description: `Decision summaries from ${board?.name || boardSlug.toUpperCase()} meetings.`,
  }
}

export default async function DecisionSummariesPage({ params }: PageProps) {
  const { board: boardSlug } = await params

  const board = await getBoardBySlug(boardSlug)
  if (!board) {
    notFound()
  }

  // Fetch all decision summaries for this board
  let docs: Record<string, unknown>[] = []

  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'decision-summaries',
      where: { 'board.slug': { equals: boardSlug } },
      sort: '-publishedDate',
      limit: 100,
      depth: 1,
    })
    docs = result.docs as unknown as Record<string, unknown>[]
  } catch {
    // Collection may not exist yet
  }

  const boardName = board.name

  return (
    <Container as="section" className="py-8 md:py-12">
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: boardName, href: `/boards/${boardSlug}` },
          { label: 'Decision Summaries' },
        ]}
      />

      <div data-testid="page-decision-summaries" className="mt-8">
        <h1 className="text-3xl font-bold text-text-primary mb-6">Decision Summaries</h1>

        <DecisionSummariesClient items={docs} boardSlug={boardSlug} />
      </div>
    </Container>
  )
}
