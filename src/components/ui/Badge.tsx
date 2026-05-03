/**
 * @description
 * Content type badge component with 9 variants mapped to badge color tokens.
 * Used on cards and listings to indicate content type (Standard, News, Webinar, etc.).
 *
 * Variants and their colors (from design-tokens.md Section 1.6):
 * - standard: Purple (#601F5B) — Standards documents
 * - news: Dark (#333333) — News articles
 * - webinar: Teal (#0D9488) — Webinar events
 * - meeting: Gray (#696969) — Meeting summaries
 * - guidance: Dark outline (#555555) — Guidance documents (ghost style)
 * - consultation: Bright purple (#A53B9D) — Open consultations
 * - decision: Blue (#243E90) — Decision summaries
 * - deadline: Red (#9F2528) — Deadlines
 * - resource: Medium purple (#8E3387) — General resources
 *
 * @dependencies
 * - Design tokens from globals.css: --color-badge-* tokens
 *
 * @notes
 * - Badge colors are approximate — marked NEEDS REVIEW in design-tokens.md
 * - Guidance variant uses ghost/outline style instead of filled
 * - All badges use uppercase text for visual distinction
 */
import React from 'react'

type BadgeVariant =
  | 'standard'
  | 'news'
  | 'webinar'
  | 'meeting'
  | 'guidance'
  | 'consultation'
  | 'decision'
  | 'deadline'
  | 'resource'
  | 'survey'

type BadgeProps = {
  variant: BadgeVariant
  children: React.ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  standard: 'bg-badge-standard text-white',
  news: 'bg-badge-news text-white',
  webinar: 'bg-badge-webinar text-white',
  meeting: 'bg-badge-meeting text-white',
  guidance: 'bg-transparent text-badge-guidance border border-badge-guidance',
  consultation: 'bg-badge-consultation text-white',
  decision: 'bg-badge-decision text-white',
  deadline: 'bg-badge-deadline text-white',
  resource: 'bg-badge-resource text-white',
  survey: 'bg-badge-survey text-white',
}

export function Badge({ variant, children, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${variantClasses[variant]} ${className}`.trim()}
    >
      {children}
    </span>
  )
}
