/**
 * @description
 * Regression tests for `<NotificationBell>` covering issue #86 (QA-016):
 * the dropdown panel must be opaque (no Payload `--theme-elevation-*`
 * leak), anchored to the bell's LEFT edge so it extends rightward into
 * the viewport (not leftward off-screen), and z-indexed above any
 * dashboard widget.
 *
 * @notes
 * - We mock `@payloadcms/ui`'s `useAuth` so the bell renders without a
 *   real Payload provider. `fetch` is also stubbed to return an empty
 *   notifications list — we don't care about the data path here, only
 *   the panel's structural styles.
 */

import * as React from 'react'
import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@payloadcms/ui', () => ({
  useAuth: () => ({ user: { id: 'editor-1', email: 'editor@frascanada.ca' } }),
}))

import { NotificationBell } from './NotificationBell'

beforeEach(() => {
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(
    new Response(JSON.stringify({ docs: [] }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }),
  )
})

afterEach(() => {
  vi.restoreAllMocks()
})

const openPanel = async () => {
  const bell = await screen.findByRole('button', { name: /Notifications/ })
  act(() => {
    bell.click()
  })
}

describe('<NotificationBell>', () => {
  it('does not render the panel until the bell is clicked', async () => {
    render(<NotificationBell />)
    expect(screen.queryByTestId('notification-panel')).toBeNull()
  })

  it('opens the panel on bell click and exposes role=dialog', async () => {
    render(<NotificationBell />)
    await openPanel()
    expect(screen.getByTestId('notification-panel')).toBeInTheDocument()
    expect(screen.getByRole('dialog', { name: /Notifications/ })).toBeInTheDocument()
  })

  it('anchors the panel to the bell LEFT edge so it extends rightward (#86)', async () => {
    render(<NotificationBell />)
    await openPanel()
    const panel = screen.getByTestId('notification-panel') as HTMLDivElement
    expect(panel.style.left).toBe('0px')
    expect(panel.style.right).toBe('auto')
    // Width is fixed; it has to fit to the right of the bell rather than
    // overflow the left edge — the original `right: 0` rule did the
    // opposite.
    expect(panel.style.width).toBe('320px')
  })

  it('paints the panel with admin-shell tokens (no Payload elevation var)', async () => {
    render(<NotificationBell />)
    await openPanel()
    const panel = screen.getByTestId('notification-panel') as HTMLDivElement
    expect(panel.style.background).toBe('var(--surface-page)')
    expect(panel.style.color).toBe('var(--text-primary)')
    expect(panel.style.background).not.toContain('--theme-elevation')
    expect(panel.style.color).not.toContain('--theme-elevation')
  })

  it('z-indexes the panel above dashboard widgets and below the Cmd+K palette', async () => {
    render(<NotificationBell />)
    await openPanel()
    const panel = screen.getByTestId('notification-panel') as HTMLDivElement
    const z = Number(panel.style.zIndex)
    // Loose bounds: above any widget shadow / sticky toolbar (≥ 1000),
    // below the command palette backdrop at 10001.
    expect(z).toBeGreaterThanOrEqual(1000)
    expect(z).toBeLessThan(10001)
  })
})
