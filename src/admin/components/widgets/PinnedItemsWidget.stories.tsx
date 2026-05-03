/**
 * Storybook stories for PinnedItemsWidget.
 *
 * Stories pre-seed `cms_favorites` localStorage to render Empty,
 * WithItems, and AtLimit (10 items) variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { PinnedItemsWidget } from './PinnedItemsWidget'

const STORAGE_KEY = 'cms_favorites'

const seed = (items: Array<Record<string, unknown>>) => {
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }
}

const sampleItem = (i: number) => ({
  id: `page-${i}`,
  title: `Sample doc ${i}`,
  collection: i % 2 === 0 ? 'pages' : 'news',
  path: `/admin/collections/pages/page-${i}`,
  pinnedAt: new Date(Date.UTC(2026, 4, i + 1)).toISOString(),
})

const meta = {
  title: 'Admin/Widgets/PinnedItemsWidget',
  component: PinnedItemsWidget,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div style={{ width: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PinnedItemsWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Empty: Story = {
  decorators: [
    (Story) => {
      seed([])
      return <Story />
    },
  ],
}

export const WithItems: Story = {
  decorators: [
    (Story) => {
      seed([sampleItem(1), sampleItem(2), sampleItem(3)])
      return <Story />
    },
  ],
}

export const AtTenItems: Story = {
  decorators: [
    (Story) => {
      seed(Array.from({ length: 10 }, (_, i) => sampleItem(i + 1)))
      return <Story />
    },
  ],
}
