/**
 * @description
 * Stories for EventSummaryTable — desktop table and mobile cards.
 *
 * @dependencies
 * - EventSummaryTable: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { EventSummaryTable } from './EventSummaryTable'

const sampleRows = [
  { date: 'March 20, 2026', topic: 'Revenue Recognition for NFPOs', decision: 'Approved exposure draft for public comment' },
  { date: 'March 20, 2026', topic: 'Financial Instruments — Hedge Accounting', decision: 'Deferred to April meeting pending further research' },
  { date: 'March 20, 2026', topic: 'Related Party Transactions', decision: 'Staff to prepare analysis for Q2 review' },
  { date: 'March 20, 2026', topic: 'Implementation Guidance on Section 3856', decision: 'Published as final guidance' },
]

const meta = {
  title: 'Tables/EventSummaryTable',
  component: EventSummaryTable,
  tags: ['autodocs'],
} satisfies Meta<typeof EventSummaryTable>

export default meta
type Story = StoryObj<typeof meta>

/** Default with sample data */
export const Default: Story = {
  args: { rows: sampleRows },
}

/** Empty state */
export const Empty: Story = {
  args: { rows: [] },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: { rows: sampleRows },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

/** Single row */
export const SingleRow: Story = {
  args: { rows: [sampleRows[0]] },
}
