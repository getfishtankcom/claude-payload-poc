'use client'

/**
 * @description
 * <NumberField> — int + decimal numeric primitive with min/max
 * validation. Mirrors <TextField>'s API for substitutability from a
 * config-driven renderer.
 *
 * @notes
 * - Stores values as `number` (or null when empty) in the form
 *   context. Empty input → null so distinguishing "not entered" from
 *   "entered zero" is possible.
 * - `mode="int"` rejects fractional values via the validator and uses
 *   `step="1"` on the underlying input.
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type NumberFieldMode = 'int' | 'decimal'

export type NumberFieldProps = FieldCommonProps & {
  mode?: NumberFieldMode
  min?: number
  max?: number
  step?: number
  placeholder?: string
}

const buildValidator = (
  required: boolean | undefined,
  mode: NumberFieldMode,
  min?: number,
  max?: number,
): FieldValidator => {
  return (value: unknown): string | null => {
    if (value === null || value === undefined || value === '') {
      return required ? 'Required' : null
    }
    const num = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(num)) return 'Must be a number'
    if (mode === 'int' && !Number.isInteger(num)) return 'Must be a whole number'
    if (typeof min === 'number' && num < min) return `Must be ≥ ${min}`
    if (typeof max === 'number' && num > max) return `Must be ≤ ${max}`
    return null
  }
}

export const NumberField: React.FC<NumberFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  mode = 'decimal',
  min,
  max,
  step,
  placeholder,
}) => {
  const validator = React.useMemo(
    () => buildValidator(required, mode, min, max),
    [required, mode, min, max],
  )
  const { value, error, dirty, setValue } = useEditFormField(name, validator)
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const stringValue =
    typeof value === 'number' ? String(value) : value == null ? '' : String(value)

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
      <input
        id={name}
        name={name}
        type="number"
        inputMode={mode === 'int' ? 'numeric' : 'decimal'}
        step={step ?? (mode === 'int' ? 1 : 'any')}
        min={min}
        max={max}
        placeholder={placeholder}
        readOnly={isReadOnly}
        value={stringValue}
        onChange={(e) => {
          const raw = e.target.value
          if (raw === '') {
            setValue(null)
            return
          }
          const num = Number(raw)
          setValue(Number.isNaN(num) ? raw : num)
        }}
        style={{
          padding: '8px 10px',
          border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
          borderRadius: 4,
          background: isReadOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
          color: 'var(--text-primary)',
          fontSize: 13,
          fontFamily: 'inherit',
          width: '100%',
          boxSizing: 'border-box',
          cursor: isReadOnly ? 'not-allowed' : 'text',
        }}
      />
    </FieldShell>
  )
}

export default NumberField
