/**
 * @description
 * Template 10: Effective Dates page.
 * Full-width tabbed layout with EffectiveDatesTable component.
 * Static content — no interactive elements, filtering, or pagination.
 *
 * Key features:
 * - H1 "Effective Dates" heading
 * - EffectiveDatesTable with all sections on single page
 * - Section tabs matching T5 page chrome
 * - generateStaticParams for 11 standards sections
 *
 * @dependencies
 * - payload-helpers: getEffectiveDatesByStandard, getStandardsSectionBySlug, getAllStandardsSections
 * - EffectiveDatesTable, SectionTabs, Breadcrumbs
 *
 * @notes
 * - Server component — fetches from effective-dates collection
 * - All sections render on single page (long scroll)
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getEffectiveDatesByStandard,
  getStandardsSectionBySlug,
  getAllStandardsSections,
} from '@/lib/cms'
import type { Board } from '@/payload-types'
import {
  EffectiveDatesTable,
  type EffectiveDateFootnote,
  type EffectiveDateSection,
} from '@/components/EffectiveDatesTable'
import { SectionTabs } from '@/components/SectionTabs'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type PageProps = {
  params: Promise<{ standard: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { standard: standardSlug } = await params
  const section = await getStandardsSectionBySlug(standardSlug)
  const sectionTitle = section ? section.title : standardSlug.toUpperCase()
  return {
    title: `Effective Dates — ${sectionTitle} — RAS Canada`,
    description: `Effective dates for ${sectionTitle} standards, amendments, and interpretations.`,
  }
}

export async function generateStaticParams() {
  const sections = await getAllStandardsSections()
  return sections.map((s) => ({ standard: s.slug }))
}

export default async function EffectiveDatesPage({ params }: PageProps) {
  const { standard: standardSlug } = await params

  // Fetch section for tabs + effective dates data in parallel
  const [section, effectiveDates] = await Promise.all([
    getStandardsSectionBySlug(standardSlug),
    getEffectiveDatesByStandard(standardSlug),
  ])

  if (!section) {
    notFound()
  }

  // Tabs — mark "Effective Dates" as active
  const sectionTabs = section.tabs.map((tab) => ({
    label: tab.label,
    href: tab.href,
    isActive: tab.label.toLowerCase().includes('effective'),
  }))

  // Board info for breadcrumbs (populated when query has depth ≥1)
  const populatedBoard =
    typeof section.board === 'object' && section.board !== null ? (section.board as Board) : null
  const boardAbbr = populatedBoard?.abbreviation ?? ''
  const sectionTitle = section.title

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(populatedBoard
      ? [{ label: boardAbbr, href: `/boards/${populatedBoard.slug}` }]
      : []),
    { label: sectionTitle, href: `/standards/${standardSlug}` },
    { label: 'Effective Dates' },
  ]

  // Parse effective dates data.
  // KNOWN ISSUE: introText / row.application / footnote.text are typed as
  // Lexical objects but EffectiveDatesTable consumes them as raw HTML strings.
  // Seed data currently populates them as strings (types and DB are out of
  // sync). When we wire @payloadcms/richtext-lexical to render the actual
  // Lexical AST, drop the casts below and pass the typed objects through.
  const introText = (effectiveDates?.introText as unknown as string) || undefined
  const sections = (effectiveDates?.sections as unknown as EffectiveDateSection[]) || []
  const footnotes = (effectiveDates?.footnotes as unknown as EffectiveDateFootnote[]) || []

  return (
    <div data-testid="page-effective-dates" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Page Title */}
      <h1 className="mt-4 mb-4 text-3xl font-bold text-primary">Effective Dates</h1>

      {/* Section Tabs */}
      {sectionTabs.length > 0 && <SectionTabs tabs={sectionTabs} />}

      {/* Effective Dates Table */}
      <section className="mt-8 pb-16">
        <EffectiveDatesTable
          introText={introText}
          sections={sections}
          footnotes={footnotes}
        />
      </section>
    </div>
  )
}
