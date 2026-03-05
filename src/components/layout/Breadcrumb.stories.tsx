/**
 * @description
 * Storybook stories for Breadcrumb component.
 * Shows auto-generated and custom override breadcrumbs.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Breadcrumb } from './Breadcrumb'

const meta = {
  title: 'Layout/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/boards/acsb/projects',
      },
    },
  },
} satisfies Meta<typeof Breadcrumb>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const CustomItems: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Boards', href: '/boards' },
      { label: 'AcSB', href: '/boards/acsb' },
      { label: 'Active Projects' },
    ],
  },
}

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'News' },
    ],
  },
}

export const DeepNesting: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Boards', href: '/boards' },
      { label: 'PSAB', href: '/boards/psab' },
      { label: 'Projects', href: '/boards/psab/projects' },
      { label: 'Revenue Recognition' },
    ],
  },
}

export const Mobile: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Boards', href: '/boards' },
      { label: 'Accounting Standards Board' },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
