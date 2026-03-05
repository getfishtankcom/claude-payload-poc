/**
 * @description
 * Template 14: Committee Index / Directory page.
 * Lists all committees for a board with anchor nav scroll-spy sidebar.
 * Each committee has H2 heading + description + optional "Learn more" link.
 *
 * Key features:
 * - All committees on a single page (no pagination)
 * - AnchorNav sidebar mirrors H2 headings with scroll-spy
 * - Auto-generated anchor IDs from committee slugs
 * - generateStaticParams for SSG per board
 * - Mobile: sidebar becomes collapsible "On this page" section
 *
 * @dependencies
 * - payload-helpers: getCommitteesByBoardSlug, getBoardBySlug, getAllBoards
 * - AnchorNav, Breadcrumbs
 *
 * @notes
 * - Server component with client AnchorNav child
 * - Rich text descriptions rendered via dangerouslySetInnerHTML
 */
import { notFound } from 'next/navigation'
import {
  getCommitteesByBoardSlug,
  getBoardBySlug,
  getAllBoards,
} from '@/lib/payload-helpers'
import { AnchorNav } from '@/components/AnchorNav'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type PageProps = {
  params: Promise<{ board: string }>
}

export async function generateStaticParams() {
  const boards = await getAllBoards()
  return boards
    .filter((b) => {
      const board = b as unknown as Record<string, unknown>
      return !(board.isOversight || (board.slug as string) === 'rasoc')
    })
    .map((b) => {
      const board = b as unknown as Record<string, unknown>
      return { board: board.slug as string }
    })
}

export default async function CommitteesPage({ params }: PageProps) {
  const { board: boardSlug } = await params
  const [board, committees] = await Promise.all([
    getBoardBySlug(boardSlug),
    getCommitteesByBoardSlug(boardSlug),
  ])

  if (!board) {
    notFound()
  }

  const boardData = board as unknown as Record<string, unknown>
  const boardAbbr = boardData.abbreviation as string

  // Build anchor nav items from committee data
  const anchorItems = committees.map((c: Record<string, unknown>) => ({
    label: c.name as string,
    id: c.slug as string,
  }))

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: boardAbbr, href: `/boards/${boardSlug}` },
    { label: 'Committees' },
  ]

  return (
    <div data-testid="page-committees" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      <h1 className="mt-6 mb-8 text-3xl font-bold text-primary">Committees</h1>

      <div className="pb-16 lg:flex lg:gap-10">
        {/* Main content */}
        <div className="lg:w-[70%]" data-testid="main-content">
          {committees.length === 0 ? (
            <p className="text-sm italic text-text-muted">No committees found for this board.</p>
          ) : (
            <div className="space-y-10">
              {committees.map((committee: Record<string, unknown>) => {
                const slug = committee.slug as string
                const name = committee.name as string
                const description = committee.description as Record<string, unknown> | string | undefined
                const detailUrl = committee.detailPageUrl as string | undefined

                // Handle rich text — if it's a Lexical object, we'd serialize it.
                // For now, support string HTML or extract root text
                let descriptionHtml = ''
                if (typeof description === 'string') {
                  descriptionHtml = description
                } else if (description && typeof description === 'object') {
                  // Lexical rich text — render as JSON placeholder
                  descriptionHtml = '<p>Committee description available in CMS.</p>'
                }

                return (
                  <section key={slug} id={slug} data-testid={`section-${slug}`}>
                    <h2 className="mb-3 text-xl font-bold text-primary">
                      {detailUrl ? (
                        <a href={detailUrl} className="hover:underline">
                          {name}
                        </a>
                      ) : (
                        name
                      )}
                    </h2>

                    {descriptionHtml && (
                      <div
                        className="mb-3 text-sm text-text-primary prose prose-sm max-w-none prose-a:text-link"
                        dangerouslySetInnerHTML={{ __html: descriptionHtml }}
                      />
                    )}

                    {detailUrl && (
                      <a
                        href={detailUrl}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-link hover:underline"
                      >
                        Learn more
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                        </svg>
                      </a>
                    )}
                  </section>
                )
              })}
            </div>
          )}
        </div>

        {/* Sidebar: Anchor Nav */}
        {anchorItems.length > 0 && (
          <aside className="mt-8 lg:mt-0 lg:w-[30%]" data-testid="right-rail">
            <AnchorNav items={anchorItems} />
          </aside>
        )}
      </div>
    </div>
  )
}
