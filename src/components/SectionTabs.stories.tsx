/**
 * @description
 * Storybook stories for SectionTabs component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SectionTabs } from './SectionTabs'

const meta = {
  title: 'Content/SectionTabs',
  component: SectionTabs,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SectionTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tabs: [
      { label: 'Overview', href: '/ifrsstandards', isActive: true },
      { label: 'Project Listing', href: '/ifrsstandards/projects', isActive: false },
      { label: 'Documents for Comment', href: '/ifrsstandards/documents', isActive: false },
      { label: 'Effective Dates', href: '/ifrsstandards/effective-dates', isActive: false },
      { label: 'Resources', href: '/ifrsstandards/resources', isActive: false },
    ],
  },
}

export const SixTabs: Story = {
  args: {
    tabs: [
      { label: 'Overview', href: '/ifrsstandards', isActive: true },
      { label: 'Project Listing', href: '/ifrsstandards/projects', isActive: false },
      { label: 'Documents for Comment', href: '/ifrsstandards/documents', isActive: false },
      { label: 'Effective Dates', href: '/ifrsstandards/effective-dates', isActive: false },
      { label: 'Resources', href: '/ifrsstandards/resources', isActive: false },
      { label: 'IFRIC Agenda Decisions', href: '/ifrsstandards/ifric', isActive: false },
    ],
  },
}

export const MiddleTabActive: Story = {
  args: {
    tabs: [
      { label: 'Overview', href: '/aspe', isActive: false },
      { label: 'Project Listing', href: '/aspe/projects', isActive: false },
      { label: 'Documents for Comment', href: '/aspe/documents', isActive: true },
      { label: 'Effective Dates', href: '/aspe/effective-dates', isActive: false },
      { label: 'Resources', href: '/aspe/resources', isActive: false },
    ],
  },
}

export const Mobile: Story = {
  args: {
    tabs: [
      { label: 'Overview', href: '/ifrsstandards', isActive: true },
      { label: 'Project Listing', href: '/ifrsstandards/projects', isActive: false },
      { label: 'Documents for Comment', href: '/ifrsstandards/documents', isActive: false },
      { label: 'Effective Dates', href: '/ifrsstandards/effective-dates', isActive: false },
      { label: 'Resources', href: '/ifrsstandards/resources', isActive: false },
      { label: 'IFRIC Agenda Decisions', href: '/ifrsstandards/ifric', isActive: false },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const EmptyTabs: Story = {
  args: {
    tabs: [],
  },
}
