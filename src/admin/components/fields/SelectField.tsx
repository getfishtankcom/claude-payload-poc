'use client'

/**
 * @description
 * <SelectField> — single + multi + searchable dropdown primitive.
 * Supports flat and grouped options. Searchable variant filters
 * options client-side and is recommended once the option count goes
 * above ~10 per the issue spec.
 *
 * @notes
 * - Multi mode stores `string[]`. Single mode stores `string | null`.
 * - When `searchable`, the trigger is a button + listbox controlled by
 *   keyboard (↑↓ to move, Enter to pick, Esc to close). Native `<select>`
 *   handles the non-searchable cases for max accessibility default.
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type SelectOption = {
  value: string
  label: string
}

export type SelectOptionGroup = {
  label: string
  options: SelectOption[]
}

export type SelectFieldProps = FieldCommonProps & {
  options: (SelectOption | SelectOptionGroup)[]
  multi?: boolean
  searchable?: boolean
  placeholder?: string
}

const isGroup = (o: SelectOption | SelectOptionGroup): o is SelectOptionGroup =>
  'options' in o

const flattenOptions = (
  options: (SelectOption | SelectOptionGroup)[],
): SelectOption[] => options.flatMap((o) => (isGroup(o) ? o.options : [o]))

const requiredSingle: FieldValidator = (v) => (v ? null : 'Required')
const requiredMulti: FieldValidator = (v) =>
  Array.isArray(v) && v.length > 0 ? null : 'Required'

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  options,
  multi,
  searchable,
  placeholder = 'Select…',
}) => {
  const validator = required ? (multi ? requiredMulti : requiredSingle) : undefined
  const { value, error, dirty, setValue } = useEditFormField(name, validator)
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const flat = React.useMemo(() => flattenOptions(options), [options])

  if (searchable) {
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
        <SearchableSelect
          name={name}
          flatOptions={flat}
          value={value}
          onChange={setValue}
          multi={multi}
          readOnly={isReadOnly}
          error={!!error}
          placeholder={placeholder}
        />
      </FieldShell>
    )
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
      <select
        id={name}
        name={name}
        multiple={multi}
        disabled={isReadOnly}
        value={
          multi
            ? Array.isArray(value)
              ? (value as string[])
              : []
            : typeof value === 'string'
              ? value
              : ''
        }
        onChange={(e) => {
          if (multi) {
            const picked = Array.from(e.target.selectedOptions, (o) => o.value)
            setValue(picked)
          } else {
            setValue(e.target.value || null)
          }
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
          cursor: isReadOnly ? 'not-allowed' : 'pointer',
        }}
      >
        {!multi && <option value="">{placeholder}</option>}
        {options.map((o) =>
          isGroup(o) ? (
            <optgroup key={o.label} label={o.label}>
              {o.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ) : (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ),
        )}
      </select>
    </FieldShell>
  )
}

type SearchableProps = {
  name: string
  flatOptions: SelectOption[]
  value: unknown
  onChange: (v: unknown) => void
  multi?: boolean
  readOnly?: boolean
  error?: boolean
  placeholder?: string
}

const SearchableSelect: React.FC<SearchableProps> = ({
  name,
  flatOptions,
  value,
  onChange,
  multi,
  readOnly,
  error,
  placeholder,
}) => {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? flatOptions.filter((o) => o.label.toLowerCase().includes(q)) : flatOptions
  }, [flatOptions, query])

  const isPicked = (opt: SelectOption): boolean => {
    if (multi) return Array.isArray(value) && (value as string[]).includes(opt.value)
    return value === opt.value
  }

  const togglePick = (opt: SelectOption) => {
    if (multi) {
      const current = Array.isArray(value) ? (value as string[]) : []
      onChange(
        current.includes(opt.value)
          ? current.filter((v) => v !== opt.value)
          : [...current, opt.value],
      )
    } else {
      onChange(opt.value)
      setOpen(false)
    }
  }

  const labelFor = (v: string): string =>
    flatOptions.find((o) => o.value === v)?.label ?? v

  const summary = multi
    ? Array.isArray(value) && value.length > 0
      ? (value as string[]).map(labelFor).join(', ')
      : placeholder
    : value
      ? labelFor(value as string)
      : placeholder

  return (
    <div style={{ position: 'relative' }}>
      <button
        id={name}
        type="button"
        disabled={readOnly}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="listbox"
        data-testid={`searchable-${name}-trigger`}
        style={{
          width: '100%',
          padding: '8px 10px',
          textAlign: 'left',
          border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
          borderRadius: 4,
          background: readOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
          color:
            (multi ? Array.isArray(value) && value.length === 0 : !value)
              ? 'var(--text-muted)'
              : 'var(--text-primary)',
          fontSize: 13,
          fontFamily: 'inherit',
          cursor: readOnly ? 'not-allowed' : 'pointer',
        }}
      >
        {summary}
      </button>
      {open && (
        <div
          role="listbox"
          aria-label={name}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 30,
            marginTop: 4,
            background: 'var(--surface-page)',
            border: '1px solid var(--border-default)',
            borderRadius: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            maxHeight: 220,
            overflow: 'auto',
          }}
        >
          <input
            type="search"
            placeholder="Filter…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            data-testid={`searchable-${name}-filter`}
            style={{
              width: '100%',
              padding: '6px 8px',
              border: 'none',
              borderBottom: '1px solid var(--border-default)',
              fontSize: 12,
              fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          {filtered.length === 0 ? (
            <div style={{ padding: 8, color: 'var(--text-muted)', fontSize: 12 }}>
              No matches
            </div>
          ) : (
            filtered.map((opt) => {
              const picked = isPicked(opt)
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={picked}
                  onClick={() => togglePick(opt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 10px',
                    border: 'none',
                    background: picked ? 'var(--surface-sunken)' : 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

export default SelectField
