/**
 * @description
 * Storybook stories for DarkPurpleCTA component.
 * Shows the "How to Reply" block with contact details and CTA button.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { DarkPurpleCTA } from './DarkPurpleCTA'

const meta = {
  title: 'UI/DarkPurpleCTA',
  component: DarkPurpleCTA,
  tags: ['autodocs'],
} satisfies Meta<typeof DarkPurpleCTA>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    heading: 'How to Reply',
    body: null,
    ctaLabel: 'Submit comment',
    ctaHref: '/submit-comment',
    contactName: 'Andrew White, CPA, CA',
    contactTitle: 'Director, Accounting Standards',
    contactAddress: null,
    contactEmail: 'awhite@frascanada.ca',
  },
}

export const WithAllFields: Story = {
  args: {
    heading: 'How to Reply',
    body: null,
    ctaLabel: 'Submit your response',
    ctaHref: '/submit-response',
    contactName: 'Sarah Johnson, CPA, CA',
    contactTitle: 'Principal, Accounting Standards',
    contactAddress: null,
    contactEmail: 'sjohnson@frascanada.ca',
  },
}

export const MinimalFields: Story = {
  args: {
    heading: 'How to Reply',
    body: null,
    ctaLabel: 'Submit comment',
    ctaHref: '/submit',
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
