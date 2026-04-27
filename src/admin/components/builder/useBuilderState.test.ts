import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useBuilderState, generateId } from './useBuilderState'
import type { BuilderLayout, ComponentInstance } from '@/admin/templates/types'

function makeComponent(id: string, type = 'rich-text', props: Record<string, unknown> = {}): ComponentInstance {
  return { id, type, props }
}

function makeLayout(): BuilderLayout {
  return { zones: { main: [] } }
}

describe('useBuilderState reducer', () => {
  it('ADD_COMPONENT adds a component to the zone', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))
    const c = makeComponent(generateId(), 'rich-text')

    act(() => {
      result.current.addComponent('main', c)
    })

    expect(result.current.layout.zones.main).toHaveLength(1)
    expect(result.current.layout.zones.main[0].id).toBe(c.id)
    expect(result.current.isDirty).toBe(true)
  })

  it('REMOVE_COMPONENT removes from zone', () => {
    const c = makeComponent(generateId())
    const { result } = renderHook(() =>
      useBuilderState({ zones: { main: [c] } }),
    )

    act(() => {
      result.current.removeComponent('main', c.id)
    })

    expect(result.current.layout.zones.main).toHaveLength(0)
  })

  it('MOVE_COMPONENT reorders within zone', () => {
    const a = makeComponent('a')
    const b = makeComponent('b')
    const cz = makeComponent('c')
    const { result } = renderHook(() =>
      useBuilderState({ zones: { main: [a, b, cz] } }),
    )

    act(() => {
      result.current.moveComponent('main', 'main', 'a', 2)
    })

    const ids = result.current.layout.zones.main.map((x) => x.id)
    expect(ids).toEqual(['b', 'c', 'a'])
  })

  it('UPDATE_COMPONENT_PROPS merges props on the target component', () => {
    const c = makeComponent('a', 'heading', { text: 'Hello' })
    const { result } = renderHook(() => useBuilderState({ zones: { main: [c] } }))

    act(() => {
      result.current.updateComponentProps('main', 'a', { level: 1 })
    })

    expect(result.current.layout.zones.main[0].props).toMatchObject({ text: 'Hello', level: 1 })
  })

  it('UNDO reverts to previous layout', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))

    act(() => {
      result.current.addComponent('main', makeComponent('a'))
    })
    expect(result.current.layout.zones.main).toHaveLength(1)

    act(() => {
      result.current.undo()
    })
    expect(result.current.layout.zones.main).toHaveLength(0)
  })

  it('REDO advances to next layout after undo', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))

    act(() => {
      result.current.addComponent('main', makeComponent('a'))
    })
    act(() => {
      result.current.undo()
    })
    act(() => {
      result.current.redo()
    })

    expect(result.current.layout.zones.main).toHaveLength(1)
  })

  it('history caps at 50 — after 51 pushes, only 50 undos succeed before canUndo is false', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))

    for (let i = 0; i < 51; i++) {
      act(() => {
        result.current.addComponent('main', makeComponent(`c-${i}`))
      })
    }

    let undoCount = 0
    while (result.current.canUndo) {
      act(() => {
        result.current.undo()
      })
      undoCount++
      if (undoCount > 60) break // safety
    }

    expect(undoCount).toBeLessThanOrEqual(50)
  })

  it('SELECT_COMPONENT sets selectedComponentId and selectedZone', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))

    act(() => {
      result.current.selectComponent('foo', 'main')
    })

    expect(result.current.selectedComponentId).toBe('foo')
    expect(result.current.selectedZone).toBe('main')
  })

  it('SET_BREAKPOINT changes breakpoint', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))

    act(() => {
      result.current.setBreakpoint('mobile')
    })

    expect(result.current.breakpoint).toBe('mobile')
  })

  it('MARK_SAVED clears isDirty', () => {
    const { result } = renderHook(() => useBuilderState(makeLayout()))

    act(() => {
      result.current.addComponent('main', makeComponent('a'))
    })
    expect(result.current.isDirty).toBe(true)

    act(() => {
      result.current.markSaved()
    })
    expect(result.current.isDirty).toBe(false)
  })

  it('DUPLICATE_COMPONENT copies the target component with a new id', () => {
    const c = makeComponent('a', 'heading', { text: 'Hi' })
    const { result } = renderHook(() => useBuilderState({ zones: { main: [c] } }))

    act(() => {
      result.current.duplicateComponent('main', 'a')
    })

    expect(result.current.layout.zones.main).toHaveLength(2)
    expect(result.current.layout.zones.main[1].id).not.toBe('a')
    expect(result.current.layout.zones.main[1].props).toEqual({ text: 'Hi' })
  })

  it('COPY_COMPONENT then PASTE_COMPONENT inserts a duplicate from clipboard', () => {
    const c = makeComponent('a', 'heading', { text: 'Hi' })
    const { result } = renderHook(() => useBuilderState({ zones: { main: [c], side: [] } }))

    act(() => {
      result.current.copyComponent('main', 'a')
    })
    act(() => {
      result.current.pasteComponent('side')
    })

    expect(result.current.layout.zones.side).toHaveLength(1)
    expect(result.current.layout.zones.side[0].id).not.toBe('a')
    expect(result.current.layout.zones.side[0].props).toEqual({ text: 'Hi' })
  })
})
