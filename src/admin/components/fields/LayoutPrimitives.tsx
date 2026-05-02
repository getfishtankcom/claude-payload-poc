'use client'

/**
 * @description
 * Three Payload-style layout container primitives. These don't bind
 * to form values themselves — they group child fields visually.
 *
 * - <TabsField>: tabbed grouping with controlled or uncontrolled state
 * - <GroupField>: collapsible group with header
 * - <RowField>: horizontal row layout for multi-field rows
 */

import * as React from 'react'

export type Tab = {
  id: string
  label: string
  content: React.ReactNode
}

export type TabsFieldProps = {
  tabs: Tab[]
  activeId?: string
  defaultActiveId?: string
  onChange?: (id: string) => void
  /** Identifier used for ARIA wiring. */
  ariaLabel?: string
}

export const TabsField: React.FC<TabsFieldProps> = ({
  tabs,
  activeId,
  defaultActiveId,
  onChange,
  ariaLabel = 'tabs',
}) => {
  const [internalActive, setInternalActive] = React.useState<string>(
    defaultActiveId ?? tabs[0]?.id ?? '',
  )
  const active = activeId ?? internalActive
  const handleClick = (id: string) => {
    if (activeId === undefined) setInternalActive(id)
    onChange?.(id)
  }

  return (
    <div data-tabs={ariaLabel}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        style={{
          display: 'flex',
          gap: 4,
          borderBottom: '1px solid var(--border-default)',
          marginBottom: 12,
        }}
      >
        {tabs.map((t) => {
          const selected = t.id === active
          return (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`tabpanel-${t.id}`}
              id={`tab-${t.id}`}
              onClick={() => handleClick(t.id)}
              style={{
                padding: '8px 12px',
                background: 'transparent',
                border: 'none',
                borderBottom: selected
                  ? '2px solid var(--brand-fras)'
                  : '2px solid transparent',
                color: selected ? 'var(--brand-fras)' : 'var(--text-secondary)',
                fontWeight: selected ? 600 : 500,
                fontSize: 13,
                fontFamily: 'inherit',
                cursor: 'pointer',
                marginBottom: -1,
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`tabpanel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
        >
          {t.id === active ? t.content : null}
        </div>
      ))}
    </div>
  )
}

export type GroupFieldProps = {
  label: string
  children: React.ReactNode
  defaultOpen?: boolean
  description?: string
}

export const GroupField: React.FC<GroupFieldProps> = ({
  label,
  children,
  defaultOpen = true,
  description,
}) => {
  const [open, setOpen] = React.useState(defaultOpen)
  return (
    <fieldset
      style={{
        margin: 0,
        padding: 0,
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        background: 'var(--surface-page)',
      }}
    >
      <legend style={{ padding: 0 }}>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 10px',
            background: 'var(--surface-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 4,
            color: 'var(--text-primary)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          <span aria-hidden style={{ fontFamily: 'ui-monospace, monospace' }}>
            {open ? '▾' : '▸'}
          </span>
          {label}
        </button>
      </legend>
      {open && (
        <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {description && (
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{description}</span>
          )}
          {children}
        </div>
      )}
    </fieldset>
  )
}

export type RowFieldProps = {
  children: React.ReactNode
  gap?: number
}

export const RowField: React.FC<RowFieldProps> = ({ children, gap = 12 }) => (
  <div
    style={{
      display: 'flex',
      gap,
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    }}
  >
    {React.Children.map(children, (child, i) => (
      <div key={i} style={{ flex: 1, minWidth: 180 }}>
        {child}
      </div>
    ))}
  </div>
)
