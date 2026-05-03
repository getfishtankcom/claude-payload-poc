/**
 * @description
 * Upcoming events sidebar widget for Board Detail and Project Detail pages.
 * Shows a "View All" header link and a list of upcoming events with date, title, and type badge.
 *
 * Key features:
 * - "View All" link with URL derived from board slug (not hardcoded)
 * - Event items with formatted date, title, and type badge
 * - Events sorted by date ascending (soonest first) — sorting done by caller
 * - Max 3-5 events displayed
 * - Empty state: section hidden when no events
 *
 * @dependencies
 * - Badge component for event type indicators
 * - next/link for client-side navigation
 *
 * @notes
 * - Server component (no interactivity)
 * - Badge variants: webinar=teal, meeting=gray, deadline=red
 */
import React from 'react'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/Badge'

export type UpcomingEventItem = {
  id: string
  title: string
  slug: string
  date: string
  type: 'meeting' | 'webinar' | 'deadline' | 'decision-summary'
}

type UpcomingEventsProps = {
  /** List of upcoming events, pre-sorted by date ascending */
  events: UpcomingEventItem[]
  /** Board slug for constructing "View All" link */
  boardSlug: string
  className?: string
}

/** Maps event type to Badge variant */
const typeToBadgeVariant: Record<UpcomingEventItem['type'], 'meeting' | 'webinar' | 'deadline' | 'decision'> = {
  meeting: 'meeting',
  webinar: 'webinar',
  deadline: 'deadline',
  'decision-summary': 'decision',
}

/** Human-readable event type label */
const typeLabels: Record<UpcomingEventItem['type'], string> = {
  meeting: 'Meeting',
  webinar: 'Webinar',
  deadline: 'Deadline',
  'decision-summary': 'Decision Summary',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function UpcomingEvents({ events, boardSlug, className = '' }: UpcomingEventsProps) {
  if (events.length === 0) return null

  const viewAllUrl = `/boards/${boardSlug}/events`

  return (
    <div className={`${className}`.trim()} data-testid="upcoming-events">
      {/* Header with View All link */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-heading">
          Upcoming Events
        </h3>
        <Link
          href={viewAllUrl}
          className="text-sm font-medium text-primary hover:text-primary-vivid"
        >
          View All
        </Link>
      </div>

      {/* Event list */}
      <div className="space-y-4">
        {events.map((event) => (
          <div key={event.id} className="border-b border-gray-200 pb-3 last:border-b-0">
            <time dateTime={event.date} className="text-xs text-text-muted">
              {formatDate(event.date)}
            </time>
            <p className="mt-1 text-sm font-medium text-text-heading">
              {event.title}
            </p>
            <div className="mt-1.5">
              <Badge variant={typeToBadgeVariant[event.type]}>
                {typeLabels[event.type]}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
