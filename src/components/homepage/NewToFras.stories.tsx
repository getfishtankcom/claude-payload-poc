/**
 * @description
 * Stories for NewToFras CTA section — compact banner with heading, text, and action button.
 *
 * @dependencies
 * - NewToFras: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NewToFras } from './NewToFras'

const meta = {
  title: 'Homepage/NewToFras',
  component: NewToFras,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NewToFras>

export default meta
type Story = StoryObj<typeof meta>

/** Default CTA with standard content */
export const Default: Story = {}

/** Custom content from CMS global */
export const CustomContent: Story = {
  args: {
    heading: 'First time here?',
    description: 'Explore our standards and resources to get started.',
    buttonText: 'Learn More',
    buttonUrl: '/getting-started',
  },
}

/** Mobile viewport — button stacks below text */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}

/** Long description edge case */
export const LongDescription: Story = {
  args: {
    description: 'Whether you are a financial reporting professional, auditor, student, or sustainability standards stakeholder, we have resources to help you understand Canadian accounting and assurance standards.',
  },
}
