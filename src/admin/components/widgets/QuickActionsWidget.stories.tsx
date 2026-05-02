/**
 * @description
 * Storybook stories for the Quick Actions dashboard widget.
 * Shows create shortcuts for Page, News, Project, Event.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { QuickActionsWidget } from './QuickActionsWidget'

const meta = {
  title: 'Admin/Widgets/QuickActionsWidget',
  component: QuickActionsWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof QuickActionsWidget>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
