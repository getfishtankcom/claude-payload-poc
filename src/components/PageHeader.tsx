/**
 * @description
 * Page header component with optional icon, H1 title, and optional subtitle.
 * Used on Active Projects listing, Open Consultations listing, Board Detail pages,
 * and other top-level page headers throughout the site.
 *
 * @dependencies
 * - Design tokens from globals.css: text-heading color, text sizes
 *
 * @notes
 * - H1 uses text-3xl (34px) font-bold per design system heading scale
 * - Icon is optional, sized at w-8 h-8, colored text-primary
 * - Subtitle uses text-lg text-muted for secondary description
 * - Server component by default (no interactivity)
 */
import React from 'react'

type PageHeaderProps = {
  /** Optional icon (Heroicon or custom SVG) displayed before the title */
  icon?: React.ReactNode
  /** Page title rendered as H1 */
  title: string
  /** Optional subtitle/description text below the title */
  subtitle?: string
  className?: string
}

export function PageHeader({ icon, title, subtitle, className = '' }: PageHeaderProps) {
  return (
    <div className={`${className}`.trim()} data-testid="page-header">
      <div className="flex items-center gap-3">
        {icon && (
          <span className="flex-shrink-0 text-primary [&>svg]:h-8 [&>svg]:w-8" aria-hidden="true">
            {icon}
          </span>
        )}
        <h1 className="text-3xl font-bold text-primary">{title}</h1>
      </div>
      {subtitle && <p className="mt-2 text-lg text-text-muted">{subtitle}</p>}
    </div>
  )
}
