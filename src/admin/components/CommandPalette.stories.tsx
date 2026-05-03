/**
 * Storybook stories for CommandPalette.
 *
 * The palette is hidden until Cmd/Ctrl+K is pressed. Stories use a
 * `play` function to dispatch the keyboard shortcut on mount so the
 * panel is visible in the docs preview.
 *
 * The Pinned group is populated by seeding `cms_favorites` localStorage.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { CommandPalette } from './CommandPalette'

const STORAGE_KEY = 'cms_favorites'

const seed = (items: Array<Record<string, unknown>>) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

const openPalette = () => {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))
}

const meta = {
  title: 'Admin/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof CommandPalette>

export default meta
type Story = StoryObj<typeof meta>

export const Closed: Story = {
  decorators: [
    (Story) => {
      seed([])
      return (
        <div style={{ padding: 24 }}>
          <p style={{ fontSize: 13, color: '#666' }}>
            Palette renders nothing until Cmd/Ctrl+K is pressed.
          </p>
          <Story />
        </div>
      )
    },
  ],
}

export const OpenNoFavorites: Story = {
  decorators: [
    (Story) => {
      seed([])
      // Use rAF to ensure the component is mounted before dispatching the event.
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => openPalette())
      }
      return <Story />
    },
  ],
}

export const OpenWithFavorites: Story = {
  decorators: [
    (Story) => {
      seed([
        {
          id: 'p-1',
          title: 'Homepage',
          collection: 'pages',
          path: '/admin/collections/pages/p-1',
          pinnedAt: '2026-05-01T00:00:00Z',
        },
        {
          id: 'n-1',
          title: 'AcSB Q2 Update',
          collection: 'news',
          path: '/admin/collections/news/n-1',
          pinnedAt: '2026-05-02T00:00:00Z',
        },
      ])
      if (typeof window !== 'undefined') {
        requestAnimationFrame(() => openPalette())
      }
      return <Story />
    },
  ],
}
