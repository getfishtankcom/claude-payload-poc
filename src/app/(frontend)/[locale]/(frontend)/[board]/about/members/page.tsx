/**
 * @description
 * Template 4: People Listing (Members) page.
 * Displays board members in a 2-column card grid grouped by role
 * (Chair, Vice-Chair, Voting Members) with a section nav sidebar.
 *
 * Key features:
 * - 2-column card grid on desktop, single column on mobile
 * - Section groups: CHAIR, VICE-CHAIR, VOTING MEMBERS
 * - Officers first, then alphabetical within Voting Members
 * - SectionNavSidebar with About section links
 * - generateStaticParams for SSG per board
 * - SectionTabs for board-level navigation
 *
 * @dependencies
 * - payload-helpers: getBoardMembersByBoardSlug, getBoardBySlug, getAllBoards
 * - MemberCard, SectionNavSidebar, SectionTabs, Breadcrumbs
 *
 * @notes
 * - Server component — fetches from board-members collection
 * - Members sorted by role priority then sortOrder then name
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getBoardMembersByBoardSlug,
  getBoardBySlug,
  getAllBoards,
} from '@/lib/payload-helpers'
import { MemberCard } from '@/components/MemberCard'
import { SectionNavSidebar } from '@/components/SectionNavSidebar'
import { SectionTabs } from '@/components/SectionTabs'
import { Breadcrumbs } from '@/components/Breadcrumbs'

type PageProps = {
  params: Promise<{ board: string }>
}

/** Role sort priority — lower = first */
const ROLE_PRIORITY: Record<string, number> = {
  chair: 0,
  'vice-chair': 1,
  'voting-member': 2,
  'non-voting': 3,
}

/** Role display labels for section headers */
const ROLE_LABELS: Record<string, string> = {
  chair: 'CHAIR',
  'vice-chair': 'VICE-CHAIR',
  'voting-member': 'VOTING MEMBERS',
  'non-voting': 'NON-VOTING MEMBERS',
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { board: boardSlug } = await params
  const board = await getBoardBySlug(boardSlug)
  const boardData = board as unknown as Record<string, unknown> | null
  const boardAbbr = (boardData?.abbreviation as string) || boardSlug.toUpperCase()
  return {
    title: `${boardAbbr} Members — RAS Canada`,
    description: `Current board members of the ${boardAbbr}. View chairs, vice-chairs, and voting members.`,
  }
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

export default async function MembersPage({ params }: PageProps) {
  const { board: boardSlug } = await params
  const [board, members] = await Promise.all([
    getBoardBySlug(boardSlug),
    getBoardMembersByBoardSlug(boardSlug),
  ])

  if (!board) {
    notFound()
  }

  const boardData = board as unknown as Record<string, unknown>
  const boardAbbr = boardData.abbreviation as string

  // Sort members by role priority, then sortOrder, then name
  const sortedMembers = [...members].sort((a, b) => {
    const roleA = ROLE_PRIORITY[a.role as string] ?? 99
    const roleB = ROLE_PRIORITY[b.role as string] ?? 99
    if (roleA !== roleB) return roleA - roleB
    const sortA = (a.sortOrder as number) || 0
    const sortB = (b.sortOrder as number) || 0
    if (sortA !== sortB) return sortA - sortB
    return ((a.name as string) || '').localeCompare((b.name as string) || '')
  })

  // Group by role
  const groups: Array<{ role: string; label: string; members: typeof sortedMembers }> = []
  const roleOrder = ['chair', 'vice-chair', 'voting-member', 'non-voting']
  for (const role of roleOrder) {
    const roleMembers = sortedMembers.filter((m) => m.role === role)
    if (roleMembers.length > 0) {
      groups.push({
        role,
        label: ROLE_LABELS[role] || role.toUpperCase(),
        members: roleMembers,
      })
    }
  }

  // Board section tabs
  const tabs = (boardData.tabs as Array<{ label: string; slug: string }>) || []
  const sectionTabs = tabs.map((tab) => ({
    label: tab.label,
    href: `/boards/${boardSlug}/${tab.slug === 'overview' ? '' : tab.slug}`,
    isActive: tab.slug === 'about',
  }))

  // Section nav sidebar links
  const sidebarLinks = [
    { label: 'About', href: `/${boardSlug}/about`, isActive: false },
    { label: 'Due Process', href: `/${boardSlug}/about/due-process`, isActive: false },
    { label: 'International Activities', href: `/${boardSlug}/about/international`, isActive: false },
    { label: 'Members', href: `/${boardSlug}/about/members`, isActive: true },
    { label: 'IRCSS Recommendations', href: `/${boardSlug}/about/ircss`, isActive: false },
  ]

  const breadcrumbs = [
    { label: 'Home', href: '/' },
    { label: boardAbbr, href: `/boards/${boardSlug}` },
    { label: 'About', href: `/${boardSlug}/about` },
    { label: 'Members' },
  ]

  return (
    <div data-testid="page-members" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbs} />

      {/* Section Tabs */}
      {sectionTabs.length > 0 && <SectionTabs tabs={sectionTabs} />}

      <div className="mt-6 pb-16 lg:flex lg:gap-10">
        {/* Main content: 2-column card grid */}
        <div className="lg:w-[70%]" data-testid="main-content">
          <h1 className="mb-8 text-3xl font-bold text-primary">Members</h1>

          {groups.length === 0 ? (
            <p className="text-sm italic text-text-muted">No members found for this board.</p>
          ) : (
            groups.map((group) => (
              <section key={group.role} className="mb-10">
                {/* Section label */}
                <p className="mb-4 text-xs font-bold uppercase tracking-wider text-text-muted">
                  {group.label}
                </p>
                <hr className="mb-6 border-gray-200" />

                {/* 2-column grid */}
                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                  {group.members.map((member) => {
                    const photo = member.photo as Record<string, unknown> | undefined
                    const bioPage = member.bioPage as Record<string, unknown> | undefined
                    return (
                      <MemberCard
                        key={member.id as string}
                        member={{
                          name: member.name as string,
                          credentials: (member.credentials as string) || undefined,
                          photo: photo?.url ? (photo.url as string) : undefined,
                          role: member.role as string,
                          roleLabel: (member.roleLabel as string) || undefined,
                          appointedDate: (member.appointedDate as string) || undefined,
                          termExpires: (member.termExpires as string) || undefined,
                          bioPageUrl: bioPage?.slug ? `/${boardSlug}/about/members/${bioPage.slug as string}` : undefined,
                        }}
                      />
                    )
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Sidebar: Section Nav */}
        <aside className="mt-8 lg:mt-0 lg:w-[30%]" data-testid="right-rail">
          <div className="sticky top-8">
            <SectionNavSidebar sectionLabel="About" links={sidebarLinks} />
          </div>
        </aside>
      </div>
    </div>
  )
}
