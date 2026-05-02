/**
 * @description
 * Storybook stories for NewsItem component.
 * Shows default, without excerpt, with board info, and mobile variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { NewsItem } from './NewsItem'
import { mockNews } from '@/__mocks__/cms-data'

const sampleNews = mockNews()

const meta = {
  title: 'UI/NewsItem',
  component: NewsItem,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof NewsItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    news: {
      title: sampleNews.title,
      date: sampleNews.publishedDate,
      excerpt: sampleNews.summary,
      slug: sampleNews.slug,
      category: sampleNews.category,
      board: { abbreviation: sampleNews.board.abbreviation },
    },
  },
}

export const WithoutExcerpt: Story = {
  args: {
    news: {
      title: 'PSAB Issues New Public Sector Accounting Guideline',
      date: '2026-03-01T00:00:00.000Z',
      excerpt: 'The Public Sector Accounting Board has released a new guideline.',
      slug: 'psab-new-guideline',
      board: { abbreviation: 'PSAB' },
    },
    showExcerpt: false,
  },
}

export const LongExcerpt: Story = {
  args: {
    news: {
      title: 'AcSB Announces Major Update to Revenue Recognition Standard',
      date: '2026-02-20T00:00:00.000Z',
      excerpt:
        'The Accounting Standards Board has published a comprehensive update to the revenue recognition standard for not-for-profit organizations. This update addresses feedback received during the extended comment period and introduces several significant changes to the measurement and disclosure requirements that will affect how organizations report their revenue streams.',
      slug: 'acsb-revenue-recognition-update',
      board: { abbreviation: 'AcSB' },
    },
  },
}

export const NewsList: Story = {
  args: {
    news: {
      title: sampleNews.title,
      date: sampleNews.publishedDate,
      excerpt: sampleNews.summary,
      slug: sampleNews.slug,
    },
  },
  render: () => {
    const items = [
      { title: 'AcSB Publishes New Exposure Draft', date: '2026-02-15T00:00:00.000Z', excerpt: 'New standards for financial instruments.', slug: 'acsb-ed-financial', board: { abbreviation: 'AcSB' } },
      { title: 'PSAB Survey on Revenue Standard', date: '2026-02-10T00:00:00.000Z', excerpt: 'Seeking stakeholder input.', slug: 'psab-survey-revenue', board: { abbreviation: 'PSAB' } },
      { title: 'CSSB Climate Disclosure Update', date: '2026-02-05T00:00:00.000Z', excerpt: 'Progress on sustainability standards.', slug: 'cssb-climate-update', board: { abbreviation: 'CSSB' } },
    ]
    return (
      <div className="flex flex-col gap-6 max-w-xl">
        {items.map((news) => (
          <NewsItem key={news.slug} news={news} />
        ))}
      </div>
    )
  },
}

export const Mobile: Story = {
  args: {
    news: {
      title: 'AASB Updates Guidance on Group Audits',
      date: '2026-01-28T00:00:00.000Z',
      excerpt: 'Updated guidance for group audit engagements.',
      slug: 'aasb-group-audits',
      board: { abbreviation: 'AASB' },
    },
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
