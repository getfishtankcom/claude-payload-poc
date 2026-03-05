/**
 * @description
 * Storybook stories for StaffContactCard component.
 * Shows Default, multiple contacts, and edge cases.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { StaffContactCard } from './StaffContactCard'

const meta = {
  title: 'Content/StaffContactCard',
  component: StaffContactCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof StaffContactCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    contacts: [
      {
        name: 'Andrew White, CPA, CA',
        title: 'Director, Accounting Standards',
        phone: '+1 416 204 3456',
        email: 'awhite@frascanada.ca',
      },
    ],
  },
}

export const MultipleContacts: Story = {
  args: {
    contacts: [
      {
        name: 'Andrew White, CPA, CA',
        title: 'Director, Accounting Standards',
        phone: '+1 416 204 3456',
        email: 'awhite@frascanada.ca',
      },
      {
        name: 'Jane Doe, CPA',
        title: 'Director, Research Program',
        phone: '+1 416 204 3500',
        email: 'jdoe@frascanada.ca',
      },
    ],
  },
}

export const Mobile: Story = {
  args: {
    contacts: [
      {
        name: 'Andrew White, CPA, CA',
        title: 'Director, Accounting Standards',
        phone: '+1 416 204 3456',
        email: 'awhite@frascanada.ca',
      },
    ],
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const NoContacts: Story = {
  args: {
    contacts: [],
  },
}
