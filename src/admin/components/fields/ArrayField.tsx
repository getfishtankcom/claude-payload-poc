'use client'

/**
 * @description
 * <ArrayField> — repeater primitive with @dnd-kit drag-and-drop
 * reordering. Add / remove rows, optional per-row collapse/expand,
 * and a stable client-side row id so React keys + DnD targets stay
 * consistent across reorders.
 *
 * @notes
 * - Generic over the inner row schema. The caller supplies a
 *   `renderRow(item, index, setItem)` that draws the row's editor.
 * - Stores `T[]` in the form context. The component manages stable
 *   `_rowKey` ids internally via a parallel WeakMap so reorders keep
 *   React's reconciler happy without polluting the persisted shape.
 * - DnD ships keyboard-accessible by default (KeyboardSensor) so
 *   ↑↓ within a row's drag handle works.
 */

import * as React from 'react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { useEditFormField } from '../forms/EditFormProvider'
import { FieldShell } from './FieldShell'
import type { FieldCommonProps } from './field-types'

export type ArrayFieldProps<T> = FieldCommonProps & {
  /** Default row factory — invoked when the user clicks "+ Add". */
  newRow: () => T
  /** Renders a single row's editor. */
  renderRow: (item: T, index: number, setItem: (next: T) => void) => React.ReactNode
  /** Optional row title for the header strip. Falls back to `Row N`. */
  rowLabel?: (item: T, index: number) => string
  /** Default-collapsed rows when first rendered. */
  defaultCollapsed?: boolean
  /** Min/max row count for validation hints. */
  min?: number
  max?: number
}

type RowState<T> = {
  key: string
  item: T
  collapsed: boolean
}

let __key = 0
const nextKey = () => `row-${++__key}`

export function ArrayField<T>({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  newRow,
  renderRow,
  rowLabel,
  defaultCollapsed = false,
  min,
  max,
}: ArrayFieldProps<T>) {
  const isReadOnly = readOnly || lock === 'locked-by-other'

  const validator = React.useCallback(
    (v: unknown): string | null => {
      const arr = Array.isArray(v) ? v : []
      if (required && arr.length === 0) return 'At least one row required'
      if (typeof min === 'number' && arr.length < min) return `Need at least ${min} rows`
      if (typeof max === 'number' && arr.length > max) return `Maximum ${max} rows`
      return null
    },
    [required, min, max],
  )
  const { value, error, dirty, setValue } = useEditFormField(name, validator)

  // Internal mirror with stable row keys for DnD + React keys.
  const [rows, setRows] = React.useState<RowState<T>[]>(() =>
    (Array.isArray(value) ? (value as T[]) : []).map((item) => ({
      key: nextKey(),
      item,
      collapsed: defaultCollapsed,
    })),
  )

  // Re-sync when external value pointer changes (e.g. undo/reset).
  const lastValueRef = React.useRef(value)
  React.useEffect(() => {
    if (value === lastValueRef.current) return
    lastValueRef.current = value
    setRows(
      (Array.isArray(value) ? (value as T[]) : []).map((item) => ({
        key: nextKey(),
        item,
        collapsed: defaultCollapsed,
      })),
    )
  }, [value, defaultCollapsed])

  const commit = (next: RowState<T>[]) => {
    setRows(next)
    setValue(next.map((r) => r.item))
    lastValueRef.current = next.map((r) => r.item) as unknown as typeof value
  }

  const updateRow = (key: string, item: T) => {
    commit(rows.map((r) => (r.key === key ? { ...r, item } : r)))
  }

  const removeRow = (key: string) => {
    commit(rows.filter((r) => r.key !== key))
  }

  const addRow = () => {
    commit([...rows, { key: nextKey(), item: newRow(), collapsed: false }])
  }

  const toggleCollapse = (key: string) => {
    setRows((curr) => curr.map((r) => (r.key === key ? { ...r, collapsed: !r.collapsed } : r)))
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIdx = rows.findIndex((r) => r.key === active.id)
    const newIdx = rows.findIndex((r) => r.key === over.id)
    if (oldIdx < 0 || newIdx < 0) return
    commit(arrayMove(rows, oldIdx, newIdx))
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={rows.map((r) => r.key)}
          strategy={verticalListSortingStrategy}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {rows.length === 0 && (
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>(no rows)</div>
            )}
            {rows.map((row, index) => (
              <SortableRow
                key={row.key}
                id={row.key}
                index={index}
                title={rowLabel ? rowLabel(row.item, index) : `Row ${index + 1}`}
                collapsed={row.collapsed}
                disabled={isReadOnly}
                onToggleCollapse={() => toggleCollapse(row.key)}
                onRemove={() => removeRow(row.key)}
              >
                {!row.collapsed && renderRow(row.item, index, (next) => updateRow(row.key, next))}
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        disabled={isReadOnly || (typeof max === 'number' && rows.length >= max)}
        onClick={addRow}
        data-testid={`array-${name}-add`}
        style={{
          marginTop: 8,
          padding: '6px 10px',
          border: '1px dashed var(--border-strong)',
          borderRadius: 4,
          background: 'transparent',
          color: 'var(--text-secondary)',
          fontSize: 12,
          cursor: isReadOnly ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
        }}
      >
        + Add row
      </button>
    </FieldShell>
  )
}

const SortableRow: React.FC<{
  id: string
  index: number
  title: string
  collapsed: boolean
  disabled: boolean
  onToggleCollapse: () => void
  onRemove: () => void
  children: React.ReactNode
}> = ({ id, index, title, collapsed, disabled, onToggleCollapse, onRemove, children }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    disabled,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.6 : 1,
        border: '1px solid var(--border-default)',
        borderRadius: 4,
        background: 'var(--surface-page)',
      }}
      data-testid={`array-row-${index}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 8px',
          background: 'var(--surface-elevated)',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-default)',
        }}
      >
        <button
          type="button"
          aria-label={`Drag row ${index + 1}`}
          {...attributes}
          {...listeners}
          disabled={disabled}
          data-testid={`array-row-${index}-handle`}
          style={{
            cursor: disabled ? 'not-allowed' : 'grab',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontFamily: 'ui-monospace, monospace',
          }}
        >
          ⋮⋮
        </button>
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-expanded={!collapsed}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'ui-monospace, monospace',
            cursor: 'pointer',
          }}
        >
          {collapsed ? '▸' : '▾'}
        </button>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{title}</span>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          data-testid={`array-row-${index}-remove`}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--workflow-revision)',
            fontSize: 12,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Remove
        </button>
      </div>
      {!collapsed && <div style={{ padding: 10 }}>{children}</div>}
    </div>
  )
}
