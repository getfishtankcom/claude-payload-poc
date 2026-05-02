/**
 * @description
 * Storybook stories for NewsletterCTA component.
 * Shows default state, with description, on dark background, and mobile.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NewsletterCTA } from './NewsletterCTA'

const meta = {
  title: 'UI/NewsletterCTA',
  component: NewsletterCTA,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof NewsletterCTA>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}

export const WithDescription: Story = {
  args: {
    heading: 'Stay informed with our weekly updates',
    description: 'Get critical updates on regulatory changes and new standard releases.',
  },
}

export const CustomHeading: Story = {
  args: {
    heading: 'Subscribe to the RAS Canada Newsletter',
    description: 'Join 3,000+ finance professionals who trust our updates.',
  },
}

export const Mobile: Story = {
  args: {
    heading: 'Stay informed',
    description: 'Get updates on standards and regulations.',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const OnDarkBackground: Story = {
  render: () => (
    <div className="bg-gray-900 p-8 rounded-lg">
      <NewsletterCTA
        heading="Stay informed with our weekly updates"
        description="Get critical updates on regulatory changes."
        className="text-white [&_h2]:text-white [&_p]:text-gray-300"
      />
    </div>
  ),
}
