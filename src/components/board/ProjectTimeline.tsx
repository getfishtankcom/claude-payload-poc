/**
 * @description
 * Vertical stepper timeline for Project Detail pages.
 * Renders configurable stages (up to 7) with tri-state indicators:
 * completed (checkmark), current (highlighted), future (dimmed).
 *
 * Key features:
 * - Each stage shows: phase number, date, title, description
 * - Completed stages show green checkmark icon
 * - Current stage is highlighted with primary color
 * - Future stages are dimmed/greyed out
 * - Inline CTA buttons render per stage from ctas array
 * - Mobile: vertical layout with dates aligned left
 *
 * @dependencies
 * - @heroicons/react: CheckIcon for completed stage indicator
 *
 * @notes
 * - current_stage field (1-based) determines which stage is active
 * - Stages with phase_number < current_stage are complete
 * - Stages with phase_number === current_stage are in-progress
 * - Stages with phase_number > current_stage are not-started
 */
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { CheckIcon } from '@heroicons/react/24/solid'

export type TimelineStage = {
  phase_number: number
  date?: string | null
  title: string
  description?: string | null
  ctas?: { label: string; url: string; id?: string | null }[] | null
  id?: string | null
}

type ProjectTimelineProps = {
  /** Timeline stages from CMS project.timeline_stages array */
  stages: TimelineStage[]
  /** Current active stage number (1-based) */
  currentStage: number
  className?: string
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(date)
}

type StageStatus = 'complete' | 'current' | 'future'

function getStageStatus(phaseNumber: number, currentStage: number): StageStatus {
  if (phaseNumber < currentStage) return 'complete'
  if (phaseNumber === currentStage) return 'current'
  return 'future'
}

export function ProjectTimeline({ stages, currentStage, className = '' }: ProjectTimelineProps) {
  const t = useTranslations('projects')

  if (stages.length === 0) return null

  return (
    <div className={`${className}`.trim()} data-testid="project-timeline">
      <h2 className="mb-6 text-xl font-bold text-text-heading">{t('timeline')}</h2>
      <div className="relative">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.phase_number, currentStage)
          const isLast = index === stages.length - 1

          return (
            <div
              key={stage.id || stage.phase_number}
              className="relative flex gap-4 pb-8 last:pb-0"
              data-testid={`timeline-stage-${stage.phase_number}`}
            >
              {/* Vertical connector line */}
              {!isLast && (
                <div
                  className={`absolute left-[19px] top-10 h-[calc(100%-24px)] w-0.5 ${
                    status === 'complete' ? 'bg-timeline-complete' : 'bg-timeline-future'
                  }`}
                  aria-hidden="true"
                />
              )}

              {/* Stage indicator circle — uses the dedicated timeline
                  palette so completed/current states don't read as
                  primary CTAs (#187 / dogfood-2026-05-03). */}
              <div className="relative flex-shrink-0">
                {status === 'complete' ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-timeline-complete">
                    <CheckIcon className="h-5 w-5 text-white" aria-hidden="true" />
                  </div>
                ) : status === 'current' ? (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-timeline-current bg-white">
                    <div className="h-3 w-3 rounded-full bg-timeline-current" />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-timeline-future bg-white">
                    <span className="text-xs font-medium text-text-muted">{stage.phase_number}</span>
                  </div>
                )}
              </div>

              {/* Stage content */}
              <div className="flex-1 pt-1">
                <div className="flex items-baseline gap-2">
                  <span
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      status === 'future'
                        ? 'text-text-muted'
                        : status === 'complete'
                          ? 'text-timeline-complete'
                          : 'text-timeline-current'
                    }`}
                  >
                    {t('stage')} {stage.phase_number}
                  </span>
                  {stage.date && (
                    <time
                      dateTime={stage.date}
                      className="text-xs text-text-muted"
                    >
                      {formatDate(stage.date)}
                    </time>
                  )}
                </div>
                <h3
                  className={`mt-1 text-base font-semibold ${
                    status === 'future' ? 'text-text-muted' : 'text-text-heading'
                  }`}
                >
                  {stage.title}
                </h3>
                {stage.description && (
                  <p
                    className={`mt-1 text-sm ${
                      status === 'future' ? 'text-gray-400' : 'text-text-primary'
                    }`}
                  >
                    {stage.description}
                  </p>
                )}
                {/* Inline CTA buttons */}
                {stage.ctas && stage.ctas.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {stage.ctas.map((cta, ctaIndex) => (
                      <a
                        key={cta.id || ctaIndex}
                        href={cta.url}
                        className="inline-flex items-center rounded-md border border-primary px-3 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white"
                        target={cta.url.startsWith('http') ? '_blank' : undefined}
                        rel={cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        {cta.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
