/**
 * Stories for NewToRas CTA section — compact banner with heading, text,
 * and action button.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NewToRas } from './NewToRas'

const meta = {
  title: 'Homepage/NewToRas',
  component: NewToRas,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NewToRas>

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
