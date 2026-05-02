/**
 * @description
 * "Important News & Events" 3-column grid section for the homepage.
 * Displays three content columns on a light gray background:
 * - Column 1: Top News — latest 3 news items with board, title, date
 * - Column 2: Respond to Exposure Drafts — open documents for comment with ED number and due date
 * - Column 3: Upcoming Events — next events with date, title, and type badge
 *
 * Key features:
 * - 3-column grid on desktop (md+), stacks vertically on mobile
 * - Each column has a header with title and "View All" link
 * - Column 2 shows active count badge
 * - Column 3 shows "This Month" label
 * - Light gray background (#F5F5F5 / bg-alt)
 * - Empty state handling when no CMS data is available
 *
 * @dependencies
 * - Badge: Type badge for events
 * - Button: Ghost variant for "View All" links
 * - Container: Max-width wrapper
 * - News, Event, DocumentForComment types from mock data
 *
 * @notes
 * - Data fetched server-side from CMS collections (news, events, document-for-comment)
 * - Collections don't exist yet (Epic 1), so empty state handling is critical
 * - Date formatting uses Intl.DateTimeFormat for locale-aware display
 */
import { Badge, Button, Container } from '@/components/ui'
import type { News, Event, DocumentForComment } from '@/__mocks__/cms-data'

type NewsEventsGridProps = {
  news: News[]
  exposureDrafts: DocumentForComment[]
  events: Event[]
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateString))
}

function formatEventDate(dateString: string): string {
  return new Intl.DateTimeFormat('en-CA', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString))
}

/** Maps event type to Badge variant */
const eventTypeBadgeMap: Record<Event['type'], 'meeting' | 'webinar' | 'deadline' | 'decision'> = {
  meeting: 'meeting',
  webinar: 'webinar',
  deadline: 'deadline',
  'decision-summary': 'decision',
}

export function NewsEventsGrid({ news, exposureDrafts, events }: NewsEventsGridProps) {
  const activeCount = exposureDrafts.filter((d) => d.status === 'open').length

  return (
    <section data-testid="section-news-events" className="bg-alt py-12 md:py-16">
      <Container>
        <h2 className="mb-8 text-3xl font-black text-text-primary">
          Important News &amp; Events
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {/* Column 1: Top News */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-secondary">Top News</h3>
              <Button variant="ghost" href="/news">
                All News
              </Button>
            </div>
            {news.length > 0 ? (
              <ul className="space-y-4">
                {news.map((item) => (
                  <li key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      {item.board.abbreviation}
                    </p>
                    <a
                      href={`/news/${item.slug}`}
                      className="mt-1 block text-sm font-semibold leading-snug text-primary hover:text-primary-vivid"
                    >
                      {item.title}
                    </a>
                    <p className="mt-1 text-xs text-text-muted">
                      {formatDate(item.publishedDate)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No news available.</p>
            )}
          </div>

          {/* Column 2: Exposure Drafts */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-secondary">
                Respond to Exposure Drafts
              </h3>
              {activeCount > 0 && (
                <span className="rounded-full bg-primary px-2.5 py-0.5 text-xs font-semibold text-white">
                  {activeCount} Active
                </span>
              )}
            </div>
            {exposureDrafts.length > 0 ? (
              <ul className="space-y-4">
                {exposureDrafts.map((doc) => (
                  <li key={doc.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      {doc.frasIdNumber}
                    </p>
                    <a
                      href={`/consultations/${doc.slug}`}
                      className="mt-1 block text-sm font-semibold leading-snug text-primary hover:text-primary-vivid"
                    >
                      {doc.title}
                    </a>
                    <p className="mt-1 text-xs text-text-muted">
                      Due: {formatDate(doc.commentPeriodEnd)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No open exposure drafts.</p>
            )}
            {exposureDrafts.length > 0 && (
              <div className="mt-4">
                <Button variant="ghost" href="/consultations">
                  All Exposure Drafts
                </Button>
              </div>
            )}
          </div>

          {/* Column 3: Upcoming Events */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-secondary">Upcoming Events</h3>
              <span className="text-xs font-semibold text-text-muted">This Month</span>
            </div>
            {events.length > 0 ? (
              <ul className="space-y-4">
                {events.map((evt) => (
                  <li key={evt.id} className="border-b border-gray-200 pb-4 last:border-0">
                    <div className="flex items-start gap-2">
                      <Badge variant={eventTypeBadgeMap[evt.type]}>
                        {evt.type === 'decision-summary' ? 'Decision' : evt.type}
                      </Badge>
                    </div>
                    <a
                      href={`/events/${evt.slug}`}
                      className="mt-1.5 block text-sm font-semibold leading-snug text-primary hover:text-primary-vivid"
                    >
                      {evt.title}
                    </a>
                    <p className="mt-1 text-xs text-text-muted">
                      {formatEventDate(evt.date)}
                      {evt.startTime && ` · ${evt.startTime}`}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-text-muted">No upcoming events.</p>
            )}
            {events.length > 0 && (
              <div className="mt-4">
                <Button variant="ghost" href="/events">
                  All Events
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
