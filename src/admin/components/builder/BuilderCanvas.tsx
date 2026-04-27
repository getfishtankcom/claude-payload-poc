/**
 * @description
 * Builder Canvas — center panel of the page builder.
 * Renders the template's zone structure with locked/editable zones.
 * Components show visual preview renderers instead of plain text labels.
 *
 * Key features:
 * - Locked zones: gray dashed border, lock icon, "Locked" label
 * - Editable zones: blue dashed border, "Editable Zone" label, "+" button
 * - Component chrome bar (label, gear, drag handle, remove) as absolute overlay on hover/select
 * - Visual previews via PreviewRenderer (compact mode)
 * - Blue ring on selected component
 * - Context menu: Copy, Paste, Duplicate
 * - Responsive width via prop
 *
 * @dependencies
 * - templates: PageTemplate, TemplateZone
 * - templates/types: BuilderLayout, ComponentInstance
 * - registry: getComponentType
 * - previews: PreviewRenderer
 * - @dnd-kit/core: useDroppable
 * - @dnd-kit/sortable: useSortable, SortableContext
 *
 * @notes
 * - data-testid="builder-canvas" on canvas container
 * - data-testid="zone-locked" on locked zones
 * - data-testid="zone-editable" on editable zones
 * - data-testid="component-remove" on X button
 * - data-testid="component-duplicate" on duplicate action
 * - data-testid="component-copy" on copy action
 * - data-testid="component-paste" on paste action
 */
'use client'

import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PageTemplate, TemplateZone } from '../../templates/types'
import type { BuilderLayout, ComponentInstance } from '../../templates/types'
import { getComponentType } from './registry'
import { PreviewRenderer } from './previews'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BuilderCanvasProps {
  template: PageTemplate
  layout: BuilderLayout
  selectedComponentId: string | null
  canvasWidth: number
  dragOverZone: string | null
  onSelectComponent: (componentId: string | null, zone: string | null) => void
  onRemoveComponent: (zone: string, componentId: string) => void
  onDuplicateComponent: (zone: string, componentId: string) => void
  onCopyComponent: (zone: string, componentId: string) => void
  onPasteComponent: (zone: string) => void
  onAddComponent: (zone: string) => void
  clipboard: ComponentInstance | null
}

// ---------------------------------------------------------------------------
// SortableComponent — visual preview with chrome overlay
// ---------------------------------------------------------------------------

interface SortableComponentProps {
  component: ComponentInstance
  zone: string
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
  onDuplicate: () => void
  onCopy: () => void
  onPaste: () => void
  hasClipboard: boolean
}

function SortableComponent({
  component,
  zone,
  isSelected,
  onSelect,
  onRemove,
  onDuplicate,
  onCopy,
  onPaste,
  hasClipboard,
}: SortableComponentProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    data: {
      source: 'canvas',
      componentId: component.id,
      zone,
    },
  })

  const [showContextMenu, setShowContextMenu] = useState(false)
  const [hovered, setHovered] = useState(false)

  const compDef = getComponentType(component.type)
  const label = compDef?.label ?? component.type

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded mb-2 transition-all ${
        isSelected
          ? 'ring-2 ring-blue-500 ring-offset-1'
          : hovered
            ? 'ring-1 ring-blue-300'
            : ''
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false)
        setShowContextMenu(false)
      }}
      onContextMenu={(e) => {
        e.preventDefault()
        setShowContextMenu(true)
      }}
    >
      {/* Chrome bar overlay — visible on hover/select. z-20 to sit above the preview body */}
      <div
        className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-2 py-1 text-xs bg-white/90 backdrop-blur-sm border-b border-gray-200 rounded-t transition-opacity ${
          hovered || isSelected ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="font-medium text-gray-600">{label}</span>
        <div className="flex items-center gap-1">
          {/* Gear / select */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onSelect()
            }}
            className="p-0.5 text-gray-400 hover:text-blue-600"
            title="Edit props"
          >
            ⚙
          </button>
          {/* Drag handle */}
          <button
            {...attributes}
            {...listeners}
            className="p-0.5 text-gray-400 hover:text-gray-600 cursor-grab"
            title="Drag to reorder"
          >
            ⇕
          </button>
          {/* Remove */}
          <button
            data-testid="component-remove"
            onClick={(e) => {
              e.stopPropagation()
              onRemove()
            }}
            className="p-0.5 text-gray-400 hover:text-red-600"
            title="Remove component"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Visual preview body */}
      <div
        className="bg-white border border-gray-200 rounded overflow-hidden cursor-pointer"
        onClick={onSelect}
      >
        {/* Top padding for chrome overlay space */}
        <div className={`${hovered || isSelected ? 'pt-7' : 'pt-1'} px-3 pb-2 min-h-[48px] transition-[padding]`}>
          <PreviewRenderer
            type={component.type}
            props={component.props}
            compact={true}
          />
        </div>
      </div>

      {/* Context menu */}
      {showContextMenu && (
        <div className="absolute top-8 right-2 z-50 bg-white border border-gray-200 rounded shadow-lg py-1 min-w-[140px]">
          <button
            data-testid="component-copy"
            onClick={() => { onCopy(); setShowContextMenu(false) }}
            className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
          >
            Copy
          </button>
          {hasClipboard && (
            <button
              data-testid="component-paste"
              onClick={() => { onPaste(); setShowContextMenu(false) }}
              className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
            >
              Paste Below
            </button>
          )}
          <button
            data-testid="component-duplicate"
            onClick={() => { onDuplicate(); setShowContextMenu(false) }}
            className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100"
          >
            Duplicate
          </button>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={() => { onRemove(); setShowContextMenu(false) }}
            className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// EditableZone
// ---------------------------------------------------------------------------

interface EditableZoneProps {
  zone: TemplateZone
  components: ComponentInstance[]
  selectedComponentId: string | null
  isDragOver: boolean
  onSelectComponent: (componentId: string | null, zone: string | null) => void
  onRemoveComponent: (zone: string, componentId: string) => void
  onDuplicateComponent: (zone: string, componentId: string) => void
  onCopyComponent: (zone: string, componentId: string) => void
  onPasteComponent: (zone: string) => void
  onAddComponent: (zone: string) => void
  clipboard: ComponentInstance | null
}

function EditableZone({
  zone,
  components,
  selectedComponentId,
  isDragOver,
  onSelectComponent,
  onRemoveComponent,
  onDuplicateComponent,
  onCopyComponent,
  onPasteComponent,
  onAddComponent,
  clipboard,
}: EditableZoneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `zone-${zone.name}`,
    data: { zone: zone.name, index: components.length },
  })

  const highlight = isDragOver || isOver

  return (
    <div
      ref={setNodeRef}
      data-testid="zone-editable"
      className={`relative border-2 border-dashed rounded-lg p-3 mb-4 transition-colors ${
        highlight
          ? 'border-green-400 bg-green-50'
          : 'border-blue-300 bg-blue-50/30'
      }`}
    >
      {/* Zone label */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {zone.label}
        </span>
        <span className="text-xs text-blue-400">Editable Zone</span>
        {zone.maxComponents && zone.maxComponents > 0 && (
          <span className="text-xs text-gray-400">
            ({components.length}/{zone.maxComponents})
          </span>
        )}
      </div>

      {/* Components */}
      <SortableContext items={components.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        {components.map((comp) => (
          <SortableComponent
            key={comp.id}
            component={comp}
            zone={zone.name}
            isSelected={comp.id === selectedComponentId}
            onSelect={() => onSelectComponent(comp.id, zone.name)}
            onRemove={() => onRemoveComponent(zone.name, comp.id)}
            onDuplicate={() => onDuplicateComponent(zone.name, comp.id)}
            onCopy={() => onCopyComponent(zone.name, comp.id)}
            onPaste={() => onPasteComponent(zone.name)}
            hasClipboard={clipboard !== null}
          />
        ))}
      </SortableContext>

      {/* Empty state / add button */}
      {components.length === 0 && (
        <div className="text-center py-4 text-xs text-gray-400">
          Drag a component here or click + to add
        </div>
      )}

      {/* Add component button */}
      <button
        data-testid="add-component-button"
        onClick={() => onAddComponent(zone.name)}
        className="w-full py-2 mt-1 text-xs text-blue-500 border border-dashed border-blue-300 rounded hover:bg-blue-50 hover:border-blue-400 transition-colors"
      >
        + Add Component
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// LockedZone
// ---------------------------------------------------------------------------

interface LockedZoneProps {
  zone: TemplateZone
}

function LockedZone({ zone }: LockedZoneProps) {
  return (
    <div
      data-testid="zone-locked"
      className="relative border-2 border-dashed border-gray-300 rounded-lg p-3 mb-4 bg-gray-50/50"
    >
      <div className="flex items-center gap-2">
        <span className="text-gray-400" title="Locked zone">🔒</span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {zone.label}
        </span>
        <span className="text-xs text-gray-400">Locked</span>
      </div>
      <div className="mt-1 text-xs text-gray-400 italic">
        {zone.lockedComponent ?? 'Structural component'}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// BuilderCanvas
// ---------------------------------------------------------------------------

export function BuilderCanvas({
  template,
  layout,
  selectedComponentId,
  canvasWidth,
  dragOverZone,
  onSelectComponent,
  onRemoveComponent,
  onDuplicateComponent,
  onCopyComponent,
  onPasteComponent,
  onAddComponent,
  clipboard,
}: BuilderCanvasProps) {
  return (
    <div
      data-testid="builder-canvas"
      className="flex-1 overflow-auto bg-gray-100 flex justify-center"
      onClick={() => onSelectComponent(null, null)}
    >
      <div
        className="bg-white shadow-lg my-4 transition-all duration-300"
        style={{
          width: canvasWidth,
          maxWidth: '100%',
          minHeight: 'calc(100vh - 120px)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4">
          {template.zones.map((zone) => {
            if (zone.type === 'locked') {
              return <LockedZone key={zone.name} zone={zone} />
            }

            const components = layout.zones[zone.name] ?? []

            return (
              <EditableZone
                key={zone.name}
                zone={zone}
                components={components}
                selectedComponentId={selectedComponentId}
                isDragOver={dragOverZone === zone.name}
                onSelectComponent={onSelectComponent}
                onRemoveComponent={onRemoveComponent}
                onDuplicateComponent={onDuplicateComponent}
                onCopyComponent={onCopyComponent}
                onPasteComponent={onPasteComponent}
                onAddComponent={onAddComponent}
                clipboard={clipboard}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
