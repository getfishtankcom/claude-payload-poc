/**
 * @description
 * Vertical flex layout component with configurable gap sizes.
 * Simplifies common stacking pattern used throughout the site.
 *
 * Gap sizes map to spacing tokens:
 * - sm: 8px (--spacing-2) — tight groupings
 * - md: 16px (--spacing-4) — standard sections
 * - lg: 24px (--spacing-6) — section separations
 * - xl: 32px (--spacing-8) — major content divisions
 *
 * @dependencies
 * - Design tokens from globals.css: spacing scale
 *
 * @notes
 * - Renders as a div by default, configurable via `as` prop
 * - Vertical (column) only — horizontal layouts should use flex directly
 */
import React from 'react'

type StackGap = 'sm' | 'md' | 'lg' | 'xl'

type StackProps = {
  children: React.ReactNode
  gap?: StackGap
  className?: string
  as?: 'div' | 'section' | 'fieldset'
}

const gapClasses: Record<StackGap, string> = {
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
}

export function Stack({ children, gap = 'md', className = '', as: Tag = 'div' }: StackProps) {
  return <Tag className={`flex flex-col ${gapClasses[gap]} ${className}`.trim()}>{children}</Tag>
}
