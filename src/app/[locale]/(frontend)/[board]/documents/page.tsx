/**
 * @description
 * Template 8: Documents for Comment listing page.
 * Full-width tabbed layout with Open/Closed pill tabs and grouped table display.
 *
 * Key features:
 * - TabPills for Open/Closed for Comment toggle via query params
 * - GroupedTable with DocumentRow components grouped by document type
 * - generateStaticParams for 11 standards sections
 * - Data fetched from `documents-for-comment` collection (canonical name)
 *
 * @dependencies
 * - TabPills: Open/Closed toggle pills
 * - GroupedTable: Grouped display with section headers
 * - DocumentRow: Individual document row with action buttons
 * - PageHeader: H1 page title
 * - payload-helpers: getDocumentsForComment, getAllStandardsSlugs
 *
 * @notes
 * - Default tab: Open for Comment
 * - ?tab=closed-for-comment switches to closed documents
 * - Documents grouped by `group` field (Exposure Drafts, Consultation Papers, etc.)
 * - Route uses [slug] param for standard slug (shared dynamic segment)
 */
import type { Metadata } from 'next'
import { PageHeader } from '@/components/PageHeader'
import { TabPills } from '@/components/TabPills'
import { GroupedTable } from '@/components/GroupedTable'
import { DocumentRow } from '@/components/DocumentRow'
import { getDocumentsForComment, getAllStandardsSlugs } from '@/lib/payload-helpers'

type Props = {
  params: Promise<{ board: string }>
  searchParams: Promise<{ tab?: string }>
}

export const metadata: Metadata = {
  title: 'Documents for Comment — FRAS Canada',
  description: 'Browse documents currently open for public comment or view closed comment periods.',
}

export const revalidate = 60

/** Map group enum values to display headings */
const GROUP_LABELS: Record<string, string> = {
  'exposure-draft': 'Exposure Drafts',
  'consultation-paper': 'Consultation Papers',
  're-exposure-draft': 'Re-exposure Drafts',
  'discussion-paper': 'Discussion Papers',
}

export async function generateStaticParams() {
  const slugs = await getAllStandardsSlugs()
  return slugs.map((s) => ({ board: s }))
}

export default async function DocumentsForCommentPage({ params, searchParams }: Props) {
  const { board: standardSlug } = await params
  const { tab } = await searchParams

  // Determine active tab status
  const isClosedTab = tab === 'closed-for-comment'
  const activeStatus: 'open' | 'closed' = isClosedTab ? 'closed' : 'open'
  const basePath = `/${standardSlug}/documents`

  // Fetch documents for current tab
  const docs = await getDocumentsForComment(activeStatus)

  // Group documents by their group field
  const groupedDocs = new Map<string, unknown[]>()
  for (const doc of docs as Array<{ group?: string }>) {
    const group = doc.group || 'exposure-draft'
    if (!groupedDocs.has(group)) {
      groupedDocs.set(group, [])
    }
    groupedDocs.get(group)!.push(doc)
  }

  // Convert to GroupedTable format
  const groups = Array.from(groupedDocs.entries()).map(([key, rows]) => ({
    heading: GROUP_LABELS[key] || key,
    rows: rows as Array<{
      title: string
      slug: string
      commentSubmitUrl?: string
      commentsPdfUrl?: string
      status: 'open' | 'closed'
    }>,
  }))

  // Tab pills options
  const tabOptions = [
    {
      label: 'Open for Comment',
      queryValue: 'open-for-comment',
      isActive: !isClosedTab,
    },
    {
      label: 'Closed for Comment',
      queryValue: 'closed-for-comment',
      isActive: isClosedTab,
    },
  ]

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8" data-testid="page-documents-for-comment">
      <PageHeader title="Documents for Comment" />

      <div className="mt-6">
        <TabPills
          options={tabOptions}
          paramName="tab"
          basePath={basePath}
        />
      </div>

      <div className="mt-6" data-testid="section-documents-table">
        <GroupedTable
          groups={groups}
          renderRow={(row) => (
            <DocumentRow
              document={{
                title: row.title,
                href: `/${standardSlug}/documents/${row.slug}`,
                commentSubmitUrl: row.commentSubmitUrl,
                commentsPdfUrl: row.commentsPdfUrl,
                status: row.status,
              }}
            />
          )}
        />
      </div>
    </div>
  )
}
