'use client'

/**
 * @description
 * Common chrome for every Layer 1 field primitive: label, required
 * indicator, description, error surface, lock badge. Composing this
 * once keeps every primitive's markup consistent without each having
 * to roll its own.
 */

import * as React from 'react'

import type { FieldCommonProps } from './field-types'

export type FieldShellProps = FieldCommonProps & {
  error?: string | null
  dirty?: boolean
  children: React.ReactNode
}

export const FieldShell: React.FC<FieldShellProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  error,
  dirty,
  children,
}) => (
  <div
    data-field={name}
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontSize: 13,
      color: 'var(--text-primary)',
    }}
  >
    {label && (
      <label htmlFor={name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
        <span>
          {label}
          {required ? <span style={{ color: 'var(--workflow-revision)' }}> *</span> : null}
        </span>
        {dirty && (
          <em
            style={{
              color: 'var(--workflow-review)',
              fontSize: 11,
              fontStyle: 'normal',
              fontWeight: 400,
            }}
          >
            modified
          </em>
        )}
        {lock === 'locked-by-other' && (
          <em
            style={{
              color: 'var(--lock-locked)',
              fontSize: 11,
              fontStyle: 'normal',
              fontWeight: 400,
            }}
          >
            locked
          </em>
        )}
      </label>
    )}
    {children}
    {description && !error && (
      <span style={{ color: 'var(--text-muted)', fontSize: 11 }}>{description}</span>
    )}
    {error && (
      <span style={{ color: 'var(--workflow-revision)', fontSize: 11 }} data-field-error={name}>
        {error}
      </span>
    )}
  </div>
)
