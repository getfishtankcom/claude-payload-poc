/**
 * @description
 * Storybook stories for PageHeader component.
 * Shows title-only, with subtitle, with icon, and mobile variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { PageHeader } from './PageHeader'

const meta = {
  title: 'UI/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    title: 'Active Projects',
  },
}

export const WithSubtitle: Story = {
  args: {
    title: 'Active Projects',
    subtitle: 'Browse all active standard-setting projects across Canadian boards.',
  },
}

export const WithIcon: Story = {
  args: {
    title: 'Open Consultations',
    subtitle: 'Review and respond to exposure drafts and surveys.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
      </svg>
    ),
  },
}

export const Mobile: Story = {
  args: {
    title: 'Board Detail',
    subtitle: 'Accounting Standards Board — Setting standards for private enterprises in Canada.',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const LongTitle: Story = {
  args: {
    title: 'International Financial Reporting Standards for Private Enterprises',
    subtitle: 'A comprehensive overview of all current projects, consultations, and related resources.',
  },
}
