'use client'

/**
 * @description
 * <DateField> + <DateTimeField> — calendar / datetime primitives.
 * Uses native input types so authors get the OS-provided picker for
 * free; this is more accessible than a custom dropdown and cheaper
 * to maintain. Custom calendar UI can replace this internally later
 * without changing the public API.
 *
 * @notes
 * - Stores values as ISO 8601 strings (YYYY-MM-DD or full ISO) so the
 *   form context value round-trips cleanly to JSON.
 * - DateTime variant is timezone-aware: the stored value is full UTC
 *   ISO; the input renders local time via the value/format helpers.
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type DateFieldProps = FieldCommonProps & {
  min?: string
  max?: string
}

const required: FieldValidator = (v) =>
  typeof v === 'string' && v.length > 0 ? null : 'Required'

const inputStyle = (error: string | null, readOnly: boolean): React.CSSProperties => ({
  padding: '8px 10px',
  border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
  borderRadius: 4,
  background: readOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
  cursor: readOnly ? 'not-allowed' : 'text',
})

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  description,
  required: isRequired,
  lock = 'unlocked',
  readOnly,
  min,
  max,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    isRequired ? required : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const stringValue = typeof value === 'string' ? value : ''

  return (
    <FieldShell
      name={name}
      label={label}
      description={description}
      required={isRequired}
      lock={lock}
      error={error}
      dirty={dirty}
    >
      <input
        id={name}
        name={name}
        type="date"
        value={stringValue}
        readOnly={isReadOnly}
        min={min}
        max={max}
        onChange={(e) => setValue(e.target.value || null)}
        style={inputStyle(error, isReadOnly)}
      />
    </FieldShell>
  )
}

/**
 * Converts a stored UTC ISO string to the local-tz `datetime-local`
 * input format (YYYY-MM-DDTHH:MM). Exported for unit tests.
 */
export const isoToLocalInput = (iso: string): string => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

/**
 * Converts a `datetime-local` input value (assumed local time) to a
 * full UTC ISO string. Exported for unit tests.
 */
export const localInputToIso = (local: string): string | null => {
  if (!local) return null
  const d = new Date(local)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export const DateTimeField: React.FC<DateFieldProps> = ({
  name,
  label,
  description,
  required: isRequired,
  lock = 'unlocked',
  readOnly,
  min,
  max,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    isRequired ? required : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const localValue = typeof value === 'string' ? isoToLocalInput(value) : ''

  return (
    <FieldShell
      name={name}
      label={label}
      description={description}
      required={isRequired}
      lock={lock}
      error={error}
      dirty={dirty}
    >
      <input
        id={name}
        name={name}
        type="datetime-local"
        value={localValue}
        readOnly={isReadOnly}
        min={min}
        max={max}
        onChange={(e) => setValue(localInputToIso(e.target.value))}
        style={inputStyle(error, isReadOnly)}
      />
    </FieldShell>
  )
}
