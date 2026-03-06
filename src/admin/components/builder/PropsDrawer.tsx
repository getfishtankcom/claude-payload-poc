/**
 * @description
 * Props Drawer — right panel of the page builder (slides out).
 * Renders form fields based on the selected component's propsSchema.
 * Apply saves changes back to the layout JSON; Cancel reverts.
 *
 * Key features:
 * - Slides out (300px) when a component is selected via gear icon
 * - Renders field types: text, textarea, number, select, checkbox, array
 * - Data source toggle for data-driven widgets (Manual vs Dynamic)
 * - Apply commits changes, Cancel reverts to original props
 * - Close button dismisses the drawer
 *
 * @dependencies
 * - registry: getComponentType, PropsSchema, PropField
 * - templates/types: ComponentInstance
 *
 * @notes
 * - data-testid="props-drawer" on drawer container
 * - data-testid="props-apply" on Apply button
 * - Rich text and media fields render simplified inputs (full Lexical/media picker
 *   integration deferred to when those are wired to the builder iframe)
 * - Array fields support add/remove items with nested field rendering
 */
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type { ComponentInstance } from '../../templates/types'
import { getComponentType, type PropField } from './registry'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface PropsDrawerProps {
  component: ComponentInstance
  zone: string
  onApply: (props: Record<string, unknown>) => void
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Field renderers
// ---------------------------------------------------------------------------

interface FieldRendererProps {
  field: PropField
  value: unknown
  onChange: (value: unknown) => void
}

function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
  switch (field.type) {
    case 'text':
      return (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder={field.description}
        />
      )

    case 'textarea':
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y"
          placeholder={field.description}
        />
      )

    case 'number':
      return (
        <input
          type="number"
          value={(value as number) ?? field.defaultValue ?? ''}
          onChange={(e) => onChange(Number(e.target.value))}
          min={field.min}
          max={field.max}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      )

    case 'select':
      return (
        <select
          value={(value as string) ?? field.defaultValue ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )

    case 'checkbox':
      return (
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(value as boolean) ?? field.defaultValue ?? false}
            onChange={(e) => onChange(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-400"
          />
          <span className="text-sm text-gray-600">{field.description ?? 'Enabled'}</span>
        </label>
      )

    case 'richtext':
      // Simplified rich text input — full Lexical editor integration later
      return (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400 resize-y font-mono"
          placeholder="Rich text content..."
        />
      )

    case 'media':
      // Simplified media picker — shows current value, click to change
      return (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
            placeholder="Media ID or URL"
          />
          <span className="text-xs text-gray-400">📎</span>
        </div>
      )

    case 'relationship':
      // Simplified relationship field — text input for ID
      return (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          placeholder={`${field.relationTo ?? 'Related'} ID`}
        />
      )

    case 'color':
      return (
        <input
          type="color"
          value={(value as string) ?? '#000000'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
        />
      )

    case 'array':
      return <ArrayFieldRenderer field={field} value={value as unknown[]} onChange={onChange} />

    default:
      return (
        <input
          type="text"
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
      )
  }
}

// ---------------------------------------------------------------------------
// Array field renderer
// ---------------------------------------------------------------------------

interface ArrayFieldRendererProps {
  field: PropField
  value: unknown[] | undefined
  onChange: (value: unknown) => void
}

function ArrayFieldRenderer({ field, value, onChange }: ArrayFieldRendererProps) {
  const items = (value ?? []) as Record<string, unknown>[]

  const addItem = () => {
    const newItem: Record<string, unknown> = {}
    for (const subField of field.fields ?? []) {
      if (subField.defaultValue !== undefined) {
        newItem[subField.name] = subField.defaultValue
      }
    }
    onChange([...items, newItem])
  }

  const removeItem = (index: number) => {
    const next = [...items]
    next.splice(index, 1)
    onChange(next)
  }

  const updateItem = (index: number, key: string, val: unknown) => {
    const next = [...items]
    next[index] = { ...next[index], [key]: val }
    onChange(next)
  }

  return (
    <div className="space-y-2">
      {items.map((item, idx) => (
        <div key={idx} className="p-2 border border-gray-200 rounded bg-gray-50">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-500">
              Item {idx + 1}
            </span>
            <button
              onClick={() => removeItem(idx)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Remove
            </button>
          </div>
          {(field.fields ?? []).map((subField) => (
            <div key={subField.name} className="mb-1.5">
              <label className="block text-xs text-gray-500 mb-0.5">{subField.label}</label>
              <FieldRenderer
                field={subField}
                value={item[subField.name]}
                onChange={(val) => updateItem(idx, subField.name, val)}
              />
            </div>
          ))}
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full py-1.5 text-xs text-blue-500 border border-dashed border-blue-300 rounded hover:bg-blue-50"
      >
        + Add {field.label?.replace(/s$/, '') ?? 'Item'}
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PropsDrawer
// ---------------------------------------------------------------------------

export function PropsDrawer({ component, zone, onApply, onClose }: PropsDrawerProps) {
  const compDef = getComponentType(component.type)
  const [editedProps, setEditedProps] = useState<Record<string, unknown>>({ ...component.props })

  // Reset edited props when component changes
  useEffect(() => {
    setEditedProps({ ...component.props })
  }, [component.id, component.props])

  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    setEditedProps((prev) => ({ ...prev, [fieldName]: value }))
  }, [])

  const handleApply = () => {
    onApply(editedProps)
    onClose()
  }

  const handleCancel = () => {
    onClose()
  }

  if (!compDef) {
    return (
      <div
        data-testid="props-drawer"
        className="w-[300px] flex-shrink-0 bg-white border-l border-gray-200 p-4"
      >
        <div className="text-sm text-red-500">Unknown component type: {component.type}</div>
      </div>
    )
  }

  return (
    <div
      data-testid="props-drawer"
      className="w-[300px] flex-shrink-0 bg-white border-l border-gray-200 overflow-y-auto"
      style={{ animation: 'slideInRight 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-sm font-semibold text-gray-700">{compDef.label}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Fields */}
      <div className="p-4 space-y-4">
        {compDef.propsSchema.map((field) => (
          <div key={field.name}>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              {field.label}
              {field.required && <span className="text-red-400 ml-0.5">*</span>}
            </label>
            {field.description && field.type !== 'checkbox' && (
              <p className="text-xs text-gray-400 mb-1">{field.description}</p>
            )}
            <FieldRenderer
              field={field}
              value={editedProps[field.name]}
              onChange={(val) => handleFieldChange(field.name, val)}
            />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="sticky bottom-0 flex gap-2 px-4 py-3 border-t border-gray-200 bg-white">
        <button
          data-testid="props-apply"
          onClick={handleApply}
          className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Apply
        </button>
        <button
          onClick={handleCancel}
          className="flex-1 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
