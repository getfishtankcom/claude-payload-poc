/**
 * @description
 * Inspector Panel — Storybook-style right panel of the page builder.
 * Shows a live preview of the selected component at the top, with a
 * scrollable props form below. Apply commits changes to builder state
 * (pushes undo). Cancel reverts to original props.
 *
 * Key features:
 * - 360px wide, slides in when a component is selected
 * - Top section: Live PreviewRenderer (compact=false) that re-renders on prop edits
 * - Bottom section: Scrollable props form using shared FieldRenderer
 * - Sticky footer: Apply / Cancel buttons
 * - Local editedProps state — Apply pushes to builder, Cancel reverts
 *
 * @dependencies
 * - registry: getComponentType, PropField
 * - templates/types: ComponentInstance
 * - previews: PreviewRenderer
 * - PropsFormFields: FieldRenderer (shared)
 *
 * @notes
 * - data-testid="inspector-panel" on panel container
 * - data-testid="inspector-apply" on Apply button
 * - Preview reads from local editedProps — updates on every field change
 */
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import type { ComponentInstance } from '../../templates/types'
import { getComponentType } from './registry'
import { PreviewRenderer } from './previews'
import { FieldRenderer } from './PropsFormFields'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface InspectorPanelProps {
  /** The currently selected component instance */
  component: ComponentInstance
  /** The zone the component belongs to */
  zone: string
  /** Called with updated props when Apply is clicked */
  onApply: (props: Record<string, unknown>) => void
  /** Called when the panel should close (deselect) */
  onClose: () => void
}

// ---------------------------------------------------------------------------
// InspectorPanel
// ---------------------------------------------------------------------------

export function InspectorPanel({ component, zone, onApply, onClose }: InspectorPanelProps) {
  const compDef = getComponentType(component.type)
  const [editedProps, setEditedProps] = useState<Record<string, unknown>>({ ...component.props })

  // Reset edited props when a different component is selected
  useEffect(() => {
    setEditedProps({ ...component.props })
  }, [component.id, component.props])

  // Field change handler — updates local state for live preview
  const handleFieldChange = useCallback((fieldName: string, value: unknown) => {
    setEditedProps((prev) => ({ ...prev, [fieldName]: value }))
  }, [])

  // Apply — commit changes to builder state and close
  const handleApply = () => {
    onApply(editedProps)
    onClose()
  }

  // Cancel — discard edits and close
  const handleCancel = () => {
    onClose()
  }

  // Unknown component type fallback
  if (!compDef) {
    return (
      <div
        data-testid="inspector-panel"
        className="w-[360px] flex-shrink-0 bg-white border-l border-gray-200 p-4"
      >
        <div className="text-sm text-red-500">Unknown component type: {component.type}</div>
      </div>
    )
  }

  return (
    <div
      data-testid="inspector-panel"
      className="w-[360px] flex-shrink-0 bg-white border-l border-gray-200 flex flex-col overflow-hidden"
      style={{ animation: 'slideInRight 0.2s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <span className="text-sm font-semibold text-gray-700">{compDef.label}</span>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Live preview section */}
        <div className="border-b border-gray-200 bg-gray-50 p-3">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Preview
          </div>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <PreviewRenderer
              type={component.type}
              props={editedProps}
              compact={false}
            />
          </div>
        </div>

        {/* Props form section */}
        <div className="p-4 space-y-4">
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">
            Properties
          </div>
          {compDef.propsSchema.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-medium text-gray-600 mb-1 break-words">
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
      </div>

      {/* Sticky footer actions */}
      <div className="flex gap-2 px-4 py-3 border-t border-gray-200 bg-white flex-shrink-0">
        <button
          data-testid="inspector-apply"
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
