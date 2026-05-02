'use client'

/**
 * @description
 * Three boolean / choice primitives sharing the EditFormField hook
 * + FieldShell chrome:
 * - <CheckboxField>: single boolean checkbox
 * - <ToggleField>: visual switch backed by a checkbox
 * - <RadioField>: exclusive option group, stores `string | null`
 *
 * @notes
 * - WCAG 2.2 §2.5.8 target size: every interactive control is ≥24×24px.
 * - Checkbox + Toggle store boolean. Radio stores the chosen option's
 *   `value` field (or null when none chosen).
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

const requiredBoolean: FieldValidator = (v) => (v === true ? null : 'Required')
const requiredString: FieldValidator = (v) =>
  typeof v === 'string' && v.length > 0 ? null : 'Required'

export type CheckboxFieldProps = FieldCommonProps & {
  /** Inline copy beside the checkbox (the "label" prop handles the field title). */
  caption?: string
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  caption,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    required ? requiredBoolean : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const checked = value === true

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
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          minHeight: 24,
          cursor: isReadOnly ? 'not-allowed' : 'pointer',
          color: isReadOnly ? 'var(--text-muted)' : 'var(--text-primary)',
        }}
      >
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          disabled={isReadOnly}
          onChange={(e) => setValue(e.target.checked)}
          style={{ width: 18, height: 18, cursor: isReadOnly ? 'not-allowed' : 'pointer' }}
        />
        {caption && <span style={{ fontSize: 13 }}>{caption}</span>}
      </label>
    </FieldShell>
  )
}

export type ToggleFieldProps = CheckboxFieldProps

export const ToggleField: React.FC<ToggleFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  caption,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    required ? requiredBoolean : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const checked = value === true

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
      <label
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          minHeight: 24,
          cursor: isReadOnly ? 'not-allowed' : 'pointer',
          color: isReadOnly ? 'var(--text-muted)' : 'var(--text-primary)',
        }}
      >
        <input
          id={name}
          name={name}
          type="checkbox"
          role="switch"
          checked={checked}
          aria-checked={checked}
          disabled={isReadOnly}
          onChange={(e) => setValue(e.target.checked)}
          style={{
            // Hide the native checkbox visually but keep it accessible.
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clipPath: 'inset(50%)',
            border: 0,
          }}
        />
        <span
          aria-hidden
          style={{
            position: 'relative',
            display: 'inline-block',
            width: 36,
            height: 20,
            background: checked ? 'var(--brand-fras)' : 'var(--surface-sunken)',
            borderRadius: 10,
            transition: 'background 100ms ease',
          }}
        >
          <span
            style={{
              position: 'absolute',
              top: 2,
              left: checked ? 18 : 2,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'var(--surface-page)',
              boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              transition: 'left 100ms ease',
            }}
          />
        </span>
        {caption && <span style={{ fontSize: 13 }}>{caption}</span>}
      </label>
    </FieldShell>
  )
}

export type RadioOption = {
  value: string
  label: string
}

export type RadioFieldProps = FieldCommonProps & {
  options: RadioOption[]
}

export const RadioField: React.FC<RadioFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  options,
}) => {
  const { value, error, dirty, setValue } = useEditFormField(
    name,
    required ? requiredString : undefined,
  )
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const selected = typeof value === 'string' ? value : null

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
      <div role="radiogroup" aria-labelledby={name}>
        {options.map((opt) => {
          const id = `${name}-${opt.value}`
          const checked = selected === opt.value
          return (
            <label
              key={opt.value}
              htmlFor={id}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginRight: 16,
                minHeight: 24,
                cursor: isReadOnly ? 'not-allowed' : 'pointer',
                color: isReadOnly ? 'var(--text-muted)' : 'var(--text-primary)',
              }}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                disabled={isReadOnly}
                onChange={() => setValue(opt.value)}
                style={{ width: 18, height: 18, cursor: isReadOnly ? 'not-allowed' : 'pointer' }}
              />
              <span style={{ fontSize: 13 }}>{opt.label}</span>
            </label>
          )
        })}
      </div>
    </FieldShell>
  )
}
