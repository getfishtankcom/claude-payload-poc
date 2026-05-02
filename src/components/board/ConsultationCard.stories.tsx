/**
 * @description
 * Storybook stories for the ConsultationCard component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ConsultationCard } from './ConsultationCard'

const futureDate = new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString()
const pastDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()

const sampleConsultation = {
  id: '1',
  title: 'Intangible Assets',
  slug: 'intangible-assets',
  type: 'Exposure Draft',
  deadline_date: futureDate,
  boardName: 'Public Sector Accounting Board',
  boardSlug: 'psab',
  standardName: 'Public Sector Accounting Standards',
  description: 'This exposure draft proposes new guidance on the recognition and measurement of intangible assets in the public sector.',
  actionDocuments: [
    { label: 'View Exposure Draft', url: '/documents/intangible-assets-ed', type: 'pdf' },
    { label: 'Basis for Conclusions', url: '/documents/intangible-assets-bfc', type: 'pdf' },
    { label: 'Submit Comment', url: '/consultations/submit/intangible-assets', type: 'link' },
  ],
}

const meta = {
  title: 'Board/ConsultationCard',
  component: ConsultationCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ConsultationCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { consultation: sampleConsultation },
}

export const ClosedConsultation: Story = {
  args: {
    consultation: {
      ...sampleConsultation,
      deadline_date: pastDate,
      title: 'Quality Management Standards Update',
      type: 'Re-exposure Draft',
    },
  },
}

export const SurveyType: Story = {
  args: {
    consultation: {
      ...sampleConsultation,
      type: 'Survey',
      title: 'Cloud Computing Arrangements',
      actionDocuments: [
        { label: 'Complete Survey', url: '/surveys/cloud-computing', type: 'link' },
      ],
    },
  },
}

export const NoStandard: Story = {
  args: {
    consultation: {
      ...sampleConsultation,
      standardName: null,
    },
  },
}

export const Mobile: Story = {
  args: { consultation: sampleConsultation },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
