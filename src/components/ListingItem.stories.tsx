/**
 * @description
 * Storybook stories for ListingItem component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ListingItem } from './ListingItem'

const meta = {
  title: 'UI/ListingItem',
  component: ListingItem,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof ListingItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    item: {
      date: '2026-02-15T00:00:00.000Z',
      categories: ['Guidance'],
      title: 'Guide to Applying ASPE Section 3856',
      href: '/resources/guide-aspe-section-3856',
      excerpt: 'A practical guide to help preparers apply the financial instruments standard under Part II of the CPA Canada Handbook.',
    },
  },
}

export const MultipleBadges: Story = {
  args: {
    item: {
      date: '2026-01-28T00:00:00.000Z',
      categories: ['Article', 'Guidance'],
      title: 'Climate-related Disclosures Framework',
      href: '/resources/climate-disclosures',
      excerpt: 'Comprehensive framework for organizations to report climate-related financial disclosures.',
    },
  },
}

export const ExternalLink: Story = {
  args: {
    item: {
      date: '2026-02-05T00:00:00.000Z',
      categories: ['Webinar'],
      title: 'Understanding the New Revenue Recognition Standard',
      href: 'https://example.com/webinar',
      excerpt: 'Join our webinar to learn about the proposed changes to revenue recognition.',
      isExternal: true,
    },
  },
}

export const LongTitle: Story = {
  args: {
    item: {
      date: '2026-01-10T00:00:00.000Z',
      categories: ['In Brief'],
      title: 'AcSB In Brief: Proposed Amendments to Accounting Standards for Private Enterprises — Financial Instruments Section 3856 Hedge Accounting',
      href: '/resources/acsb-in-brief',
      excerpt: 'A summary of the proposed amendments to the hedge accounting requirements.',
    },
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
