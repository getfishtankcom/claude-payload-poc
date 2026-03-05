/**
 * @description
 * Storybook stories for TabToggle component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { TabToggle } from './TabToggle'

const meta = {
  title: 'UI/TabToggle',
  component: TabToggle,
  tags: ['autodocs'],
} satisfies Meta<typeof TabToggle>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    options: [
      { label: 'Upcoming', value: 'upcoming', isActive: false },
      { label: 'Past', value: 'past', isActive: true },
    ],
    onChange: () => {},
  },
}

export const UpcomingActive: Story = {
  args: {
    options: [
      { label: 'Upcoming', value: 'upcoming', isActive: true },
      { label: 'Past', value: 'past', isActive: false },
    ],
    onChange: () => {},
  },
}

export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
