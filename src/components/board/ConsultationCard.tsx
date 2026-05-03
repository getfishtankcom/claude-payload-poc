/**
 * @description
 * Consultation card for Open Consultations listing page.
 * Displays title, badges, deadline, board/standard info, description,
 * countdown text, and action buttons.
 *
 * Key features:
 * - Title renders as linked heading
 * - Type badges (Exposure Draft, Survey, Re-exposure Draft) + deadline date badge
 * - Board full name + standard name displayed as "Board . Standard"
 * - "Comments due in X days" computed client-side from deadline_date
 * - Past-deadline shows "Comments closed"
 * - Action buttons from action_documents array
 *
 * @dependencies
 * - Badge component for type and deadline badges
 *
 * @notes
 * - Client component for days_remaining computation
 * - Countdown computed at render time (client-side)
 * - Data comes from consultations collection (canonical name)
 */
'use client'

import React from 'react'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui/Badge'

export type ConsultationCardData = {
  id: string | number
  title: string
  slug: string
  type: string
  deadline_date: string
  boardName: string
  boardSlug: string
  standardName?: string | null
  description?: string | null
  actionDocuments?: { label: string; url: string; type?: string | null }[]
}

type ConsultationCardProps = {
  consultation: ConsultationCardData
  className?: string
}

function getDaysRemaining(deadlineDate: string): number {
  const now = new Date()
  const deadline = new Date(deadlineDate)
  const diffMs = deadline.getTime() - now.getTime()
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

/** Map consultation type to Badge variant */
function typeToBadgeVariant(type: string): 'standard' | 'survey' | 'guidance' {
  const mapping: Record<string, 'standard' | 'survey' | 'guidance'> = {
    'Exposure Draft': 'standard',
    'Survey': 'survey',
    'Re-exposure Draft': 'guidance',
  }
  return mapping[type] || 'standard'
}

export function ConsultationCard({ consultation, className = '' }: ConsultationCardProps) {
  const daysRemaining = getDaysRemaining(consultation.deadline_date)
  const isClosed = daysRemaining <= 0

  return (
    <article
      className={`rounded-md border border-gray-200 bg-white p-5 ${className}`.trim()}
      data-testid="consultation-card"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          {/* Title */}
          <h3 className="text-lg font-semibold">
            <Link
              href={`/open-consultations/${consultation.slug}`}
              className="text-primary hover:underline"
            >
              {consultation.title}
            </Link>
          </h3>

          {/* Badges row */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant={typeToBadgeVariant(consultation.type)}>
              {consultation.type}
            </Badge>
            <Badge variant={isClosed ? 'meeting' : 'deadline'}>
              {formatDate(consultation.deadline_date)}
            </Badge>
          </div>

          {/* Board . Standard */}
          <p className="mt-2 text-sm text-text-muted">
            {consultation.boardName}
            {consultation.standardName && ` \u00B7 ${consultation.standardName}`}
          </p>

          {/* Description */}
          {consultation.description && (
            <p className="mt-2 text-sm text-text-primary line-clamp-2">
              {consultation.description}
            </p>
          )}

          {/* Action buttons */}
          {consultation.actionDocuments && consultation.actionDocuments.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {consultation.actionDocuments.map((doc, i) => (
                <a
                  key={i}
                  href={doc.url}
                  className="inline-flex items-center rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                  target={doc.url.startsWith('http') ? '_blank' : undefined}
                  rel={doc.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  {doc.label}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Countdown badge */}
        <div className="flex-shrink-0 text-right">
          {isClosed ? (
            <span className="inline-block rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-text-muted">
              Comments closed
            </span>
          ) : (
            <span className="inline-block rounded-md bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary">
              Comments due in {daysRemaining} day{daysRemaining !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
