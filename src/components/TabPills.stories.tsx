/**
 * @description
 * Storybook stories for TabPills component.
 * Shows all states: default with active tab, inactive tabs, and edge cases.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { TabPills } from './TabPills'

const meta = {
  title: 'UI/TabPills',
  component: TabPills,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof TabPills>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    paramName: 'tab',
    basePath: '/ifrsstandards/documents',
    options: [
      { label: 'Open for Comment', queryValue: 'open-for-comment', isActive: true },
      { label: 'Closed for Comment', queryValue: 'closed-for-comment', isActive: false },
    ],
  },
}

export const ClosedActive: Story = {
  args: {
    paramName: 'tab',
    basePath: '/ifrsstandards/documents',
    options: [
      { label: 'Open for Comment', queryValue: 'open-for-comment', isActive: false },
      { label: 'Closed for Comment', queryValue: 'closed-for-comment', isActive: true },
    ],
  },
}

export const ThreeTabs: Story = {
  args: {
    paramName: 'view',
    basePath: '/resources',
    options: [
      { label: 'All', queryValue: '', isActive: true },
      { label: 'Articles', queryValue: 'articles', isActive: false },
      { label: 'Guidance', queryValue: 'guidance', isActive: false },
    ],
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
