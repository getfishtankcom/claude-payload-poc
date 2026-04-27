/**
 * @description
 * Open Consultations listing page. Displays consultation cards sorted by deadline
 * with text search, board dropdown, and standard dropdown filters.
 *
 * Key features:
 * - Fetches from consultations collection (canonical name — not "documents")
 * - Fetches all boards (excluding RASOC) for filter dropdown
 * - Fetches all standards for filter dropdown
 * - Page header with "Open Consultations" title
 * - Empty state when no open consultations exist
 *
 * @dependencies
 * - payload-helpers: getOpenConsultations, getAllBoards, getAllStandards
 * - PageHeader component
 * - OpenConsultationsClient for interactive filtering
 *
 * @notes
 * - Only open consultations (deadline in future) shown by default
 * - Sorted by deadline ascending (soonest first)
 * - days_remaining computed client-side from deadline_date
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'
import {
  getOpenConsultations,
  getAllBoards,
  getAllStandards,
  toPayloadLocale,
} from '@/lib/payload-helpers'
import { OpenConsultationsClient } from './OpenConsultationsClient'
import { BreadcrumbSchema } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Open Consultations — RAS Canada',
  description: 'Review and comment on open consultations from all boards.',
}

/** Revalidate every 60s — ISR for CMS-driven content */
export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function OpenConsultationsPage({ params }: PageProps) {
  const { locale } = await params
  const [consultations, boards, standards] = await Promise.all([
    getOpenConsultations(toPayloadLocale(locale)),
    getAllBoards(toPayloadLocale(locale)),
    getAllStandards(toPayloadLocale(locale)),
  ])

  // Filter RASOC from board filter
  const boardOptions = boards
    .filter((b) => b.slug !== 'rasoc')
    .map((b) => ({ id: String(b.id), name: b.name, slug: b.slug }))

  const standardOptions = standards.map((s) => ({
    id: String(s.id),
    name: s.name,
    slug: s.slug,
  }))

  // Transform consultations to client data shape
  const consultationCards = consultations.map((c) => {
    const board = typeof c.board !== 'number' ? c.board : null
    const standard = typeof c.standard !== 'number' ? c.standard : null

    return {
      id: String(c.id),
      title: c.title,
      slug: c.slug,
      type: c.type,
      deadline_date: c.deadline_date,
      boardName: board?.name || 'Unknown Board',
      boardSlug: board?.slug || '',
      standardName: standard?.name || null,
      description: null as string | null,
      actionDocuments: (c.action_documents || []).map((d) => ({
        label: d.label,
        url: d.url,
        type: d.type || null,
      })),
      boardSlugFilter: board?.slug || '',
      standardIdFilter: standard ? String(standard.id) : null,
    }
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Open Consultations', url: '/open-consultations' }]} />
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
          <PageHeader
            icon={<ChatBubbleLeftRightIcon />}
            title="Open Consultations"
            subtitle="Review and comment on open consultations from all boards."
          />
        </div>
      </div>
      <OpenConsultationsClient
        consultations={consultationCards}
        boards={boardOptions}
        standards={standardOptions}
      />
    </>
  )
}
