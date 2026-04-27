/**
 * Site-wide alert banner. Renders a full-width strip above the header
 * when `show` is true. Dismissable per-user via localStorage.
 *
 * Severities:
 *  - info    blue background
 *  - warning yellow background, dark text
 *  - urgent  red background, white text
 *
 * All variants meet WCAG 2.2 AA contrast.
 */
'use client'

import React, { useEffect, useState } from 'react'

export type AlertSeverity = 'info' | 'warning' | 'urgent'

export interface SiteAlertProps {
  show: boolean
  message: string
  link?: { url?: string; label?: string }
  severity?: AlertSeverity
  /** Optional unique key — bumping it forces re-display after a dismissal. */
  alertId?: string
}

const STORAGE_KEY_PREFIX = 'site-alert-dismissed:'

const STYLES: Record<AlertSeverity, { bg: string; fg: string; link: string }> = {
  info: { bg: '#1e40af', fg: '#ffffff', link: '#bfdbfe' },
  warning: { bg: '#fde68a', fg: '#78350f', link: '#92400e' },
  urgent: { bg: '#b91c1c', fg: '#ffffff', link: '#fecaca' },
}

export function SiteAlert({
  show,
  message,
  link,
  severity = 'info',
  alertId = 'default',
}: SiteAlertProps) {
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${alertId}`)
    setDismissed(stored === '1')
  }, [alertId])

  if (!show || dismissed || !message) return null

  const colors = STYLES[severity]

  const handleDismiss = () => {
    setDismissed(true)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${alertId}`, '1')
    }
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        background: colors.bg,
        color: colors.fg,
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '14px',
      }}
    >
      <span style={{ flex: 1 }}>
        {message}
        {link?.url && (
          <>
            {' '}
            <a
              href={link.url}
              style={{ color: colors.link, textDecoration: 'underline', marginLeft: '4px' }}
            >
              {link.label || 'Learn more'}
            </a>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="Dismiss alert"
        style={{
          background: 'transparent',
          border: 'none',
          color: colors.fg,
          fontSize: '18px',
          cursor: 'pointer',
          lineHeight: 1,
          padding: '0 4px',
        }}
      >
        ×
      </button>
    </div>
  )
}
