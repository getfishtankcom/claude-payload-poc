/**
 * @description
 * Regression tests for `<CommandPalette>` covering issue #87 (QA-017): the
 * backdrop must dim the viewport with the admin-shell `--surface-overlay`
 * token (so dashboard widgets visibly recede), and the panel must paint
 * with an opaque admin-shell token (so it stays solid even when Payload's
 * `--theme-elevation-*` vars aren't in scope).
 *
 * @notes
 * - jsdom does not compute resolved CSS values for `var(--…)` references,
 *   so we assert on the inline-style strings React writes to the DOM.
 *   That's enough to lock in the structural fix.
 * - We open the palette by dispatching the global Cmd+K shortcut rather
 *   than poking internal state, so the test exercises the real UX.
 */

import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import { CommandPalette } from './CommandPalette'

// `cmdk` exercises a couple of browser APIs jsdom does not implement
// (`ResizeObserver`, `Element#scrollIntoView`). Stub them locally so this
// test file stays self-contained.
beforeAll(() => {
  if (typeof globalThis.ResizeObserver === 'undefined') {
    class StubResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
    ;(globalThis as { ResizeObserver?: unknown }).ResizeObserver = StubResizeObserver
  }
  if (typeof Element.prototype.scrollIntoView !== 'function') {
    Element.prototype.scrollIntoView = function scrollIntoView() {}
  }
})

afterEach(() => {
  // Each test toggles the palette open via Cmd+K; the component itself
  // doesn't unmount, so we tear it down by dispatching another Cmd+K.
  // RTL's automatic cleanup also unmounts between tests.
  vi.restoreAllMocks()
})

const openPalette = () => {
  act(() => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'k', metaKey: true }),
    )
  })
}

describe('<CommandPalette>', () => {
  it('renders nothing when closed', () => {
    render(<CommandPalette />)
    expect(screen.queryByTestId('command-palette-backdrop')).toBeNull()
  })

  it('opens on Cmd+K and exposes a backdrop + panel', () => {
    render(<CommandPalette />)
    openPalette()
    expect(screen.getByTestId('command-palette-backdrop')).toBeInTheDocument()
    expect(screen.getByTestId('command-palette-panel')).toBeInTheDocument()
  })

  it('paints the backdrop with the admin-shell overlay token (#87)', () => {
    render(<CommandPalette />)
    openPalette()
    const backdrop = screen.getByTestId('command-palette-backdrop') as HTMLDivElement
    // CSS variables in the inline-style string come through verbatim.
    expect(backdrop.style.background).toBe('var(--surface-overlay)')
    // Lock the dimming + blur so future "lighter overlay" tweaks must be
    // explicit rather than accidental regressions.
    expect(backdrop.style.backdropFilter).toContain('blur')
    expect(backdrop.style.zIndex).toBe('10001')
  })

  it('paints the panel with an opaque admin-shell token (no Payload elevation var)', () => {
    render(<CommandPalette />)
    openPalette()
    const panel = screen.getByTestId('command-palette-panel') as HTMLDivElement
    expect(panel.style.background).toBe('var(--surface-page)')
    // The Payload elevation var was the original bug surface — it must not
    // come back as the panel background or the modal can render translucent
    // again on routes where Payload providers haven't run.
    expect(panel.style.background).not.toContain('--theme-elevation')
  })

  it('closes when the backdrop is clicked', () => {
    render(<CommandPalette />)
    openPalette()
    act(() => {
      screen.getByTestId('command-palette-backdrop').click()
    })
    expect(screen.queryByTestId('command-palette-backdrop')).toBeNull()
  })
})
