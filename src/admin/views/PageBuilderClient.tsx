/**
 * @description
 * Client-side Page Builder view for FRAS Canada CMS admin (Epics 25-26).
 * Three-panel layout: Component Toolbox (left), Page Canvas (center),
 * Props Drawer (right, slides out on component gear click).
 *
 * Key features:
 * - Loads page data + template on mount
 * - Toolbar: Save, Undo, Redo, Preview, Breakpoint toggles, Language
 * - Left panel: ComponentToolbox (categorized, searchable, draggable)
 * - Center panel: BuilderCanvas (zone rendering, component chrome, DnD targets)
 * - Right panel: PropsDrawer (slides out on gear click)
 * - DnD via @dnd-kit/core for toolbox-to-canvas and reorder
 * - Keyboard shortcuts: Ctrl+Z undo, Ctrl+Shift+Z redo, Ctrl+S save
 *
 * @dependencies
 * - useBuilderState: state management
 * - templates: zone configs
 * - registry: component types
 * - @dnd-kit/core: drag-and-drop
 *
 * @notes
 * - Page ID extracted from URL path: /admin/builder/:id
 * - Saves builderLayout JSON to Payload via PATCH /api/pages/:id
 * - data-testid="page-builder" on main container
 * - data-testid="builder-toolbar" on toolbar
 */
'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { useBuilderState, generateId, type Breakpoint } from '../components/builder/useBuilderState'
import { getTemplate, type PageTemplate } from '../templates'
import { getComponentType, type BuilderComponentType } from '../components/builder/registry'
import { ComponentToolbox } from '../components/builder/ComponentToolbox'
import { BuilderCanvas } from '../components/builder/BuilderCanvas'
import { PropsDrawer } from '../components/builder/PropsDrawer'
import { AddComponentModal } from '../components/builder/AddComponentModal'
import type { BuilderLayout, ComponentInstance } from '../templates/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Minimal page data shape from Payload API */
interface PageData {
  id: string | number
  title: string
  slug: string
  template?: string
  builderLayout?: BuilderLayout | null
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Extract page ID from current URL path: /admin/builder/:id */
function getPageIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/\/admin\/builder\/([^/]+)/)
  return match ? match[1] : null
}

// ---------------------------------------------------------------------------
// Breakpoint widths
// ---------------------------------------------------------------------------

const BREAKPOINT_WIDTHS: Record<Breakpoint, number> = {
  desktop: 1440,
  tablet: 768,
  mobile: 375,
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PageBuilderClient() {
  // Page data
  const [pageData, setPageData] = useState<PageData | null>(null)
  const [template, setTemplate] = useState<PageTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Builder state
  const builder = useBuilderState()

  // Add Component modal state
  const [addComponentZone, setAddComponentZone] = useState<string | null>(null)

  // DnD state
  const [activeDrag, setActiveDrag] = useState<{
    type: 'toolbox' | 'canvas'
    componentType?: string
    componentId?: string
    sourceZone?: string
  } | null>(null)
  const [dragOverZone, setDragOverZone] = useState<string | null>(null)

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
  )

  // --- Load page data ---
  useEffect(() => {
    const pageId = getPageIdFromUrl()
    if (!pageId) {
      setError('No page ID found in URL')
      setLoading(false)
      return
    }

    async function loadPage() {
      try {
        const res = await fetch(`/api/pages/${pageId}?depth=0`)
        if (!res.ok) throw new Error(`Failed to load page: ${res.status}`)
        const data = await res.json()
        setPageData(data)

        // Set template
        if (data.template) {
          const tmpl = getTemplate(data.template)
          if (tmpl) setTemplate(tmpl)
        }

        // Set layout
        if (data.builderLayout && typeof data.builderLayout === 'object') {
          builder.setLayout(data.builderLayout as BuilderLayout)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page')
      } finally {
        setLoading(false)
      }
    }

    loadPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --- Save handler ---
  const handleSave = useCallback(async () => {
    if (!pageData) return
    setSaving(true)
    try {
      const res = await fetch(`/api/pages/${pageData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ builderLayout: builder.layout }),
      })
      if (!res.ok) throw new Error(`Save failed: ${res.status}`)
      builder.markSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [pageData, builder])

  // --- Keyboard shortcuts ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ctrl+Z / Cmd+Z = undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        builder.undo()
      }
      // Ctrl+Shift+Z / Cmd+Shift+Z = redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        builder.redo()
      }
      // Ctrl+S / Cmd+S = save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [builder, handleSave])

  // --- DnD handlers ---
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current
    if (data?.source === 'toolbox') {
      setActiveDrag({ type: 'toolbox', componentType: data.componentType })
    } else if (data?.source === 'canvas') {
      setActiveDrag({ type: 'canvas', componentId: data.componentId, sourceZone: data.zone })
    }
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { over } = event
    if (over?.data.current?.zone) {
      setDragOverZone(over.data.current.zone)
    } else {
      setDragOverZone(null)
    }
  }, [])

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event
      setActiveDrag(null)
      setDragOverZone(null)

      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current

      if (!activeData || !overData) return

      const targetZone = overData.zone as string
      if (!targetZone) return

      // Validate zone exists in template
      if (!template) return
      const zoneConfig = template.zones.find((z) => z.name === targetZone)
      if (!zoneConfig || zoneConfig.type !== 'editable') return

      if (activeData.source === 'toolbox') {
        // Drag from toolbox -> create new component
        const componentType = activeData.componentType as string
        const compDef = getComponentType(componentType)
        if (!compDef) return

        // Check zone allows this component
        if (
          zoneConfig.allowedComponents &&
          zoneConfig.allowedComponents.length > 0 &&
          !zoneConfig.allowedComponents.includes(componentType)
        ) {
          return // Invalid drop
        }

        // Check max components
        const currentCount = builder.layout.zones[targetZone]?.length ?? 0
        if (zoneConfig.maxComponents && zoneConfig.maxComponents > 0 && currentCount >= zoneConfig.maxComponents) {
          return // Zone full
        }

        // Build default props from schema
        const defaultProps: Record<string, unknown> = {}
        for (const field of compDef.propsSchema) {
          if (field.defaultValue !== undefined) {
            defaultProps[field.name] = field.defaultValue
          }
        }

        const newComponent: ComponentInstance = {
          id: generateId(),
          type: componentType,
          props: defaultProps,
        }

        // Determine insert index
        const insertIndex = overData.index !== undefined ? (overData.index as number) : undefined
        builder.addComponent(targetZone, newComponent, insertIndex)
      } else if (activeData.source === 'canvas') {
        // Drag within canvas — move/reorder
        const componentId = activeData.componentId as string
        const sourceZone = activeData.zone as string
        const newIndex = overData.index !== undefined ? (overData.index as number) : 0

        if (sourceZone === targetZone) {
          // Reorder within same zone
          builder.moveComponent(sourceZone, targetZone, componentId, newIndex)
        } else {
          // Move between zones — validate target allows this component
          const comp = builder.layout.zones[sourceZone]?.find((c) => c.id === componentId)
          if (!comp) return
          if (
            zoneConfig.allowedComponents &&
            zoneConfig.allowedComponents.length > 0 &&
            !zoneConfig.allowedComponents.includes(comp.type)
          ) {
            return
          }
          builder.moveComponent(sourceZone, targetZone, componentId, newIndex)
        }
      }
    },
    [template, builder],
  )

  // --- Active drag component info (for overlay) ---
  const activeDragComponent: BuilderComponentType | null = useMemo(() => {
    if (!activeDrag) return null
    if (activeDrag.type === 'toolbox' && activeDrag.componentType) {
      return getComponentType(activeDrag.componentType) ?? null
    }
    if (activeDrag.type === 'canvas' && activeDrag.componentId && activeDrag.sourceZone) {
      const zone = builder.layout.zones[activeDrag.sourceZone]
      const comp = zone?.find((c) => c.id === activeDrag.componentId)
      if (comp) return getComponentType(comp.type) ?? null
    }
    return null
  }, [activeDrag, builder.layout])

  // --- Render ---

  if (loading) {
    return (
      <div data-testid="page-builder" className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500">Loading page builder...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div data-testid="page-builder" className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-red-600 bg-red-50 px-6 py-4 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      </div>
    )
  }

  if (!pageData || !template) {
    return (
      <div data-testid="page-builder" className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-gray-500">
          {!pageData ? 'Page not found' : 'No template assigned to this page. Please select a template first.'}
        </div>
      </div>
    )
  }

  const canvasWidth = BREAKPOINT_WIDTHS[builder.breakpoint]
  const isCompact = builder.breakpoint !== 'desktop'

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div
        data-testid="page-builder"
        className="flex flex-col h-screen bg-gray-100"
        style={{ overflow: 'hidden' }}
      >
        {/* --- Toolbar --- */}
        <div
          data-testid="builder-toolbar"
          className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200 shadow-sm"
          style={{ minHeight: 48 }}
        >
          {/* Left: page info + back */}
          <div className="flex items-center gap-3">
            <a
              href={`/admin/collections/pages/${pageData.id}`}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              &larr; Back to editor
            </a>
            <span className="text-sm text-gray-500">|</span>
            <span className="text-sm font-medium text-gray-700">{pageData.title}</span>
            <span className="text-xs text-gray-400">({template.label})</span>
            {builder.isDirty && (
              <span className="text-xs text-orange-500 font-medium">Unsaved changes</span>
            )}
          </div>

          {/* Center: actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={saving || !builder.isDirty}
              className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save'}
            </button>
            <button
              data-testid="undo-button"
              onClick={builder.undo}
              disabled={!builder.canUndo}
              className="px-2 py-1.5 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              &#x21A9;
            </button>
            <button
              data-testid="redo-button"
              onClick={builder.redo}
              disabled={!builder.canRedo}
              className="px-2 py-1.5 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              &#x21AA;
            </button>

            <span className="mx-1 text-gray-300">|</span>

            {/* Breakpoint toggles */}
            {(['desktop', 'tablet', 'mobile'] as Breakpoint[]).map((bp) => (
              <button
                key={bp}
                data-testid={`breakpoint-${bp}`}
                onClick={() => builder.setBreakpoint(bp)}
                className={`px-2 py-1.5 text-xs rounded ${
                  builder.breakpoint === bp
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {bp === 'desktop' ? '🖥' : bp === 'tablet' ? '📱' : '📲'}
                <span className="ml-1">{BREAKPOINT_WIDTHS[bp]}px</span>
              </button>
            ))}
          </div>

          {/* Right: preview link */}
          <div className="flex items-center gap-2">
            <a
              href={`/${pageData.slug}?preview=true`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              Preview
            </a>
          </div>
        </div>

        {/* --- Main 3-panel layout --- */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Component Toolbox */}
          <ComponentToolbox compact={isCompact} />

          {/* Center: Canvas */}
          <BuilderCanvas
            template={template}
            layout={builder.layout}
            selectedComponentId={builder.selectedComponentId}
            canvasWidth={canvasWidth}
            dragOverZone={dragOverZone}
            onSelectComponent={(componentId, zone) => builder.selectComponent(componentId, zone)}
            onRemoveComponent={(zone, componentId) => builder.removeComponent(zone, componentId)}
            onDuplicateComponent={(zone, componentId) => builder.duplicateComponent(zone, componentId)}
            onCopyComponent={(zone, componentId) => builder.copyComponent(zone, componentId)}
            onPasteComponent={(zone) => builder.pasteComponent(zone)}
            onAddComponent={(zone) => setAddComponentZone(zone)}
            clipboard={builder.clipboard}
          />

          {/* Right: Props Drawer */}
          {builder.selectedComponent && builder.selectedZone && (
            <PropsDrawer
              component={builder.selectedComponent}
              zone={builder.selectedZone}
              onApply={(props) => {
                if (builder.selectedComponentId && builder.selectedZone) {
                  builder.updateComponentProps(builder.selectedZone, builder.selectedComponentId, props)
                }
              }}
              onClose={() => builder.selectComponent(null, null)}
            />
          )}
        </div>
      </div>

      {/* Drag overlay */}
      <DragOverlay>
        {activeDragComponent && (
          <div className="px-3 py-2 bg-white border border-blue-300 rounded shadow-lg text-sm font-medium text-gray-700">
            {activeDragComponent.label}
          </div>
        )}
      </DragOverlay>

      {/* Add Component modal */}
      {addComponentZone && template && (
        <AddComponentModal
          allowedComponents={
            template.zones.find((z) => z.name === addComponentZone)?.allowedComponents
          }
          onSelect={(componentType) => {
            const compDef = getComponentType(componentType)
            if (!compDef) return
            const defaultProps: Record<string, unknown> = {}
            for (const field of compDef.propsSchema) {
              if (field.defaultValue !== undefined) {
                defaultProps[field.name] = field.defaultValue
              }
            }
            const newComponent: ComponentInstance = {
              id: generateId(),
              type: componentType,
              props: defaultProps,
            }
            builder.addComponent(addComponentZone, newComponent)
            setAddComponentZone(null)
          }}
          onClose={() => setAddComponentZone(null)}
        />
      )}
    </DndContext>
  )
}
