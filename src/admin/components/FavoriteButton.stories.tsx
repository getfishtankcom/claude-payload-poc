/**
 * Storybook stories for FavoriteButton.
 *
 * The button reads/writes from `cms_favorites` localStorage. Stories
 * pre-seed localStorage so the Pinned variant renders in its filled
 * state without a click.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { FavoriteButton } from './FavoriteButton'

const STORAGE_KEY = 'cms_favorites'

const seedFavorites = (items: Array<Record<string, unknown>>) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

const meta = {
  title: 'Admin/FavoriteButton',
  component: FavoriteButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    id: 'page-1',
    title: 'About Us',
    collection: 'pages',
    path: '/admin/collections/pages/page-1',
  },
} satisfies Meta<typeof FavoriteButton>

export default meta
type Story = StoryObj<typeof meta>

export const Unpinned: Story = {
  decorators: [
    (Story) => {
      seedFavorites([])
      return <Story />
    },
  ],
}

export const Pinned: Story = {
  decorators: [
    (Story) => {
      seedFavorites([
        {
          id: 'page-1',
          title: 'About Us',
          collection: 'pages',
          path: '/admin/collections/pages/page-1',
          pinnedAt: '2026-05-01T12:00:00Z',
        },
      ])
      return <Story />
    },
  ],
}

export const LargeIcon: Story = {
  args: { size: 32 },
  decorators: [
    (Story) => {
      seedFavorites([])
      return <Story />
    },
  ],
}
