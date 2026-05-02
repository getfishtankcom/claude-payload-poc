'use client'

/**
 * @description
 * <TextField> — single-line + multi-line text primitive. Reads value,
 * error, and dirty flag from the surrounding <EditFormProvider> via
 * `useEditFormField` and writes through `setValue`. Read-only when
 * locked by another user.
 *
 * @notes
 * - No `@payloadcms/ui` imports — pure custom field renderer per PRD
 *   decision Q4.
 * - Multi-line variant uses the same hook + props; switch with
 *   `multiline` (or `rows` > 1).
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type TextFieldProps = FieldCommonProps & {
  multiline?: boolean
  rows?: number
  placeholder?: string
  /** Optional validator override — falls back to a `required` validator. */
  validator?: FieldValidator
}

const requiredValidator: FieldValidator = (v) =>
  typeof v === 'string' && v.trim().length > 0 ? null : 'Required'

const inputBase: React.CSSProperties = {
  padding: '8px 10px',
  border: '1px solid var(--border-default)',
  borderRadius: 4,
  background: 'var(--surface-page)',
  color: 'var(--text-primary)',
  fontSize: 13,
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
}

export const TextField: React.FC<TextFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  multiline,
  rows = multiline ? 4 : 1,
  placeholder,
  validator,
}) => {
  const v = validator ?? (required ? requiredValidator : undefined)
  const { value, error, dirty, setValue } = useEditFormField(name, v)
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const stringValue = typeof value === 'string' ? value : value == null ? '' : String(value)

  const sharedProps = {
    id: name,
    name,
    value: stringValue,
    placeholder,
    readOnly: isReadOnly,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValue(e.target.value),
    style: {
      ...inputBase,
      borderColor: error ? 'var(--workflow-revision)' : 'var(--border-default)',
      background: isReadOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
      cursor: isReadOnly ? 'not-allowed' : 'text',
    },
  }

  return (
    <FieldShell
      name={name}
      label={label}
      description={description}
      required={required}
      lock={lock}
      error={error}
      dirty={dirty}
    >
      {multiline || rows > 1 ? (
        <textarea {...sharedProps} rows={rows} />
      ) : (
        <input {...sharedProps} type="text" />
      )}
    </FieldShell>
  )
}

export default TextField
