/**
 * @description
 * Storybook stories for the QuickActions component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { QuickActions } from './QuickActions'

const meta = {
  title: 'Board/QuickActions',
  component: QuickActions,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof QuickActions>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    actions: [
      { label: 'CPA Canada Handbook', url: 'https://www.knotia.ca/Knowledge/Home.aspx', icon: null },
      { label: 'View Implementation Tools', url: '/resources/implementation-tools', icon: null },
      { label: 'Explore Webinars', url: '/events?type=webinar', icon: null },
    ],
  },
}

export const WithExternalLinks: Story = {
  args: {
    actions: [
      { label: 'CPA Canada Handbook', url: 'https://www.knotia.ca/Knowledge/Home.aspx', icon: null },
      { label: 'IFRS Website', url: 'https://www.ifrs.org', icon: null },
      { label: 'Internal Resources', url: '/resources', icon: null },
    ],
  },
}

export const SingleAction: Story = {
  args: {
    actions: [
      { label: 'Submit Comment', url: '/consultations/submit', icon: null },
    ],
  },
}

export const Mobile: Story = {
  args: {
    actions: [
      { label: 'CPA Canada Handbook', url: 'https://www.knotia.ca', icon: null },
      { label: 'View Implementation Tools', url: '/resources', icon: null },
      { label: 'Explore Webinars', url: '/events?type=webinar', icon: null },
    ],
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const EmptyActions: Story = {
  args: {
    actions: [],
  },
}
