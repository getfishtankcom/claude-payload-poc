/**
 * @description
 * Storybook stories for the RecentNews component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { RecentNews } from './RecentNews'

const sampleNews = [
  { title: 'PSAB Announces New Public Consultation Period', date: '2026-06-15T00:00:00.000Z', excerpt: 'The Public Sector Accounting Board has opened a new consultation period for proposed changes to asset retirement obligations.', slug: 'psab-new-consultation' },
  { title: 'Implementation Guide for PS 3450 Now Available', date: '2026-06-08T00:00:00.000Z', excerpt: 'A comprehensive guide to help public sector entities implement the new financial instruments standard.', slug: 'ps-3450-guide' },
  { title: 'PSAB Board Meeting Summary - May 2025', date: '2026-05-30T00:00:00.000Z', excerpt: 'Summary of decisions and discussions from the May 2025 board meeting.', slug: 'psab-may-meeting' },
  { title: 'New Effective Dates for Asset Retirement Obligations', date: '2026-05-22T00:00:00.000Z', excerpt: 'The board has approved revised effective dates for the asset retirement obligations standard.', slug: 'aro-effective-dates' },
]

const meta = {
  title: 'Board/RecentNews',
  component: RecentNews,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RecentNews>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    news: sampleNews,
    boardSlug: 'psab',
  },
}

export const SingleItem: Story = {
  args: {
    news: [sampleNews[0]],
    boardSlug: 'acsb',
  },
}

export const Mobile: Story = {
  args: {
    news: sampleNews,
    boardSlug: 'psab',
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const EmptyNews: Story = {
  args: {
    news: [],
    boardSlug: 'cssb',
  },
}
