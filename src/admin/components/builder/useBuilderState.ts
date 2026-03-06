/**
 * @description
 * State management hook for the page builder.
 * Manages the layout JSON, undo/redo history, selected component,
 * breakpoint, and dirty state. All layout mutations go through this hook.
 *
 * Key features:
 * - Layout state with zone-based component management
 * - Undo/redo history (max 50 entries)
 * - Component selection tracking
 * - Breakpoint state for responsive preview
 * - Clipboard for copy/paste
 * - Dirty flag for unsaved changes
 *
 * @dependencies
 * - templates/types: BuilderLayout, ComponentInstance
 *
 * @notes
 * - All mutations push to undo history automatically
 * - History is cleared on save
 * - generateId creates random IDs for new component instances
 */

'use client'

import { useCallback, useMemo, useReducer } from 'react'
import type { BuilderLayout, ComponentInstance } from '@/admin/templates/types'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Breakpoint = 'desktop' | 'tablet' | 'mobile'

export interface BuilderState {
  /** Current layout JSON */
  layout: BuilderLayout
  /** Undo history stack */
  undoStack: BuilderLayout[]
  /** Redo history stack */
  redoStack: BuilderLayout[]
  /** Currently selected component ID (null = none) */
  selectedComponentId: string | null
  /** Currently selected zone name */
  selectedZone: string | null
  /** Active breakpoint for responsive preview */
  breakpoint: Breakpoint
  /** Clipboard for copy/paste */
  clipboard: ComponentInstance | null
  /** Whether layout has unsaved changes */
  isDirty: boolean
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

type BuilderAction =
  | { type: 'SET_LAYOUT'; layout: BuilderLayout }
  | { type: 'ADD_COMPONENT'; zone: string; component: ComponentInstance; index?: number }
  | { type: 'REMOVE_COMPONENT'; zone: string; componentId: string }
  | { type: 'MOVE_COMPONENT'; fromZone: string; toZone: string; componentId: string; newIndex: number }
  | { type: 'UPDATE_COMPONENT_PROPS'; zone: string; componentId: string; props: Record<string, unknown> }
  | { type: 'DUPLICATE_COMPONENT'; zone: string; componentId: string }
  | { type: 'COPY_COMPONENT'; zone: string; componentId: string }
  | { type: 'PASTE_COMPONENT'; zone: string; index?: number }
  | { type: 'SELECT_COMPONENT'; componentId: string | null; zone: string | null }
  | { type: 'SET_BREAKPOINT'; breakpoint: Breakpoint }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'MARK_SAVED' }

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const MAX_HISTORY = 50

/** Generate a random component instance ID */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

/** Push current layout to undo stack, clear redo */
function pushHistory(state: BuilderState): Pick<BuilderState, 'undoStack' | 'redoStack'> {
  const newUndo = [...state.undoStack, structuredClone(state.layout)]
  if (newUndo.length > MAX_HISTORY) newUndo.shift()
  return { undoStack: newUndo, redoStack: [] }
}

/** Deep clone a layout */
function cloneLayout(layout: BuilderLayout): BuilderLayout {
  return structuredClone(layout)
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'SET_LAYOUT': {
      return {
        ...state,
        layout: action.layout,
        undoStack: [],
        redoStack: [],
        isDirty: false,
        selectedComponentId: null,
        selectedZone: null,
      }
    }

    case 'ADD_COMPONENT': {
      const history = pushHistory(state)
      const newLayout = cloneLayout(state.layout)
      if (!newLayout.zones[action.zone]) {
        newLayout.zones[action.zone] = []
      }
      const idx = action.index ?? newLayout.zones[action.zone].length
      newLayout.zones[action.zone].splice(idx, 0, action.component)
      return { ...state, ...history, layout: newLayout, isDirty: true }
    }

    case 'REMOVE_COMPONENT': {
      const history = pushHistory(state)
      const newLayout = cloneLayout(state.layout)
      const zone = newLayout.zones[action.zone]
      if (zone) {
        newLayout.zones[action.zone] = zone.filter((c) => c.id !== action.componentId)
      }
      return {
        ...state,
        ...history,
        layout: newLayout,
        isDirty: true,
        selectedComponentId: state.selectedComponentId === action.componentId ? null : state.selectedComponentId,
        selectedZone: state.selectedComponentId === action.componentId ? null : state.selectedZone,
      }
    }

    case 'MOVE_COMPONENT': {
      const history = pushHistory(state)
      const newLayout = cloneLayout(state.layout)
      // Remove from source zone
      const fromZone = newLayout.zones[action.fromZone]
      if (!fromZone) return state
      const compIndex = fromZone.findIndex((c) => c.id === action.componentId)
      if (compIndex === -1) return state
      const [comp] = fromZone.splice(compIndex, 1)
      // Add to target zone
      if (!newLayout.zones[action.toZone]) {
        newLayout.zones[action.toZone] = []
      }
      newLayout.zones[action.toZone].splice(action.newIndex, 0, comp)
      return { ...state, ...history, layout: newLayout, isDirty: true }
    }

    case 'UPDATE_COMPONENT_PROPS': {
      const history = pushHistory(state)
      const newLayout = cloneLayout(state.layout)
      const zone = newLayout.zones[action.zone]
      if (zone) {
        const comp = zone.find((c) => c.id === action.componentId)
        if (comp) {
          comp.props = { ...comp.props, ...action.props }
        }
      }
      return { ...state, ...history, layout: newLayout, isDirty: true }
    }

    case 'DUPLICATE_COMPONENT': {
      const zone = state.layout.zones[action.zone]
      if (!zone) return state
      const comp = zone.find((c) => c.id === action.componentId)
      if (!comp) return state
      const duplicate: ComponentInstance = {
        id: generateId(),
        type: comp.type,
        props: structuredClone(comp.props),
      }
      const history = pushHistory(state)
      const newLayout = cloneLayout(state.layout)
      const idx = newLayout.zones[action.zone].findIndex((c) => c.id === action.componentId)
      newLayout.zones[action.zone].splice(idx + 1, 0, duplicate)
      return { ...state, ...history, layout: newLayout, isDirty: true }
    }

    case 'COPY_COMPONENT': {
      const zone = state.layout.zones[action.zone]
      if (!zone) return state
      const comp = zone.find((c) => c.id === action.componentId)
      if (!comp) return state
      return { ...state, clipboard: structuredClone(comp) }
    }

    case 'PASTE_COMPONENT': {
      if (!state.clipboard) return state
      const pasted: ComponentInstance = {
        id: generateId(),
        type: state.clipboard.type,
        props: structuredClone(state.clipboard.props),
      }
      const history = pushHistory(state)
      const newLayout = cloneLayout(state.layout)
      if (!newLayout.zones[action.zone]) {
        newLayout.zones[action.zone] = []
      }
      const idx = action.index ?? newLayout.zones[action.zone].length
      newLayout.zones[action.zone].splice(idx, 0, pasted)
      return { ...state, ...history, layout: newLayout, isDirty: true }
    }

    case 'SELECT_COMPONENT': {
      return { ...state, selectedComponentId: action.componentId, selectedZone: action.zone }
    }

    case 'SET_BREAKPOINT': {
      return { ...state, breakpoint: action.breakpoint }
    }

    case 'UNDO': {
      if (state.undoStack.length === 0) return state
      const newUndo = [...state.undoStack]
      const prev = newUndo.pop()!
      const newRedo = [...state.redoStack, structuredClone(state.layout)]
      return {
        ...state,
        layout: prev,
        undoStack: newUndo,
        redoStack: newRedo,
        isDirty: true,
        selectedComponentId: null,
        selectedZone: null,
      }
    }

    case 'REDO': {
      if (state.redoStack.length === 0) return state
      const newRedo = [...state.redoStack]
      const next = newRedo.pop()!
      const newUndo = [...state.undoStack, structuredClone(state.layout)]
      return {
        ...state,
        layout: next,
        undoStack: newUndo,
        redoStack: newRedo,
        isDirty: true,
        selectedComponentId: null,
        selectedZone: null,
      }
    }

    case 'MARK_SAVED': {
      return { ...state, isDirty: false, undoStack: [], redoStack: [] }
    }

    default:
      return state
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useBuilderState(initialLayout?: BuilderLayout) {
  const defaultLayout: BuilderLayout = initialLayout ?? { zones: {} }

  const [state, dispatch] = useReducer(builderReducer, {
    layout: defaultLayout,
    undoStack: [],
    redoStack: [],
    selectedComponentId: null,
    selectedZone: null,
    breakpoint: 'desktop' as Breakpoint,
    clipboard: null,
    isDirty: false,
  })

  // --- Action creators ---

  const setLayout = useCallback((layout: BuilderLayout) => {
    dispatch({ type: 'SET_LAYOUT', layout })
  }, [])

  const addComponent = useCallback((zone: string, component: ComponentInstance, index?: number) => {
    dispatch({ type: 'ADD_COMPONENT', zone, component, index })
  }, [])

  const removeComponent = useCallback((zone: string, componentId: string) => {
    dispatch({ type: 'REMOVE_COMPONENT', zone, componentId })
  }, [])

  const moveComponent = useCallback(
    (fromZone: string, toZone: string, componentId: string, newIndex: number) => {
      dispatch({ type: 'MOVE_COMPONENT', fromZone, toZone, componentId, newIndex })
    },
    [],
  )

  const updateComponentProps = useCallback(
    (zone: string, componentId: string, props: Record<string, unknown>) => {
      dispatch({ type: 'UPDATE_COMPONENT_PROPS', zone, componentId, props })
    },
    [],
  )

  const duplicateComponent = useCallback((zone: string, componentId: string) => {
    dispatch({ type: 'DUPLICATE_COMPONENT', zone, componentId })
  }, [])

  const copyComponent = useCallback((zone: string, componentId: string) => {
    dispatch({ type: 'COPY_COMPONENT', zone, componentId })
  }, [])

  const pasteComponent = useCallback((zone: string, index?: number) => {
    dispatch({ type: 'PASTE_COMPONENT', zone, index })
  }, [])

  const selectComponent = useCallback((componentId: string | null, zone: string | null) => {
    dispatch({ type: 'SELECT_COMPONENT', componentId, zone })
  }, [])

  const setBreakpoint = useCallback((breakpoint: Breakpoint) => {
    dispatch({ type: 'SET_BREAKPOINT', breakpoint })
  }, [])

  const undo = useCallback(() => dispatch({ type: 'UNDO' }), [])
  const redo = useCallback(() => dispatch({ type: 'REDO' }), [])
  const markSaved = useCallback(() => dispatch({ type: 'MARK_SAVED' }), [])

  const canUndo = state.undoStack.length > 0
  const canRedo = state.redoStack.length > 0

  // Find selected component object
  const selectedComponent = useMemo(() => {
    if (!state.selectedComponentId || !state.selectedZone) return null
    const zone = state.layout.zones[state.selectedZone]
    if (!zone) return null
    return zone.find((c) => c.id === state.selectedComponentId) ?? null
  }, [state.selectedComponentId, state.selectedZone, state.layout])

  return {
    // State
    layout: state.layout,
    selectedComponentId: state.selectedComponentId,
    selectedZone: state.selectedZone,
    selectedComponent,
    breakpoint: state.breakpoint,
    clipboard: state.clipboard,
    isDirty: state.isDirty,
    canUndo,
    canRedo,

    // Actions
    setLayout,
    addComponent,
    removeComponent,
    moveComponent,
    updateComponentProps,
    duplicateComponent,
    copyComponent,
    pasteComponent,
    selectComponent,
    setBreakpoint,
    undo,
    redo,
    markSaved,
  }
}
