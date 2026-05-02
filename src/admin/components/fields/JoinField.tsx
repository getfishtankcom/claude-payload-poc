'use client'

/**
 * @description
 * <JoinField> — read-only display of joined relations
 * (e.g. "Pages that reference this Project"). Renders a clickable
 * list with each joined record's label + breadcrumb. Click-through
 * navigates to the related edit view.
 *
 * @notes
 * - Always read-only by design. Lock state still shows a badge so
 *   authors understand why this section's owner record is read-only.
 * - Loader is dependency-injected. Empty state renders a small
 *   "No related records" hint.
 */

import * as React from 'react'

import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type JoinedItem = {
  id: string
  label: string
  breadcrumb?: string
  /** Resolved href to the related record's edit view. */
  href: string
}

export type JoinFieldProps = FieldCommonProps & {
  loadJoined: () => Promise<JoinedItem[]>
}

export const JoinField: React.FC<JoinFieldProps> = ({
  name,
  label,
  description,
  lock = 'unlocked',
  loadJoined,
}) => {
  const [items, setItems] = React.useState<JoinedItem[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    loadJoined().then(
      (rows) => {
        if (!cancelled) setItems(rows)
      },
      (err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err))
      },
    )
    return () => {
      cancelled = true
    }
  }, [loadJoined])

  return (
    <FieldShell
      name={name}
      label={label}
      description={description}
      lock={lock}
      error={error}
    >
      <div
        data-testid={`join-${name}`}
        style={{
          padding: 8,
          border: '1px solid var(--border-default)',
          borderRadius: 4,
          background: 'var(--surface-sunken)',
        }}
      >
        {items === null ? (
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>Loading…</span>
        ) : items.length === 0 ? (
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>No related records</span>
        ) : (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {items.map((item) => (
              <li key={item.id} style={{ padding: '4px 0' }}>
                <a
                  href={item.href}
                  style={{
                    color: 'var(--brand-fras)',
                    textDecoration: 'none',
                    fontSize: 13,
                  }}
                >
                  {item.label}
                </a>
                {item.breadcrumb && (
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                    {item.breadcrumb}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </FieldShell>
  )
}

export default JoinField
