/**
 * @description
 * Storybook stories for the ResourcesList component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ResourcesList } from './ResourcesList'

const sampleResources = [
  { title: 'Basis for Conclusions', file_url: '/documents/basis-for-conclusions.pdf', type: 'pdf' as const },
  { title: 'Implementation Guide', file_url: '/documents/implementation-guide.pdf', type: 'pdf' as const },
  { title: 'Illustrative Examples', file_url: 'https://example.com/examples', type: 'link' as const },
]

const meta = {
  title: 'Board/ResourcesList',
  component: ResourcesList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ResourcesList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    resources: sampleResources,
  },
}

export const MixedTypes: Story = {
  args: {
    resources: [
      { title: 'Annual Report 2025', file_url: '/docs/annual-report.pdf', type: 'pdf' },
      { title: 'Meeting Summary', file_url: '/docs/summary.docx', type: 'word' },
      { title: 'Webinar Recording', file_url: 'https://vimeo.com/example', type: 'video' },
      { title: 'External Reference', file_url: 'https://ifrs.org/standards', type: 'link' },
    ],
  },
}

export const Mobile: Story = {
  args: {
    resources: sampleResources,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const EmptyResources: Story = {
  args: {
    resources: [],
  },
}
