/**
 * @description
 * Content type badge that maps content type strings to styled badge variants.
 * Extends the Badge primitive from ui/ with content-type-specific color mapping
 * and automatic label humanization from slug-style type values.
 *
 * Used on cards, listings, and search results to indicate content type
 * (Exposure Draft, News, Webinar, Meeting Summary, etc.).
 *
 * @dependencies
 * - Badge: Base badge primitive from ui/
 *
 * @notes
 * - 10 content type variants with distinct colors
 * - Default label auto-generated from type prop: 'exposure-draft' -> 'Exposure Draft'
 * - Optional label override for custom display text
 */
import React from 'react'
import { Badge } from '@/components/ui'

/**
 * All supported content type values.
 * Maps to badge color tokens defined in globals.css.
 */
type ContentType =
  | 'standard'
  | 'news'
  | 'webinar'
  | 'meeting-summary'
  | 'guidance'
  | 'exposure-draft'
  | 'survey'
  | 're-exposure-draft'
  | 'research'
  | 'public-comment'

type ContentTypeBadgeProps = {
  /** Content type to display */
  type: ContentType
  /** Optional label override; defaults to humanized type value */
  label?: string
  className?: string
}

/**
 * Maps content types to the Badge component's variant prop.
 * Some content types share the same visual variant.
 */
const typeToVariant: Record<ContentType, React.ComponentProps<typeof Badge>['variant']> = {
  standard: 'standard',
  news: 'news',
  webinar: 'webinar',
  'meeting-summary': 'meeting',
  guidance: 'guidance',
  'exposure-draft': 'consultation',
  survey: 'resource',
  're-exposure-draft': 'deadline',
  research: 'decision',
  'public-comment': 'standard',
}

/**
 * Converts a slug-style type string to a human-readable label.
 * Example: 'exposure-draft' -> 'Exposure Draft'
 */
function humanizeType(type: string): string {
  return type
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ContentTypeBadge({ type, label, className }: ContentTypeBadgeProps) {
  const displayLabel = label ?? humanizeType(type)
  const variant = typeToVariant[type]

  return (
    <Badge variant={variant} className={className} data-testid={`badge-${type}`}>
      {displayLabel}
    </Badge>
  )
}
