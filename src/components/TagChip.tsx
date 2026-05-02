/**
 * @description
 * Pill-style chip component for search tags and filters.
 * Used in SearchModal for recent/popular tags and in filter UIs.
 *
 * Renders as <button> when onClick is provided (interactive),
 * <span> when no onClick (display-only).
 *
 * @dependencies
 * - Design tokens from globals.css: --color-primary, --color-gray-*
 *
 * @notes
 * - Active state: filled primary bg with white text
 * - Default state: light gray bg with dark text
 * - Cursor automatically set to pointer when interactive
 */
import React from 'react'

type TagChipProps = {
  /** Tag label text */
  label: string
  /** Click handler — when provided, renders as <button> */
  onClick?: () => void
  /** Whether the chip is in active/selected state */
  active?: boolean
  className?: string
}

export function TagChip({ label, onClick, active = false, className = '' }: TagChipProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-150'

  const stateClasses = active
    ? 'bg-primary text-white'
    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'

  const classes = `${baseClasses} ${stateClasses} ${className}`.trim()

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`${classes} cursor-pointer`}
        data-testid={`tag-chip-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {label}
      </button>
    )
  }

  return (
    <span className={classes} data-testid={`tag-chip-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      {label}
    </span>
  )
}
