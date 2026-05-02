/**
 * @description
 * Storybook stories for MemberCard component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MemberCard } from './MemberCard'

const meta = {
  title: 'People/MemberCard',
  component: MemberCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof MemberCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    member: {
      name: 'Linda Wei, FCPA, FCA',
      credentials: 'FCPA, FCA',
      role: 'chair',
      roleLabel: 'CHAIR',
      appointedDate: '2024-01-01T00:00:00.000Z',
      termExpires: '2027-12-31T00:00:00.000Z',
      bioPageUrl: '/acsb/about/members/linda-wei',
    },
  },
}

export const ViceChair: Story = {
  args: {
    member: {
      name: 'Maria Garcia, CPA, CA',
      credentials: 'CPA, CA',
      role: 'vice-chair',
      appointedDate: '2024-07-01T00:00:00.000Z',
      termExpires: '2027-06-30T00:00:00.000Z',
      bioPageUrl: '/acsb/about/members/maria-garcia',
    },
  },
}

export const VotingMember: Story = {
  args: {
    member: {
      name: 'Alice Chen, FCPA, FCA, CPA(MI)',
      credentials: 'FCPA, FCA, CPA(MI)',
      role: 'voting-member',
      appointedDate: '2024-01-01T00:00:00.000Z',
      termExpires: '2026-12-31T00:00:00.000Z',
      bioPageUrl: '/acsb/about/members/alice-chen',
    },
  },
}

export const NoPhoto: Story = {
  args: {
    member: {
      name: 'Bob Williams, CPA',
      credentials: 'CPA',
      role: 'voting-member',
      appointedDate: '2023-01-01T00:00:00.000Z',
      termExpires: '2025-12-31T00:00:00.000Z',
    },
  },
}

export const Mobile: Story = {
  args: {
    member: {
      name: 'Linda Wei, FCPA, FCA',
      credentials: 'FCPA, FCA',
      role: 'chair',
      roleLabel: 'CHAIR',
      appointedDate: '2024-01-01T00:00:00.000Z',
      termExpires: '2027-12-31T00:00:00.000Z',
      bioPageUrl: '/acsb/about/members/linda-wei',
    },
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
