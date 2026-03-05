/**
 * @description
 * Storybook stories for ContentTypeBadge component.
 * Shows all 10 content type variants with default and custom labels.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ContentTypeBadge } from './ContentTypeBadge'

const meta = {
  title: 'UI/ContentTypeBadge',
  component: ContentTypeBadge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof ContentTypeBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'standard',
  },
}

export const AllVariants: Story = {
  args: { type: 'standard' },
  render: () => (
    <div className="flex flex-wrap gap-3">
      <ContentTypeBadge type="standard" />
      <ContentTypeBadge type="news" />
      <ContentTypeBadge type="webinar" />
      <ContentTypeBadge type="meeting-summary" />
      <ContentTypeBadge type="guidance" />
      <ContentTypeBadge type="exposure-draft" />
      <ContentTypeBadge type="survey" />
      <ContentTypeBadge type="re-exposure-draft" />
      <ContentTypeBadge type="research" />
      <ContentTypeBadge type="public-comment" />
    </div>
  ),
}

export const CustomLabel: Story = {
  args: {
    type: 'exposure-draft',
    label: 'ED-2025-01',
  },
}

export const Mobile: Story = {
  args: {
    type: 'webinar',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const LongLabel: Story = {
  args: {
    type: 'standard',
    label: 'International Financial Reporting Standard Amendment',
  },
}
