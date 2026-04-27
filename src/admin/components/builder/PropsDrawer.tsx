/**
 * @description
 * Props Drawer — legacy right panel of the page builder (slides out).
 * Now delegates to shared PropsFormFields for field rendering.
 *
 * @deprecated Use InspectorPanel instead — this file is kept for
 * backward compatibility during the transition.
 *
 * Key features:
 * - Slides out (300px) when a component is selected via gear icon
 * - Renders field types via shared FieldRenderer
 * - Apply commits changes, Cancel reverts to original props
 * - Close button dismisses the drawer
 *
 * @dependencies
 * - registry: getComponentType
 * - templates/types: ComponentInstance
 * - PropsFormFields: FieldRenderer (shared)
 *
 * @notes
 * - data-testid="props-drawer" on drawer container
 * - data-testid="props-apply" on Apply button
 */
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type { ComponentInstance } from '../../templates/types'
import { getComponentType } from './registry'
import { FieldRenderer } from './PropsFormFields'

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
