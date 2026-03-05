/**
 * @description
 * Vertical button list for quick action links on Board Detail and Project Detail sidebars.
 * Renders action buttons from CMS board.quick_actions[] data — labels are NOT hardcoded.
 *
 * Key features:
 * - Vertical stack of action buttons/links
 * - Each button displays label and optional icon
 * - External links open in new tab with rel="noopener noreferrer"
 * - Shared between Board Detail and Project Detail pages
 *
 * @dependencies
 * - @heroicons/react: ArrowTopRightOnSquareIcon for external link indicator
 *
 * @notes
 * - Data comes from board.quick_actions[] — do NOT hardcode action labels
 * - Component is a presentational server component (no interactivity)
 * - Icons are optional; if provided, use Heroicon name mapping
 */
import React from 'react'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

export type QuickAction = {
  /** Button label text from CMS */
  label: string
  /** Target URL */
  url: string
  /** Optional icon identifier */
  icon?: string | null
}

type QuickActionsProps = {
  /** Action items from CMS board.quick_actions array */
  actions: QuickAction[]
  /** Section heading (default: "Quick Actions") */
  heading?: string
  className?: string
}

function isExternalUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://')
}

export function QuickActions({
  actions,
  heading = 'Quick Actions',
  className = '',
}: QuickActionsProps) {
  if (actions.length === 0) return null

  return (
    <div
      className={`${className}`.trim()}
      data-testid="quick-actions"
      data-quick-actions=""
    >
      <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-text-heading">
        {heading}
      </h3>
      <div className="space-y-2">
        {actions.map((action, index) => {
          const external = isExternalUrl(action.url)
          return (
            <a
              key={`${action.url}-${index}`}
              href={action.url}
              className="flex items-center justify-between gap-2 rounded-md border border-primary px-4 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-white"
              {...(external
                ? { target: '_blank', rel: 'noopener noreferrer' }
                : {})}
              data-testid="quick-action-link"
            >
              <span>{action.label}</span>
              {external && (
                <ArrowTopRightOnSquareIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
              )}
            </a>
          )
        })}
      </div>
    </div>
  )
}
