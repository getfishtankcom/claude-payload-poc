/**
 * @description
 * Structure Tree — renders the page zone hierarchy as a tree view.
 * Zones are group headers; components are indented children.
 * Locked zones show a lock icon and are non-interactive.
 * Editable zones show component rows with drag handles for reorder.
 *
 * Key features:
 * - Tree view of zones → component children
 * - Click component → selects on canvas + opens inspector
 * - Drag handle for reorder within zone (uses @dnd-kit/sortable)
 * - Gear and remove buttons per component row
 * - Expandable/collapsible zone groups
 *
 * @dependencies
 * - templates/types: TemplateZone, BuilderLayout, ComponentInstance
 * - registry: getComponentType
 * - @dnd-kit/sortable: useSortable, SortableContext
 *
 * @notes
 * - Tree draggable IDs use "tree-" prefix to avoid collision with canvas IDs
 * - data-testid="structure-tree" on tree container
 */
'use client'

import React, { useState } from 'react'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { TemplateZone } from '../../templates/types'
import type { BuilderLayout, ComponentInstance } from '../../templates/types'
import { getComponentType } from './registry'

// ---------------------------------------------------------------------------
// Icon helper (lightweight emoji mapping for tree)
// ---------------------------------------------------------------------------

function getTreeIcon(iconName: string): string {
  const map: Record<string, string> = {
    DocumentTextIcon: '📄',
    HashtagIcon: '#',
    PhotoIcon: '🖼',
    VideoCameraIcon: '🎬',
    Bars3BottomLeftIcon: '≡',
    RectangleGroupIcon: '⊞',
    TableCellsIcon: '⊞',
    ChatBubbleBottomCenterTextIcon: '💬',
    MinusIcon: '—',
    Squares2X2Icon: '⊞',
    ViewColumnsIcon: '▥',
    MegaphoneIcon: '📢',
    SparklesIcon: '✨',
    ChartBarIcon: '📊',
    ClipboardDocumentListIcon: '📋',
    NewspaperIcon: '📰',
    CalendarIcon: '📅',
    DocumentIcon: '📄',
    UserCircleIcon: '👤',
    UserGroupIcon: '👥',
    ClockIcon: '🕐',
    BookOpenIcon: '📖',
    CalendarDaysIcon: '📅',
    MagnifyingGlassIcon: '🔍',
    FunnelIcon: '🔽',
    EnvelopeIcon: '✉️',
    ArrowDownTrayIcon: '⬇',
    LinkIcon: '🔗',
  }
  return map[iconName] ?? '◻'
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface StructureTreeProps {
  zones: TemplateZone[]
  layout: BuilderLayout
  selectedComponentId: string | null
  onSelectComponent: (componentId: string | null, zone: string | null) => void
  onRemoveComponent: (zone: string, componentId: string) => void
}

// ---------------------------------------------------------------------------
// SortableTreeItem — a single component row in the tree
// ---------------------------------------------------------------------------

interface SortableTreeItemProps {
  component: ComponentInstance
  zone: string
  isSelected: boolean
  onSelect: () => void
  onRemove: () => void
}

function SortableTreeItem({ component, zone, isSelected, onSelect, onRemove }: SortableTreeItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `tree-${component.id}`,
    data: {
      source: 'canvas',
      componentId: component.id,
      zone,
    },
  })

  const compDef = getComponentType(component.type)
  const label = compDef?.label ?? component.type
  const icon = compDef ? getTreeIcon(compDef.icon) : '◻'

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-1.5 pl-5 pr-2 py-1 text-xs cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-600 hover:bg-gray-50'
      }`}
      onClick={(e) => {
        e.stopPropagation()
        onSelect()
      }}
    >
      {/* Drag handle */}
      <button
        {...attributes}
        {...listeners}
        className="text-gray-300 hover:text-gray-500 cursor-grab flex-shrink-0"
        title="Drag to reorder"
        onClick={(e) => e.stopPropagation()}
      >
        ⋮⋮
      </button>

      {/* Icon + label */}
      <span className="flex-shrink-0">{icon}</span>
      <span className="truncate flex-1">{label}</span>

      {/* Actions — visible on hover via group. pointer-events-none when hidden to prevent click interception */}
      <div className="flex items-center gap-0.5 opacity-0 group-hover/item:opacity-100 transition-opacity flex-shrink-0 pointer-events-none group-hover/item:pointer-events-auto">
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
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="p-0.5 text-gray-400 hover:text-red-600"
          title="Remove"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StructureTree
// ---------------------------------------------------------------------------

export function StructureTree({
  zones,
  layout,
  selectedComponentId,
  onSelectComponent,
  onRemoveComponent,
}: StructureTreeProps) {
  const [collapsedZones, setCollapsedZones] = useState<Set<string>>(new Set())

  const toggleZone = (zoneName: string) => {
    setCollapsedZones((prev) => {
      const next = new Set(prev)
      if (next.has(zoneName)) next.delete(zoneName)
      else next.add(zoneName)
      return next
    })
  }

  return (
    <div data-testid="structure-tree" className="py-1">
      {zones.map((zone) => {
        const isLocked = zone.type === 'locked'
        const components = layout.zones[zone.name] ?? []
        const isCollapsed = collapsedZones.has(zone.name)
        const hasComponents = components.length > 0

        return (
          <div key={zone.name} className="mb-0.5">
            {/* Zone header */}
            <button
              className={`w-full flex items-center gap-1.5 px-2 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                isLocked
                  ? 'text-gray-400 cursor-default'
                  : 'text-gray-600 hover:bg-gray-50 cursor-pointer'
              }`}
              onClick={() => !isLocked && hasComponents && toggleZone(zone.name)}
              disabled={isLocked}
            >
              {/* Expand/collapse indicator */}
              {!isLocked && hasComponents ? (
                <span className={`transition-transform text-gray-400 ${isCollapsed ? '-rotate-90' : ''}`}>
                  ▾
                </span>
              ) : (
                <span className="w-3" />
              )}

              {/* Lock icon for locked zones */}
              {isLocked && <span className="text-gray-400">🔒</span>}

              {/* Editable icon for editable zones */}
              {!isLocked && <span className="text-blue-400">✏</span>}

              <span className="truncate">{zone.label}</span>

              {/* Component count badge */}
              {!isLocked && hasComponents && (
                <span className="text-gray-400 font-normal ml-auto">{components.length}</span>
              )}
            </button>

            {/* Component children — only for editable zones, when expanded */}
            {!isLocked && !isCollapsed && hasComponents && (
              <SortableContext
                items={components.map((c) => `tree-${c.id}`)}
                strategy={verticalListSortingStrategy}
              >
                {components.map((comp) => (
                  <div key={comp.id} className="group/item">
                    <SortableTreeItem
                      component={comp}
                      zone={zone.name}
                      isSelected={comp.id === selectedComponentId}
                      onSelect={() => onSelectComponent(comp.id, zone.name)}
                      onRemove={() => onRemoveComponent(zone.name, comp.id)}
                    />
                  </div>
                ))}
              </SortableContext>
            )}

            {/* Locked zone component label */}
            {isLocked && (
              <div className="pl-7 pr-2 py-0.5 text-xs text-gray-400 italic">
                {zone.lockedComponent ?? 'Structural'}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
