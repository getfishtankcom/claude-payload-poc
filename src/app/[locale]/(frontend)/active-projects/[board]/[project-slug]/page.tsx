/**
 * @description
 * Project Detail page route. Renders a 3-column layout:
 * SectionNav (left) | Main content (center) | Right sidebar (actions, events, resources).
 *
 * Key features:
 * - generateStaticParams for SSG
 * - Fetches project with populated relationships (board, standard, contacts, documents)
 * - Summary and key proposals render rich text from CMS
 * - Contact cards display name, credentials, title, phone, email
 * - Breadcrumb: Home > Active Projects > [Board] > [Project Title]
 *
 * @dependencies
 * - payload-helpers: getProjectBySlug, getAllActiveProjects, getEventsByBoard, getNewsByBoard
 * - Board sidebar components: SectionNav, QuickActions, UpcomingEvents, ResourcesList
 * - ProjectTimeline component for vertical stepper
 *
 * @notes
 * - Rich text fields (summary, key_proposals) are Lexical format — render as serialized HTML
 * - Contact photos use Payload Media upload
 * - Mobile: stacked layout
 */
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Breadcrumb } from '@/components/layout/Breadcrumb'
import { ProjectTimeline } from '@/components/board/ProjectTimeline'
import {
  SectionNav,
  QuickActions,
  UpcomingEvents,
  ResourcesList,
} from '@/components/board'
import {
  getProjectBySlug,
  getAllActiveProjects,
  getEventsByBoard,
} from '@/lib/payload-helpers'
import type { Board as BoardType, Contact as ContactType, Event as EventType } from '@/payload-types'

type PageProps = {
  params: Promise<{ locale: string; board: string; 'project-slug': string }>
}

export async function generateStaticParams() {
  const projects = await getAllActiveProjects()
  return projects
    .filter((p) => typeof p.board !== 'number' && p.board?.slug)
    .map((p) => ({
      board: (p.board as BoardType).slug,
      'project-slug': p.slug,
    }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, 'project-slug': slug } = await params
  const project = await getProjectBySlug(slug, locale)
  if (!project) return { title: 'Project Not Found' }

  return {
    title: `${project.title} — FRAS Canada`,
    description: `Learn about the ${project.title} project and its current status.`,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, board: boardSlug, 'project-slug': projectSlug } = await params
  const project = await getProjectBySlug(projectSlug, locale)

  if (!project) notFound()

  // Extract populated board
  const board = typeof project.board !== 'number' ? project.board : null
  const boardName = board?.abbreviation || board?.name || boardSlug.toUpperCase()

  // Fetch related events
  const events = board ? await getEventsByBoard(board.id, 3, locale) : []

  // Build SectionNav items from board tabs (if board is populated)
  const navItems = board?.tabs
    ? board.tabs.map((t) => ({ label: t.label, slug: t.slug }))
    : [{ label: 'Overview', slug: 'overview' }]

  // Quick actions from board
  const quickActions = (board?.quick_actions || []).map((qa) => ({
    label: qa.label,
    url: qa.url,
    icon: qa.icon || null,
  }))

  // Resources from board
  const resourceItems = (board?.resources || []).map((r) => ({
    title: r.title,
    file_url: r.file_url,
    type: r.type || null,
  }))

  // Events for sidebar
  const upcomingEvents = events.map((evt: EventType) => ({
    id: String(evt.id),
    title: evt.title,
    slug: evt.slug,
    date: evt.date,
    type: evt.type.toLowerCase() as 'meeting' | 'webinar' | 'deadline' | 'decision-summary',
  }))

  // Timeline stages
  const timelineStages = (project.timeline_stages || []).map((s) => ({
    phase_number: s.phase_number,
    date: s.date || null,
    title: s.title,
    description: s.description || null,
    ctas: s.ctas || null,
    id: s.id || null,
  }))

  // Contacts
  const contacts = (project.contacts || [])
    .filter((c): c is ContactType => typeof c !== 'number')

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Active Projects', href: '/active-projects' },
    { label: boardName, href: `/boards/${board?.slug || boardSlug}` },
    { label: project.title, href: `/active-projects/${boardSlug}/${project.slug}` },
  ]

  return (
    <>
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1440px] px-4 py-4 sm:px-6 lg:px-8">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="mt-3 text-3xl font-bold text-primary">{project.title}</h1>
        </div>
      </div>

      <div
        className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr_280px] lg:px-8"
        data-testid="page-project-detail"
      >
        {/* Left sidebar */}
        <aside data-testid="sidebar-nav">
          <SectionNav
            items={navItems}
            boardName={boardName}
          />
        </aside>

        {/* Main content */}
        <main className="space-y-10" data-testid="main-content">
          {/* Summary section */}
          {project.summary && (
            <section data-testid="section-summary">
              <h2 className="mb-4 text-xl font-bold text-text-heading">Summary</h2>
              <div className="prose max-w-none text-text-primary">
                <p className="text-text-muted">
                  Rich text content will render here when Lexical serializer is configured.
                </p>
              </div>
            </section>
          )}

          {/* Key Proposals section */}
          {project.key_proposals && (
            <section data-testid="section-key-proposals">
              <h2 className="mb-4 text-xl font-bold text-text-heading">Key Proposals</h2>
              <div className="prose max-w-none text-text-primary">
                <p className="text-text-muted">
                  Rich text content will render here when Lexical serializer is configured.
                </p>
              </div>
            </section>
          )}

          {/* Project Timeline */}
          {timelineStages.length > 0 && (
            <ProjectTimeline
              stages={timelineStages}
              currentStage={project.current_stage || 1}
            />
          )}

          {/* Contacts section */}
          {contacts.length > 0 && (
            <section data-testid="section-contacts">
              <h2 className="mb-4 text-xl font-bold text-text-heading">Contacts</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="rounded-md border border-gray-200 p-4"
                    data-testid="contact-card"
                  >
                    <p className="font-semibold text-text-heading">{contact.name}</p>
                    {contact.title && (
                      <p className="text-sm text-text-muted">{contact.title}</p>
                    )}
                    {contact.email && (
                      <a
                        href={`mailto:${contact.email}`}
                        className="mt-1 block text-sm text-primary hover:underline"
                      >
                        {contact.email}
                      </a>
                    )}
                    {contact.phone && (
                      <a
                        href={`tel:${contact.phone}`}
                        className="mt-1 block text-sm text-primary hover:underline"
                      >
                        {contact.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Right sidebar */}
        <aside className="space-y-8" data-testid="right-rail">
          <QuickActions actions={quickActions} />
          <UpcomingEvents events={upcomingEvents} boardSlug={board?.slug || boardSlug} />
          <ResourcesList resources={resourceItems} />
        </aside>
      </div>
    </>
  )
}
