/**
 * @description
 * Stories for SupportContactBlock and CpaExplanationBlock.
 *
 * @dependencies
 * - SupportContactBlock: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SupportContactBlock } from './SupportContactBlock'

const meta = {
  title: 'Auth/SupportContactBlock',
  component: SupportContactBlock,
  tags: ['autodocs'],
} satisfies Meta<typeof SupportContactBlock>

export default meta
type Story = StoryObj<typeof meta>

/** Default with sample support info */
export const Default: Story = {
  args: {
    heading: 'Need Help?',
    email: 'customerservice@cpacanada.ca',
    phoneTollFree: '1 (800) 268-3793',
    phoneIntl: '+1 (416) 977-0748',
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    heading: 'Need Help?',
    email: 'customerservice@cpacanada.ca',
    phoneTollFree: '1 (800) 268-3793',
    phoneIntl: '+1 (416) 977-0748',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
