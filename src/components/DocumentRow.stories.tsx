/**
 * @description
 * Storybook stories for DocumentRow component.
 * Shows open and closed document states with different action buttons.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { DocumentRow } from './DocumentRow'

const meta = {
  title: 'UI/DocumentRow',
  component: DocumentRow,
  tags: ['autodocs'],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof DocumentRow>

export default meta
type Story = StoryObj<typeof meta>

export const OpenDocument: Story = {
  args: {
    document: {
      title: 'ED: Proposed Amendments to Section 3856, Financial Instruments',
      href: '/ifrsstandards/documents/ed-section-3856',
      commentSubmitUrl: '/ifrsstandards/documents/ed-section-3856/submit',
      status: 'open',
    },
  },
}

export const ClosedDocument: Story = {
  args: {
    document: {
      title: 'ED: Revenue Recognition for Not-for-Profit Organizations',
      href: '/aspe/documents/ed-revenue-recognition',
      commentsPdfUrl: '/files/comments-revenue-recognition.pdf',
      status: 'closed',
    },
  },
}

export const ClosedNoComments: Story = {
  args: {
    document: {
      title: 'Consultation Paper: Climate-related Disclosures',
      href: '/sustainability/documents/cp-climate-disclosures',
      status: 'closed',
    },
  },
}

export const Mobile: Story = {
  args: {
    ...OpenDocument.args,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
