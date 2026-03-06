/**
 * @description
 * Component Toolbox — left panel of the page builder.
 * Displays all registered components in categorized, collapsible sections.
 * Components are draggable via @dnd-kit/core to drop into canvas zones.
 *
 * Key features:
 * - Search bar to filter components by name/description
 * - 4 collapsible categories: Content, Layout, Data, Interactive
 * - Each component shows icon + label
 * - Draggable items as DnD sources
 * - Compact mode (icon-only) for tablet/mobile preview
 *
 * @dependencies
 * - registry: componentRegistry, categories, searchComponents
 * - @dnd-kit/core: useDraggable
 *
 * @notes
 * - data-testid="component-toolbox" on container
 * - data-testid="toolbox-search" on search input
 * - Compact mode triggers when breakpoint != desktop
 */
'use client'

import React, { useState, useMemo } from 'react'
import { useDraggable } from '@dnd-kit/core'
import {
  componentRegistry,
  categories,
  searchComponents,
  type BuilderComponentType,
  type ComponentCategory,
} from './registry'

// ---------------------------------------------------------------------------
// DraggableComponent
// ---------------------------------------------------------------------------

interface DraggableComponentProps {
  component: BuilderComponentType
  compact: boolean
}

function DraggableComponent({ component, compact }: DraggableComponentProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `toolbox-${component.type}`,
    data: {
      source: 'toolbox',
      componentType: component.type,
    },
  })

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-grab hover:bg-blue-50 transition-colors ${
        isDragging ? 'opacity-50' : ''
      } ${compact ? 'justify-center' : ''}`}
      title={compact ? `${component.label}: ${component.description}` : component.description}
    >
      <span className="text-gray-500 text-sm flex-shrink-0" aria-hidden="true">
        {getIconEmoji(component.icon)}
      </span>
      {!compact && (
        <span className="text-xs text-gray-700 truncate">{component.label}</span>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Icon mapping (Heroicon names to emoji fallbacks)
// ---------------------------------------------------------------------------

function getIconEmoji(iconName: string): string {
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
    ArrowDownTrayIcon: '⬇️',
    LinkIcon: '🔗',
  }
  return map[iconName] ?? '◻'
}

// ---------------------------------------------------------------------------
// ComponentToolbox
// ---------------------------------------------------------------------------

interface ComponentToolboxProps {
  compact: boolean
}

export function ComponentToolbox({ compact }: ComponentToolboxProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedCategories, setCollapsedCategories] = useState<Set<ComponentCategory>>(new Set())

  // Filter components by search
  const filteredComponents = useMemo(() => {
    if (!searchQuery.trim()) return componentRegistry
    return searchComponents(searchQuery)
  }, [searchQuery])

  // Group by category
  const grouped = useMemo(() => {
    const map = new Map<ComponentCategory, BuilderComponentType[]>()
    for (const cat of categories) {
      map.set(cat.slug, [])
    }
    for (const comp of filteredComponents) {
      map.get(comp.category)?.push(comp)
    }
    return map
  }, [filteredComponents])

  const toggleCategory = (cat: ComponentCategory) => {
    setCollapsedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) next.delete(cat)
      else next.add(cat)
      return next
    })
  }

  return (
    <div
      data-testid="component-toolbox"
      className={`flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto transition-all ${
        compact ? 'w-14' : 'w-56'
      }`}
    >
      {/* Search */}
      {!compact && (
        <div className="p-2 border-b border-gray-100">
          <input
            data-testid="toolbox-search"
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      )}

      {/* Categories */}
      {categories.map((cat) => {
        const components = grouped.get(cat.slug) ?? []
        if (components.length === 0) return null
        const isCollapsed = collapsedCategories.has(cat.slug)

        return (
          <div key={cat.slug} className="border-b border-gray-100">
            {/* Category header */}
            <button
              onClick={() => toggleCategory(cat.slug)}
              className={`w-full flex items-center gap-1 px-2 py-1.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-50 ${
                compact ? 'justify-center' : ''
              }`}
              title={cat.label}
            >
              <span className={`transition-transform ${isCollapsed ? '-rotate-90' : ''}`}>
                {compact ? '·' : '▾'}
              </span>
              {!compact && <span>{cat.label}</span>}
            </button>

            {/* Component list */}
            {!isCollapsed && (
              <div className={compact ? 'px-1 pb-1' : 'px-1 pb-1'}>
                {components.map((comp) => (
                  <DraggableComponent key={comp.type} component={comp} compact={compact} />
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
