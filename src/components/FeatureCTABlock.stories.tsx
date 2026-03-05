/**
 * @description
 * Storybook stories for FeatureCTABlock component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { FeatureCTABlock } from './FeatureCTABlock'

const meta = {
  title: 'Standards/FeatureCTABlock',
  component: FeatureCTABlock,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof FeatureCTABlock>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    cards: [
      {
        heading: 'CPA Canada Handbook',
        description: 'Access the authoritative source for Canadian accounting, auditing, and assurance standards.',
        buttonLabel: 'Access Handbook',
        buttonHref: '/handbook',
        variant: 'light',
      },
      {
        heading: 'Submit an Issue',
        description: 'Have an issue or question related to IFRS Standards? Submit it for the AcSB\'s consideration.',
        buttonLabel: 'Submit an Issue',
        buttonHref: '/submit-issue',
        variant: 'dark-purple',
      },
    ],
  },
}

export const SingleLight: Story = {
  args: {
    cards: [
      {
        heading: 'CPA Canada Handbook',
        description: 'Access the authoritative source for Canadian accounting standards.',
        buttonLabel: 'Access Handbook',
        buttonHref: '/handbook',
        variant: 'light',
      },
    ],
  },
}

export const SingleDark: Story = {
  args: {
    cards: [
      {
        heading: 'Submit an Issue',
        description: 'Have an issue or question? Submit it for consideration.',
        buttonLabel: 'Submit an Issue',
        buttonHref: '/submit-issue',
        variant: 'dark-purple',
      },
    ],
  },
}

export const Mobile: Story = {
  args: {
    cards: [
      {
        heading: 'CPA Canada Handbook',
        description: 'Access the authoritative source for Canadian accounting standards.',
        buttonLabel: 'Access Handbook',
        buttonHref: '/handbook',
        variant: 'light',
      },
      {
        heading: 'Submit an Issue',
        description: 'Have an issue or question? Submit it for consideration.',
        buttonLabel: 'Submit an Issue',
        buttonHref: '/submit-issue',
        variant: 'dark-purple',
      },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const Empty: Story = {
  args: {
    cards: [],
  },
}
