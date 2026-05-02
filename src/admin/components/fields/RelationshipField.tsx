'use client'

/**
 * @description
 * <RelationshipField> — single + multi + tree-picker variants for
 * picking related records. Async loader contract is dependency-injected
 * so the same component drives REST-backed and tree-backed pickers.
 *
 * @notes
 * - Search debounces input by 250ms before invoking `loadOptions`.
 * - Tree-picker variant ignores the search box and walks an explicit
 *   `tree` prop. Selection still flows through `setValue`.
 * - `onCreate` is the create-on-the-fly hook; when set, an extra
 *   "+ Create" row appears below the result list.
 * - Ancestor breadcrumbs render via the option's `breadcrumb` field.
 */

import * as React from 'react'

import { useEditFormField, type FieldValidator } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type RelationshipOption = {
  id: string
  label: string
  /** Optional ancestor breadcrumb (e.g. "FRAS > Boards > AcSB"). */
  breadcrumb?: string
}

export type RelationshipTreeNode = RelationshipOption & {
  children?: RelationshipTreeNode[]
}

export type RelationshipFieldProps = FieldCommonProps & {
  /** Async loader keyed off the search query. Required for non-tree mode. */
  loadOptions?: (query: string) => Promise<RelationshipOption[]>
  /** Static tree to walk in tree-picker mode. */
  tree?: RelationshipTreeNode[]
  /** Multi-select toggle. Stores `string[]` instead of `string | null`. */
  multi?: boolean
  /** Create-on-the-fly callback — when set, exposes a "+ Create" row. */
  onCreate?: (label: string) => Promise<RelationshipOption>
  /** Resolver to render labels for already-stored ids. */
  resolveLabel?: (id: string) => Promise<RelationshipOption | null>
  placeholder?: string
}

const requiredSingle: FieldValidator = (v) => (v ? null : 'Required')
const requiredMulti: FieldValidator = (v) =>
  Array.isArray(v) && v.length > 0 ? null : 'Required'

const useDebouncedValue = <T,>(value: T, ms: number): T => {
  const [debounced, setDebounced] = React.useState(value)
  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])
  return debounced
}

export const RelationshipField: React.FC<RelationshipFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  loadOptions,
  tree,
  multi,
  onCreate,
  resolveLabel,
  placeholder = 'Search…',
}) => {
  const validator = required ? (multi ? requiredMulti : requiredSingle) : undefined
  const { value, error, dirty, setValue } = useEditFormField(name, validator)
  const isReadOnly = readOnly || lock === 'locked-by-other'

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState('')
  const debouncedQuery = useDebouncedValue(query, 250)
  const [options, setOptions] = React.useState<RelationshipOption[]>([])
  const [loading, setLoading] = React.useState(false)
  const [pickedLabels, setPickedLabels] = React.useState<Record<string, string>>({})

  // Load search results (non-tree mode).
  React.useEffect(() => {
    if (!loadOptions || tree) return
    let cancelled = false
    setLoading(true)
    loadOptions(debouncedQuery).then(
      (opts) => {
        if (cancelled) return
        setOptions(opts)
        setLoading(false)
      },
      () => {
        if (cancelled) return
        setLoading(false)
      },
    )
    return () => {
      cancelled = true
    }
  }, [debouncedQuery, loadOptions, tree])

  // Resolve labels for stored ids so the trigger summary makes sense.
  React.useEffect(() => {
    if (!resolveLabel) return
    const ids = Array.isArray(value) ? value : value ? [value] : []
    ;(ids as string[]).forEach((id) => {
      if (pickedLabels[id]) return
      resolveLabel(id).then((opt) => {
        if (opt) setPickedLabels((m) => ({ ...m, [id]: opt.label }))
      })
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, resolveLabel])

  const isPicked = (id: string): boolean => {
    if (multi) return Array.isArray(value) && (value as string[]).includes(id)
    return value === id
  }

  const togglePick = (opt: RelationshipOption) => {
    setPickedLabels((m) => ({ ...m, [opt.id]: opt.label }))
    if (multi) {
      const cur = Array.isArray(value) ? (value as string[]) : []
      setValue(cur.includes(opt.id) ? cur.filter((v) => v !== opt.id) : [...cur, opt.id])
    } else {
      setValue(opt.id)
      setOpen(false)
    }
  }

  const handleCreate = async () => {
    if (!onCreate || !query) return
    const created = await onCreate(query)
    togglePick(created)
    setQuery('')
  }

  const summary = React.useMemo(() => {
    const ids = Array.isArray(value) ? value : value ? [value as string] : []
    if (ids.length === 0) return placeholder
    return ids.map((id) => pickedLabels[id] ?? id).join(', ')
  }, [value, pickedLabels, placeholder])

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
      <div style={{ position: 'relative' }}>
        <button
          id={name}
          type="button"
          disabled={isReadOnly}
          aria-expanded={open}
          aria-haspopup="listbox"
          data-testid={`rel-${name}-trigger`}
          onClick={() => setOpen((o) => !o)}
          style={{
            width: '100%',
            padding: '8px 10px',
            textAlign: 'left',
            border: `1px solid ${error ? 'var(--workflow-revision)' : 'var(--border-default)'}`,
            borderRadius: 4,
            background: isReadOnly ? 'var(--surface-sunken)' : 'var(--surface-page)',
            color:
              !value || (Array.isArray(value) && value.length === 0)
                ? 'var(--text-muted)'
                : 'var(--text-primary)',
            fontSize: 13,
            fontFamily: 'inherit',
            cursor: isReadOnly ? 'not-allowed' : 'pointer',
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
              maxHeight: 280,
              overflow: 'auto',
            }}
          >
            {!tree && (
              <input
                type="search"
                placeholder="Search…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                data-testid={`rel-${name}-search`}
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
            )}

            {tree ? (
              <TreePicker
                tree={tree}
                isPicked={isPicked}
                onPick={togglePick}
                depth={0}
              />
            ) : loading ? (
              <div style={{ padding: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                Loading…
              </div>
            ) : options.length === 0 ? (
              <div style={{ padding: 8, color: 'var(--text-muted)', fontSize: 12 }}>
                No results
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  role="option"
                  aria-selected={isPicked(opt.id)}
                  onClick={() => togglePick(opt)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '6px 10px',
                    border: 'none',
                    background: isPicked(opt.id) ? 'var(--surface-sunken)' : 'transparent',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontFamily: 'inherit',
                  }}
                >
                  <div>{opt.label}</div>
                  {opt.breadcrumb && (
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {opt.breadcrumb}
                    </div>
                  )}
                </button>
              ))
            )}

            {onCreate && query && (
              <button
                type="button"
                onClick={() => void handleCreate()}
                data-testid={`rel-${name}-create`}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '6px 10px',
                  border: 'none',
                  borderTop: '1px solid var(--border-default)',
                  background: 'transparent',
                  color: 'var(--brand-fras)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: 'inherit',
                }}
              >
                + Create &quot;{query}&quot;
              </button>
            )}
          </div>
        )}
      </div>
    </FieldShell>
  )
}

const TreePicker: React.FC<{
  tree: RelationshipTreeNode[]
  isPicked: (id: string) => boolean
  onPick: (opt: RelationshipOption) => void
  depth: number
}> = ({ tree, isPicked, onPick, depth }) => (
  <>
    {tree.map((node) => {
      const picked = isPicked(node.id)
      return (
        <React.Fragment key={node.id}>
          <button
            type="button"
            role="option"
            aria-selected={picked}
            onClick={() => onPick(node)}
            style={{
              display: 'block',
              width: '100%',
              textAlign: 'left',
              padding: `4px 10px 4px ${10 + depth * 14}px`,
              border: 'none',
              background: picked ? 'var(--surface-sunken)' : 'transparent',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'inherit',
            }}
          >
            {node.label}
          </button>
          {node.children && node.children.length > 0 && (
            <TreePicker
              tree={node.children}
              isPicked={isPicked}
              onPick={onPick}
              depth={depth + 1}
            />
          )}
        </React.Fragment>
      )
    })}
  </>
)

export default RelationshipField
