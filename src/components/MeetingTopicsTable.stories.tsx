/**
 * @description
 * Stories for MeetingTopicsTable — desktop table and mobile cards.
 *
 * @dependencies
 * - MeetingTopicsTable: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MeetingTopicsTable } from './MeetingTopicsTable'

const sampleTopics = [
  { topic: 'Revenue Recognition', description: 'Discussion of exposure draft comments received during consultation period', status: 'Approved for re-deliberation' },
  { topic: 'Financial Instruments', description: 'Staff presentation on hedge accounting amendments', status: 'Deferred to next meeting' },
  { topic: 'Related Party Transactions', description: 'Review of preliminary research findings', status: 'In progress' },
  { topic: 'Employee Benefits', description: 'Initial scoping discussion for potential new project', status: 'Added to research agenda' },
]

const meta = {
  title: 'Tables/MeetingTopicsTable',
  component: MeetingTopicsTable,
  tags: ['autodocs'],
} satisfies Meta<typeof MeetingTopicsTable>

export default meta
type Story = StoryObj<typeof meta>

/** Default with sample data */
export const Default: Story = {
  args: { topics: sampleTopics },
}

/** Empty state */
export const Empty: Story = {
  args: { topics: [] },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: { topics: sampleTopics },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

/** Single topic */
export const SingleTopic: Story = {
  args: { topics: [sampleTopics[0]] },
}
