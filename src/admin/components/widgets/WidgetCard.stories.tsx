/**
 * @description
 * Storybook stories for the WidgetCard shared dashboard widget wrapper.
 * Provides consistent card styling with title, optional badge, and content area.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { WidgetCard } from './WidgetCard'

const meta = {
  title: 'Admin/Widgets/WidgetCard',
  component: WidgetCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof WidgetCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Widget Title',
    testId: 'widget-default',
    children: <p style={{ fontSize: '13px', color: '#888' }}>Widget content goes here</p>,
  },
}

export const WithBadge: Story = {
  args: {
    title: 'Workflow Queue',
    badge: 7,
    testId: 'widget-with-badge',
    children: <p style={{ fontSize: '13px' }}>7 items awaiting action</p>,
  },
}

export const EmptyState: Story = {
  args: {
    title: 'Publishing Schedule',
    testId: 'widget-empty',
    children: <p style={{ fontSize: '13px', color: '#888' }}>No scheduled publishes</p>,
  },
}

export const Mobile: Story = {
  args: {
    title: 'Workflow Queue',
    badge: 3,
    testId: 'widget-mobile',
    children: <p style={{ fontSize: '13px' }}>Mobile viewport</p>,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
