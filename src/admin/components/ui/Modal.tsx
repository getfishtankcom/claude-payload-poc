/**
 * Shared admin Modal primitives.
 *
 * - ModalOverlay: full-screen backdrop. Closes on Escape and backdrop click.
 * - ModalButton: small inline button used in modal footers.
 *
 * Accessibility: role="dialog", aria-modal="true". Pressing Escape calls onClose.
 */
'use client'

import React, { useEffect, useRef } from 'react'

export type ModalButtonVariant = 'primary' | 'danger' | 'ghost' | 'warning' | 'default'

export function ModalOverlay({
  children,
  onClose,
  ariaLabel,
}: {
  children: React.ReactNode
  onClose: () => void
  ariaLabel?: string
}) {
  const dialogRef = useRef<HTMLDivElement>(null)

  // Escape to close.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Focus the dialog on mount.
  useEffect(() => {
    dialogRef.current?.focus()
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--theme-elevation-0)',
          borderRadius: '8px',
          padding: '24px',
          width: '480px',
          maxWidth: '90vw',
          maxHeight: '80vh',
          overflow: 'auto',
          outline: 'none',
        }}
      >
        {children}
      </div>
    </div>
  )
}

const MODAL_BUTTON_BG: Record<ModalButtonVariant, string> = {
  primary: '#3b82f6',
  danger: '#ef4444',
  ghost: 'transparent',
  warning: '#f59e0b',
  default: 'var(--theme-elevation-100)',
}

const MODAL_BUTTON_FG: Record<ModalButtonVariant, string> = {
  primary: 'white',
  danger: 'white',
  ghost: 'var(--theme-elevation-700)',
  warning: 'white',
  default: 'var(--theme-elevation-800)',
}

export function ModalButton({
  label,
  variant = 'default',
  onClick,
  disabled,
}: {
  label: string
  variant?: ModalButtonVariant
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 14px',
        borderRadius: '4px',
        border: variant === 'ghost' ? '1px solid var(--theme-elevation-200)' : 'none',
        fontSize: '13px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: MODAL_BUTTON_BG[variant],
        color: MODAL_BUTTON_FG[variant],
      }}
    >
      {label}
    </button>
  )
}
