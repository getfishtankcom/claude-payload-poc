/**
 * @description
 * Stories for MediaInquiriesBlock — contact card for media inquiries.
 *
 * @dependencies
 * - MediaInquiriesBlock: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MediaInquiriesBlock } from './MediaInquiriesBlock'

const meta = {
  title: 'Forms/MediaInquiriesBlock',
  component: MediaInquiriesBlock,
  tags: ['autodocs'],
} satisfies Meta<typeof MediaInquiriesBlock>

export default meta
type Story = StoryObj<typeof meta>

/** Default with sample contact */
export const Default: Story = {
  args: {
    heading: 'Media Inquiries',
    contactName: 'Daniella Girgenti, CMP',
    contactTitle: 'Director of Communications',
    contactEmail: 'dgirgenti@frascanada.ca',
    contactPhone: '416-204-3456',
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    heading: 'Media Inquiries',
    contactName: 'Daniella Girgenti, CMP',
    contactTitle: 'Director of Communications',
    contactEmail: 'dgirgenti@frascanada.ca',
    contactPhone: '416-204-3456',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

/** Long name and title */
export const LongContent: Story = {
  args: {
    heading: 'Media Inquiries and Press Relations',
    contactName: 'Dr. Alexandrina Konstantinopolous-Williams, MBA, CPA, CA, FCMA',
    contactTitle: 'Senior Vice President, Corporate Communications and External Affairs',
    contactEmail: 'alexandrina.konstantinopolous-williams@frascanada.ca',
    contactPhone: '+1 (416) 204-3456 ext. 1234',
  },
}
