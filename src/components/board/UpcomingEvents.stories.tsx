/**
 * @description
 * Storybook stories for the UpcomingEvents component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { UpcomingEvents } from './UpcomingEvents'

const sampleEvents = [
  { id: '1', title: 'Introduction to PS 3450 Webinar', slug: 'ps-3450-webinar', date: '2026-06-10T00:00:00.000Z', type: 'webinar' as const },
  { id: '2', title: 'Board Meeting - Q2 Standards Review', slug: 'q2-meeting', date: '2026-06-15T00:00:00.000Z', type: 'meeting' as const },
  { id: '3', title: 'Public Consultation Deadline', slug: 'consultation-deadline', date: '2026-06-30T00:00:00.000Z', type: 'deadline' as const },
]

const meta = {
  title: 'Board/UpcomingEvents',
  component: UpcomingEvents,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof UpcomingEvents>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    events: sampleEvents,
    boardSlug: 'psab',
  },
}

export const SingleEvent: Story = {
  args: {
    events: [sampleEvents[0]],
    boardSlug: 'acsb',
  },
}

export const Mobile: Story = {
  args: {
    events: sampleEvents,
    boardSlug: 'psab',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const EmptyEvents: Story = {
  args: {
    events: [],
    boardSlug: 'cssb',
  },
}
