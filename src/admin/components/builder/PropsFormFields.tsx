/**
 * @description
 * Shared form field renderers for the page builder props editing.
 * Extracted from PropsDrawer to be reused by both the legacy PropsDrawer
 * and the new InspectorPanel.
 *
 * Key features:
 * - FieldRenderer: renders a single prop field based on its type
 * - ArrayFieldRenderer: renders array fields with add/remove/edit items
 * - Supports: text, textarea, number, select, checkbox, richtext, media,
 *   relationship, color, array types
 *
 * @dependencies
 * - registry: PropField type
 *
 * @notes
 * - Rich text and media fields render simplified inputs (full Lexical/media
 *   picker integration deferred)
 * - Array fields support nested field rendering recursively
 */
'use client'

import React from 'react'
import type { PropField } from './registry'

// ---------------------------------------------------------------------------
// FieldRenderer
// ---------------------------------------------------------------------------

interface FieldRendererProps {
  field: PropField
  value: unknown
  onChange: (value: unknown) => void
}

export function FieldRenderer({ field, value, onChange }: FieldRendererProps) {
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
// ArrayFieldRenderer
// ---------------------------------------------------------------------------

interface ArrayFieldRendererProps {
  field: PropField
  value: unknown[] | undefined
  onChange: (value: unknown) => void
}

export function ArrayFieldRenderer({ field, value, onChange }: ArrayFieldRendererProps) {
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
