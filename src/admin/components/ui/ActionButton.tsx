/**
 * Shared admin action buttons.
 *
 * - InlineButton: small text button for table rows / item actions.
 * - BulkActionButton: button for bulk-action toolbars; supports an icon prefix.
 */
'use client'

import React from 'react'

export type ActionButtonVariant = 'default' | 'success' | 'warning' | 'primary' | 'danger'

const INLINE_BG: Record<ActionButtonVariant, string> = {
  default: 'var(--theme-elevation-100)',
  success: '#dcfce7',
  warning: '#fef3c7',
  primary: '#dbeafe',
  danger: '#fee2e2',
}

const INLINE_FG: Record<ActionButtonVariant, string> = {
  default: 'var(--theme-elevation-700)',
  success: '#166534',
  warning: '#92400e',
  primary: '#1e40af',
  danger: '#991b1b',
}

export function InlineButton({
  label,
  variant = 'default',
  onClick,
  disabled,
}: {
  label: string
  variant?: ActionButtonVariant
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onClick()
      }}
      disabled={disabled}
      style={{
        padding: '3px 8px',
        borderRadius: '3px',
        border: 'none',
        fontSize: '11px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: INLINE_BG[variant],
        color: INLINE_FG[variant],
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </button>
  )
}

const BULK_BG: Record<ActionButtonVariant, string> = {
  default: 'var(--theme-elevation-100)',
  success: '#22c55e',
  warning: '#f59e0b',
  primary: '#3b82f6',
  danger: '#ef4444',
}

export function BulkActionButton({
  label,
  variant = 'default',
  icon,
  onClick,
  disabled,
}: {
  label: string
  variant?: ActionButtonVariant
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '4px 10px',
        borderRadius: '4px',
        border: 'none',
        fontSize: '11px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: BULK_BG[variant],
        color: 'white',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {icon}
      {label}
    </button>
  )
}
