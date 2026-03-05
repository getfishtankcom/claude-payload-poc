/**
 * @description
 * Stories for CpaExplanationBlock — CPA Canada shared auth explanation.
 *
 * @dependencies
 * - CpaExplanationBlock: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { CpaExplanationBlock } from './CpaExplanationBlock'
import React from 'react'

const meta = {
  title: 'Auth/CpaExplanationBlock',
  component: CpaExplanationBlock,
  tags: ['autodocs'],
} satisfies Meta<typeof CpaExplanationBlock>

export default meta
type Story = StoryObj<typeof meta>

/** Default with sample explanation */
export const Default: Story = {
  args: {
    content: (
      <p>
        FRAS Canada uses the CPA Canada authentication system. If you already
        have a CPA Canada account, you can use those same credentials to log in here.
        Your account provides access to member-only features including comment submissions,
        event registration, and volunteer opportunities.
      </p>
    ),
    cpaLoginUrl: 'https://www.cpacanada.ca/en/login',
  },
}

/** Without CPA login link */
export const WithoutLink: Story = {
  args: {
    content: (
      <p>
        Authentication is handled through our shared partner system.
        Contact support if you need assistance accessing your account.
      </p>
    ),
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    content: (
      <p>
        FRAS Canada uses the CPA Canada authentication system.
        Use your existing CPA credentials to log in.
      </p>
    ),
    cpaLoginUrl: 'https://www.cpacanada.ca/en/login',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
