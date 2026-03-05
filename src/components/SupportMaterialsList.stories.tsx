/**
 * @description
 * Storybook stories for SupportMaterialsList component.
 * Shows document link lists with icons and file type labels.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SupportMaterialsList } from './SupportMaterialsList'

const meta = {
  title: 'UI/SupportMaterialsList',
  component: SupportMaterialsList,
  tags: ['autodocs'],
} satisfies Meta<typeof SupportMaterialsList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    materials: [
      { label: 'Exposure Draft — Revenue Recognition', url: '/files/ed-revenue.pdf', fileType: 'pdf' },
      { label: 'Basis for Conclusions', url: '/files/basis-conclusions.pdf', fileType: 'pdf' },
      { label: 'Summary of Changes', url: '/files/summary-changes.docx', fileType: 'word' },
    ],
  },
}

export const SingleItem: Story = {
  args: {
    materials: [
      { label: 'Complete Exposure Draft', url: '/files/complete-ed.pdf', fileType: 'pdf' },
    ],
  },
}

export const ExternalLinks: Story = {
  args: {
    materials: [
      { label: 'IFRS Foundation Reference', url: 'https://ifrs.org/reference', fileType: 'link' },
      { label: 'Related Excel Data', url: '/files/data.xlsx', fileType: 'excel' },
    ],
  },
}

export const Empty: Story = {
  args: {
    materials: [],
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
