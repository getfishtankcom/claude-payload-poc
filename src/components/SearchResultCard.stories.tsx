/**
 * @description
 * Storybook stories for SearchResultCard component.
 * Covers all content types and file info variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SearchResultCard } from './SearchResultCard'

const meta: Meta<typeof SearchResultCard> = {
  title: 'Components/SearchResultCard',
  component: SearchResultCard,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof SearchResultCard>

export const NewsResult: Story = {
  args: {
    contentType: 'news',
    board: 'AcSB',
    date: 'March 15, 2026',
    title: 'AcSB Issues New Guidance on Revenue Recognition',
    href: '/news/acsb-revenue-recognition',
    description:
      'The Accounting Standards Board has published updated guidance on revenue recognition under IFRS 15, addressing implementation challenges raised by stakeholders.',
  },
}

export const DocumentResult: Story = {
  args: {
    contentType: 'resource',
    board: 'PSAB',
    date: 'February 28, 2026',
    title: 'Public Sector Accounting Handbook Update 2026',
    href: '/resources/psab-handbook-2026',
    description:
      'Comprehensive update to the Public Sector Accounting Handbook including amendments to Section PS 3400 Revenue.',
    fileType: 'PDF',
    fileSize: '2.4 MB',
  },
}

export const WebinarResult: Story = {
  args: {
    contentType: 'webinar',
    board: 'CSSB',
    date: 'January 10, 2026',
    title: 'Understanding CSDS 1 — General Requirements for Sustainability Disclosures',
    href: '/events/cssb-csds1-webinar',
    description:
      'Join CSSB members for a deep dive into the first Canadian Sustainability Disclosure Standard.',
  },
}

export const ConsultationResult: Story = {
  args: {
    contentType: 'consultation',
    board: 'AcSB',
    date: 'March 1, 2026',
    title: 'Exposure Draft: Amendments to IFRS 16 — Lease Liability in a Sale and Leaseback',
    href: '/consultations/ifrs-16-amendments',
    description:
      'The AcSB is seeking comments on proposed amendments to IFRS 16 related to sale and leaseback transactions.',
  },
}

export const StandardResult: Story = {
  args: {
    contentType: 'standard',
    board: 'AASB',
    date: 'December 5, 2025',
    title: 'Canadian Standard on Assurance Engagements (CSAE) 3001',
    href: '/standards/csae-3001',
    description:
      'Direct engagements standard for reporting on subject matters other than historical financial information.',
    fileType: 'PDF',
    fileSize: '1.8 MB',
  },
}

export const MeetingSummary: Story = {
  args: {
    contentType: 'meeting',
    board: 'PSAB',
    date: 'February 15, 2026',
    title: 'PSAB Meeting Summary — February 2026',
    href: '/events/psab-meeting-feb-2026',
    description:
      'Summary of decisions made at the February 2026 Public Sector Accounting Board meeting.',
  },
}
