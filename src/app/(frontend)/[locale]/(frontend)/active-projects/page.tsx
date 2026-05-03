/**
 * @description
 * Active Projects listing page. 2-column layout: BoardNav (left) + project cards (right).
 * Projects are grouped under collapsible standard headers with text search and standards filter.
 *
 * Key features:
 * - Fetches all active projects with populated relationships
 * - Fetches all boards for nav sidebar (excluding RASOC)
 * - Fetches all standards for filter dropdown
 * - Page header with "Active Projects" title
 * - Data transformed to client component prop shapes
 *
 * @dependencies
 * - payload-helpers: getAllActiveProjects, getAllBoards, getAllStandards
 * - PageHeader component
 * - ActiveProjectsClient for interactive filtering
 *
 * @notes
 * - RASOC excluded from board nav (oversight council, no active projects)
 * - Projects without a standard go into "Other Projects" group
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { FolderOpenIcon } from '@heroicons/react/24/outline'
import { getTranslations } from 'next-intl/server'
import {
  getAllActiveProjects,
  getActiveBoards,
  getAllStandards,
  toPayloadLocale,
} from '@/lib/payload-helpers'
import { ActiveProjectsClient } from './ActiveProjectsClient'
import { BreadcrumbSchema } from '@/components/StructuredData'

export const metadata: Metadata = {
  title: 'Active Projects — RAS Canada',
  description: 'Browse active standards-setting projects across all boards.',
}

/** Revalidate every 60s — ISR for CMS-driven content */
export const revalidate = 60

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function ActiveProjectsPage({ params }: PageProps) {
  const { locale } = await params
  // Fetch data + i18n strings in parallel.
  // We pass `locale` explicitly to getTranslations because the project does
  // not call setRequestLocale anywhere, and without it next-intl's request
  // context falls through to the default locale (en) on FR routes — leaking
  // English copy into the FR page header. (#77)
  const [projects, boards, standards, tProjects] = await Promise.all([
    getAllActiveProjects(toPayloadLocale(locale)),
    getActiveBoards(toPayloadLocale(locale)),
    getAllStandards(toPayloadLocale(locale)),
    getTranslations({ locale, namespace: 'projects' }),
  ])

  // RASOC is excluded at the data layer via getActiveBoards (#78).
  const navBoards = boards.map((b) => ({
    id: String(b.id),
    name: b.name,
    slug: b.slug,
    abbreviation: b.abbreviation,
  }))

  // Transform standards for filter dropdown
  const standardOptions = standards.map((s) => ({
    id: String(s.id),
    name: s.name,
    slug: s.slug,
  }))

  // Transform projects to client-side data shape
  const projectCards = projects.map((p) => {
    const board = typeof p.board !== 'number' ? p.board : null
    const standard = typeof p.standard !== 'number' ? p.standard : null

    // Get current stage name from timeline_stages
    const currentStageName = p.timeline_stages?.find(
      (s) => s.phase_number === p.current_stage
    )?.title || null

    // Collect CTAs from current stage
    const currentStageCtas = p.timeline_stages?.find(
      (s) => s.phase_number === p.current_stage
    )?.ctas || []

    return {
      id: String(p.id),
      title: p.title,
      slug: p.slug,
      description: null as string | null,
      boardSlug: board?.slug || '',
      badges: p.badges || null,
      currentStage: p.current_stage || null,
      currentStageName,
      ctas: (currentStageCtas || []).map((c) => ({ label: c.label, url: c.url })),
      standardName: standard?.name || null,
      standardId: standard ? String(standard.id) : null,
      boardSlugFilter: board?.slug || '',
    }
  })

  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', url: '/' }, { name: 'Active Projects', url: '/active-projects' }]} />
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">
          <PageHeader
            icon={<FolderOpenIcon />}
            title={tProjects('title')}
            subtitle={tProjects('subtitle')}
          />
        </div>
      </div>
      <ActiveProjectsClient
        boards={navBoards}
        projects={projectCards}
        standards={standardOptions}
      />
    </>
  )
}
