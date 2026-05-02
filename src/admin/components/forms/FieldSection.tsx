'use client'

/**
 * @description
 * <FieldSection> — collapsible field grouping that mirrors the
 * Sitecore Content / SEO / Layout / Workflow template groupings.
 * No "Standard Fields hidden" toggle: every section starts visible
 * because the PRD explicitly rejects that pattern.
 *
 * Composes <SharedFieldBadge> + <LockBadge> indicators inline so
 * authors can scan a section's localization and lock posture at a
 * glance.
 */

import * as React from 'react'

export type FieldSectionProps = {
  /** Section title (e.g. "Content", "SEO", "Layout"). */
  title: string
  /** Optional one-line description below the title. */
  description?: string
  /** Whether the section is collapsed by default. */
  defaultCollapsed?: boolean
  /** Marks the entire section as "shared" — no per-field localization. */
  shared?: boolean
  /** Marks the entire section as locked by another user. */
  locked?: boolean
  children: React.ReactNode
}

export const FieldSection: React.FC<FieldSectionProps> = ({
  title,
  description,
  defaultCollapsed = false,
  shared,
  locked,
  children,
}) => {
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  return (
    <section
      data-field-section={title}
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        background: 'var(--surface-page)',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '8px 12px',
          background: 'var(--surface-elevated)',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-default)',
          borderTopLeftRadius: 6,
          borderTopRightRadius: 6,
        }}
      >
        <button
          type="button"
          aria-expanded={!collapsed}
          aria-controls={`section-${title}`}
          onClick={() => setCollapsed((c) => !c)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'transparent',
            border: 'none',
            padding: 0,
            color: 'var(--text-primary)',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <span aria-hidden style={{ fontFamily: 'ui-monospace, monospace' }}>
            {collapsed ? '▸' : '▾'}
          </span>
          {title}
        </button>
        {shared && <SharedFieldBadge />}
        {locked && <LockBadge />}
        <div style={{ flex: 1 }} />
      </header>
      {description && !collapsed && (
        <div
          style={{
            padding: '6px 12px',
            color: 'var(--text-muted)',
            fontSize: 12,
            borderBottom: '1px solid var(--border-default)',
          }}
        >
          {description}
        </div>
      )}
      <div
        id={`section-${title}`}
        hidden={collapsed}
        style={{
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {children}
      </div>
    </section>
  )
}

export const SharedFieldBadge: React.FC = () => (
  <span
    aria-label="Shared across locales — not localized"
    title="Shared across locales — not localized"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '1px 6px',
      borderRadius: 10,
      background: 'var(--surface-sunken)',
      color: 'var(--text-secondary)',
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}
  >
    Shared
  </span>
)

export const LockBadge: React.FC = () => (
  <span
    aria-label="Locked by another user"
    title="Locked by another user"
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '1px 6px',
      borderRadius: 10,
      background: 'var(--lock-locked-bg)',
      color: 'var(--lock-locked)',
      fontSize: 10,
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}
  >
    Locked
  </span>
)
