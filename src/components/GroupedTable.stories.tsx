/**
 * @description
 * Storybook stories for GroupedTable component.
 * Shows grouped sections, alternating rows, empty groups, and edge cases.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { GroupedTable } from './GroupedTable'

type SampleRow = { title: string; description: string }

const meta = {
  title: 'UI/GroupedTable',
  component: GroupedTable<SampleRow>,
  tags: ['autodocs'],
} satisfies Meta<typeof GroupedTable<SampleRow>>

export default meta
type Story = StoryObj<typeof meta>

const sampleGroups = [
  {
    heading: 'Exposure Drafts',
    rows: [
      { title: 'Revenue Recognition', description: 'Proposed amendments to Section 3400' },
      { title: 'Financial Instruments', description: 'Amendments to Section 3856' },
      { title: 'Employee Benefits', description: 'New standard for pension obligations' },
    ],
  },
  {
    heading: 'Consultation Papers',
    rows: [
      { title: 'Sustainability Reporting', description: 'Framework for climate disclosures' },
    ],
  },
]

export const Default: Story = {
  args: {
    groups: sampleGroups,
    renderRow: (row: SampleRow) => (
      <div>
        <p className="font-semibold">{row.title}</p>
        <p className="text-sm text-gray-500">{row.description}</p>
      </div>
    ),
  },
}

export const WithEmptyGroups: Story = {
  args: {
    groups: [
      ...sampleGroups,
      { heading: 'Discussion Papers', rows: [] },
    ],
    renderRow: (row: SampleRow) => (
      <div>
        <p className="font-semibold">{row.title}</p>
      </div>
    ),
  },
}

export const AllEmpty: Story = {
  args: {
    groups: [
      { heading: 'Group A', rows: [] },
      { heading: 'Group B', rows: [] },
    ],
    renderRow: () => <div />,
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
