/**
 * @description
 * Storybook stories for the Publishing Schedule dashboard widget.
 * Shows upcoming scheduled publishes grouped by day. Editor/Admin only.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { PublishingScheduleWidget } from './PublishingScheduleWidget'
import { mockScheduledItems } from '@/__mocks__/cms-data'

const meta = {
  title: 'Admin/Widgets/PublishingScheduleWidget',
  component: PublishingScheduleWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => {
      const items = mockScheduledItems()
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
} satisfies Meta<typeof PublishingScheduleWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const EmptySchedule: Story = {
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
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
