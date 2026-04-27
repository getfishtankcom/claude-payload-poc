/**
 * @description
 * Structure Panel — left panel of the redesigned page builder.
 * Shows a tree view of the page's zone/component hierarchy.
 * Replaces the ComponentToolbox as the primary left panel.
 *
 * Key features:
 * - 280px wide, always visible
 * - StructureTree: zones as groups, components as children
 * - Sticky "+ Add Component" button at the bottom
 * - Click component in tree → selects on canvas + opens inspector
 *
 * @dependencies
 * - StructureTree: tree rendering component
 * - templates/types: PageTemplate, BuilderLayout, ComponentInstance
 *
 * @notes
 * - data-testid="structure-panel" on panel container
 * - The add button opens the existing AddComponentModal
 *   for the first editable zone (or selected zone)
 */
'use client'

import React from 'react'
import type { PageTemplate } from '../../templates/types'
import type { BuilderLayout } from '../../templates/types'
import { StructureTree } from './StructureTree'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StructurePanelProps {
  /** Current page template with zone definitions */
  template: PageTemplate
  /** Current builder layout (zones → components) */
  layout: BuilderLayout
  /** Currently selected component ID */
  selectedComponentId: string | null
  /** Called when a component is selected in the tree */
  onSelectComponent: (componentId: string | null, zone: string | null) => void
  /** Called when a component should be removed */
  onRemoveComponent: (zone: string, componentId: string) => void
  /** Called to open the add component modal for a zone */
  onAddComponent: (zone: string) => void
  /** The currently selected zone (for the add button target) */
  selectedZone: string | null
}

// ---------------------------------------------------------------------------
// StructurePanel
// ---------------------------------------------------------------------------

export function StructurePanel({
  template,
  layout,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent,
  onAddComponent,
  selectedZone,
}: StructurePanelProps) {
  // Determine which zone the "Add Component" button targets:
  // selected zone > first editable zone
  const targetZone =
    selectedZone ??
    template.zones.find((z) => z.type === 'editable')?.name ??
    null

  return (
    <div
      data-testid="structure-panel"
      className="w-[280px] flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-200 flex-shrink-0">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          Structure
        </span>
      </div>

      {/* Tree view — scrollable */}
      <div className="flex-1 overflow-y-auto">
        <StructureTree
          zones={template.zones}
          layout={layout}
          selectedComponentId={selectedComponentId}
          onSelectComponent={onSelectComponent}
          onRemoveComponent={onRemoveComponent}
        />
      </div>

      {/* Sticky add button */}
      {targetZone && (
        <div className="px-3 py-2.5 border-t border-gray-200 flex-shrink-0">
          <button
            onClick={() => onAddComponent(targetZone)}
            className="w-full py-2 text-xs font-medium text-blue-600 border border-dashed border-blue-300 rounded-lg hover:bg-blue-50 hover:border-blue-400 transition-colors"
          >
            + Add Component
          </button>
        </div>
      )}
    </div>
  )
}
