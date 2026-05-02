'use client'

/**
 * @description
 * <BlocksField> — Payload's "blocks" pattern reimplemented from
 * scratch. Each block is a typed row: a tagged value `{type, data}`
 * where `type` picks one of the registered block definitions and
 * `data` holds that block's fields.
 *
 * Authors:
 * - Click "+ Add" to open the block-type picker
 * - Each registered type provides its own renderer + default factory
 * - Reorder via DnD (composing the same @dnd-kit machinery as
 *   ArrayField, but specialized to typed rows)
 *
 * @notes
 * - Foundation for Page Builder body content. The visual page builder
 *   composes this same data shape but with a richer per-block surface.
 * - Composes other Layer 1 primitives only — no @payloadcms/ui.
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

export type BlockValue<TData = Record<string, unknown>> = {
  type: string
  data: TData
}

export type BlockDefinition<TData = Record<string, unknown>> = {
  /** Stable type identifier. */
  type: string
  /** Visible label shown in the block-type picker + row header. */
  label: string
  /** Factory for a default `data` payload when authors add this block. */
  defaults: () => TData
  /** Renderer for the block's editor UI. */
  render: (data: TData, setData: (next: TData) => void, index: number) => React.ReactNode
}

export type BlocksFieldProps = FieldCommonProps & {
  /** Registered block types this field accepts. */
  blocks: BlockDefinition[]
}

let __blockKey = 0
const nextKey = () => `block-${++__blockKey}`

type Row = {
  key: string
  block: BlockValue
}

export const BlocksField: React.FC<BlocksFieldProps> = ({
  name,
  label,
  description,
  required,
  lock = 'unlocked',
  readOnly,
  blocks,
}) => {
  const isReadOnly = readOnly || lock === 'locked-by-other'
  const validator = React.useCallback(
    (v: unknown): string | null =>
      required && (!Array.isArray(v) || v.length === 0)
        ? 'At least one block required'
        : null,
    [required],
  )
  const { value, error, dirty, setValue } = useEditFormField(name, validator)

  const [rows, setRows] = React.useState<Row[]>(() =>
    (Array.isArray(value) ? (value as BlockValue[]) : []).map((b) => ({
      key: nextKey(),
      block: b,
    })),
  )
  const lastValueRef = React.useRef(value)
  React.useEffect(() => {
    if (value === lastValueRef.current) return
    lastValueRef.current = value
    setRows(
      (Array.isArray(value) ? (value as BlockValue[]) : []).map((b) => ({
        key: nextKey(),
        block: b,
      })),
    )
  }, [value])

  const commit = (next: Row[]) => {
    setRows(next)
    const stripped = next.map((r) => r.block)
    setValue(stripped)
    lastValueRef.current = stripped as unknown as typeof value
  }

  const blocksByType = React.useMemo(() => {
    const map: Record<string, BlockDefinition> = {}
    for (const b of blocks) map[b.type] = b
    return map
  }, [blocks])

  const updateBlock = (key: string, data: Record<string, unknown>) => {
    commit(rows.map((r) => (r.key === key ? { ...r, block: { ...r.block, data } } : r)))
  }

  const removeBlock = (key: string) => {
    commit(rows.filter((r) => r.key !== key))
  }

  const addBlock = (def: BlockDefinition) => {
    commit([
      ...rows,
      { key: nextKey(), block: { type: def.type, data: def.defaults() } },
    ])
    setPickerOpen(false)
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

  const [pickerOpen, setPickerOpen] = React.useState(false)

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
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>(no blocks)</div>
            )}
            {rows.map((row, index) => {
              const def = blocksByType[row.block.type]
              return (
                <SortableBlockRow
                  key={row.key}
                  id={row.key}
                  index={index}
                  title={def ? def.label : `Unknown: ${row.block.type}`}
                  disabled={isReadOnly}
                  onRemove={() => removeBlock(row.key)}
                >
                  {def ? (
                    def.render(row.block.data, (next) => updateBlock(row.key, next), index)
                  ) : (
                    <span style={{ color: 'var(--workflow-revision)', fontSize: 12 }}>
                      Block type &quot;{row.block.type}&quot; is not registered.
                    </span>
                  )}
                </SortableBlockRow>
              )
            })}
          </div>
        </SortableContext>
      </DndContext>

      <div style={{ position: 'relative', marginTop: 8 }}>
        <button
          type="button"
          disabled={isReadOnly}
          onClick={() => setPickerOpen((o) => !o)}
          aria-expanded={pickerOpen}
          data-testid={`blocks-${name}-add`}
          style={{
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
          + Add block
        </button>
        {pickerOpen && (
          <div
            role="menu"
            data-testid={`blocks-${name}-picker`}
            style={{
              position: 'absolute',
              left: 0,
              top: '100%',
              marginTop: 4,
              zIndex: 10,
              background: 'var(--surface-page)',
              border: '1px solid var(--border-default)',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              minWidth: 200,
            }}
          >
            {blocks.map((def) => (
              <button
                key={def.type}
                type="button"
                role="menuitem"
                onClick={() => addBlock(def)}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '6px 10px',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: 13,
                  color: 'var(--text-primary)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {def.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </FieldShell>
  )
}

const SortableBlockRow: React.FC<{
  id: string
  index: number
  title: string
  disabled: boolean
  onRemove: () => void
  children: React.ReactNode
}> = ({ id, index, title, disabled, onRemove, children }) => {
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
      data-testid={`block-${index}`}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 8px',
          background: 'var(--surface-elevated)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <button
          type="button"
          aria-label={`Drag block ${index + 1}`}
          {...attributes}
          {...listeners}
          disabled={disabled}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontFamily: 'ui-monospace, monospace',
            cursor: disabled ? 'not-allowed' : 'grab',
          }}
        >
          ⋮⋮
        </button>
        <span style={{ fontSize: 13, fontWeight: 500, flex: 1 }}>{title}</span>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          data-testid={`block-${index}-remove`}
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
      <div style={{ padding: 10 }}>{children}</div>
    </div>
  )
}
