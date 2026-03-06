/**
 * @description
 * Add Component Modal — searchable, categorized grid for adding components
 * to an editable zone. Opens when the "+" button is clicked at the bottom
 * of an editable zone. Alternative to toolbox drag-and-drop.
 *
 * Key features:
 * - Searchable grid of available components
 * - Filtered by zone's allowedComponents list
 * - Categorized tabs: Content, Layout, Data, Interactive
 * - Shows icon + label + description per component
 * - Click to add, then close modal
 *
 * @dependencies
 * - registry: componentRegistry, categories, getComponentsForZone, searchComponents
 * - templates/types: TemplateZone
 *
 * @notes
 * - data-testid="add-component-modal" on modal container
 * - data-testid="add-component-search" on search input
 * - Filters components based on zone's allowedComponents
 * - Clicking outside or pressing Escape closes the modal
 */
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  componentRegistry,
  categories,
  getComponentsForZone,
  type BuilderComponentType,
  type ComponentCategory,
} from './registry'

// ---------------------------------------------------------------------------
// Icon mapping (same as toolbox)
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
// Types
// ---------------------------------------------------------------------------

interface AddComponentModalProps {
  /** The zone's allowed component types (empty = all) */
  allowedComponents?: string[]
  /** Called when a component type is selected */
  onSelect: (componentType: string) => void
  /** Called to close the modal */
  onClose: () => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AddComponentModal({ allowedComponents, onSelect, onClose }: AddComponentModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<ComponentCategory | 'all'>('all')
  const modalRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // Focus search on mount
  useEffect(() => {
    searchRef.current?.focus()
  }, [])

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  // Filter components by zone + search + tab
  const filteredComponents = useMemo(() => {
    let comps = getComponentsForZone(allowedComponents)

    // Filter by search
    if (searchQuery.trim()) {
      const lower = searchQuery.toLowerCase()
      comps = comps.filter(
        (c) => c.label.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower),
      )
    }

    // Filter by tab
    if (activeTab !== 'all') {
      comps = comps.filter((c) => c.category === activeTab)
    }

    return comps
  }, [allowedComponents, searchQuery, activeTab])

  // Category counts
  const categoryCounts = useMemo(() => {
    const available = getComponentsForZone(allowedComponents)
    const counts: Record<string, number> = { all: available.length }
    for (const cat of categories) {
      counts[cat.slug] = available.filter((c) => c.category === cat.slug).length
    }
    return counts
  }, [allowedComponents])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div
        ref={modalRef}
        data-testid="add-component-modal"
        className="bg-white rounded-lg shadow-2xl w-[640px] max-h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-800">Add Component</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="px-5 py-3 border-b border-gray-100">
          <input
            ref={searchRef}
            data-testid="add-component-search"
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-1 px-5 pt-3 border-b border-gray-100">
          <TabButton
            label="All"
            count={categoryCounts.all}
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          />
          {categories.map((cat) =>
            categoryCounts[cat.slug] > 0 ? (
              <TabButton
                key={cat.slug}
                label={cat.label}
                count={categoryCounts[cat.slug]}
                active={activeTab === cat.slug}
                onClick={() => setActiveTab(cat.slug)}
              />
            ) : null,
          )}
        </div>

        {/* Component grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredComponents.length === 0 ? (
            <div className="text-center py-8 text-sm text-gray-400">
              No components match your search
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredComponents.map((comp) => (
                <ComponentCard key={comp.type} component={comp} onSelect={onSelect} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TabButton({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 text-xs font-medium rounded-t transition-colors ${
        active
          ? 'bg-white text-blue-600 border-b-2 border-blue-600'
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
      }`}
    >
      {label}
      <span className="ml-1 text-gray-400">({count})</span>
    </button>
  )
}

function ComponentCard({
  component,
  onSelect,
}: {
  component: BuilderComponentType
  onSelect: (type: string) => void
}) {
  return (
    <button
      onClick={() => onSelect(component.type)}
      className="flex items-start gap-3 p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-colors"
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{getIconEmoji(component.icon)}</span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-700">{component.label}</div>
        <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{component.description}</div>
      </div>
    </button>
  )
}
