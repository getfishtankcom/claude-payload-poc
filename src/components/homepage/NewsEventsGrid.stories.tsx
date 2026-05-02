/**
 * @description
 * Stories for NewsEventsGrid — 3-column grid showing news, exposure drafts, and events.
 * Uses mock data factories from cms-data.ts.
 *
 * @dependencies
 * - NewsEventsGrid: Component under test
 * - Mock data factories: mockNewsList, mockEventsList, mockDocumentForCommentList
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NewsEventsGrid } from './NewsEventsGrid'
import {
  mockNewsList,
  mockEventsList,
  mockDocumentForCommentList,
} from '@/__mocks__/cms-data'

const meta = {
  title: 'Homepage/NewsEventsGrid',
  component: NewsEventsGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof NewsEventsGrid>

export default meta
type Story = StoryObj<typeof meta>

/** Default with populated data — 3 news, 3 exposure drafts, 3 events */
export const Default: Story = {
  args: {
    news: mockNewsList(3),
    exposureDrafts: mockDocumentForCommentList(3),
    events: mockEventsList(3),
  },
}

/** All columns populated with maximum items */
export const FullData: Story = {
  args: {
    news: mockNewsList(5),
    exposureDrafts: mockDocumentForCommentList(3),
    events: mockEventsList(5),
  },
}

/** Empty state — no CMS data available */
export const Empty: Story = {
  args: {
    news: [],
    exposureDrafts: [],
    events: [],
  },
}

/** Partial data — only news available */
export const OnlyNews: Story = {
  args: {
    news: mockNewsList(3),
    exposureDrafts: [],
    events: [],
  },
}

/** Mobile viewport — columns stack vertically */
export const Mobile: Story = {
  args: {
    news: mockNewsList(3),
    exposureDrafts: mockDocumentForCommentList(3),
    events: mockEventsList(3),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
