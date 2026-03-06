/**
 * @description
 * Storybook stories for the My Recent Items dashboard widget.
 * Shows last 10 items the current user edited with relative timestamps.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { RecentItemsWidget } from './RecentItemsWidget'
import { mockRecentItems } from '@/__mocks__/cms-data'

const meta = {
  title: 'Admin/Widgets/RecentItemsWidget',
  component: RecentItemsWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      const items = mockRecentItems()
      const originalFetch = window.fetch
      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/pages')) {
          return new Response(JSON.stringify({ docs: items, totalDocs: items.length }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return originalFetch(input)
      }
      return <Story />
    },
  ],
} satisfies Meta<typeof RecentItemsWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    userId: '1',
  },
}

export const EmptyState: Story = {
  args: {
    userId: '1',
  },
  decorators: [
    (Story) => {
      const originalFetch = window.fetch
      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/pages')) {
          return new Response(JSON.stringify({ docs: [], totalDocs: 0 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return originalFetch(input)
      }
      return <Story />
    },
  ],
}

export const Mobile: Story = {
  args: {
    userId: '1',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
