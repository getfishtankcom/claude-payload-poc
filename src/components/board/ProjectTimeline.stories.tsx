/**
 * @description
 * Storybook stories for the ProjectTimeline component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ProjectTimeline } from './ProjectTimeline'

const fiveStages = [
  { phase_number: 1, title: 'Information Gathering', date: '2024-06-01T00:00:00.000Z', description: 'Research phase to gather stakeholder input and identify key issues.', ctas: [], id: 's1' },
  { phase_number: 2, title: 'Approving Project', date: '2024-12-01T00:00:00.000Z', description: 'Board approval of the project plan and scope.', ctas: [], id: 's2' },
  { phase_number: 3, title: 'Engaging Communities', date: '2025-03-01T00:00:00.000Z', description: 'Issuing exposure draft and gathering public comments.', ctas: [{ label: 'View Exposure Draft', url: '/documents/ed-1', id: 'c1' }, { label: 'Submit Comment', url: '/consultations/submit', id: 'c2' }], id: 's3' },
  { phase_number: 4, title: 'Deliberating Feedback', date: null, description: 'Reviewing and deliberating on feedback received.', ctas: [], id: 's4' },
  { phase_number: 5, title: 'Final Pronouncement', date: null, description: 'Publishing the final standard.', ctas: [], id: 's5' },
]

const meta = {
  title: 'Board/ProjectTimeline',
  component: ProjectTimeline,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProjectTimeline>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    stages: fiveStages,
    currentStage: 3,
  },
}

export const AllComplete: Story = {
  args: {
    stages: fiveStages,
    currentStage: 6,
  },
}

export const FirstStage: Story = {
  args: {
    stages: fiveStages,
    currentStage: 1,
  },
}

export const Mobile: Story = {
  args: {
    stages: fiveStages,
    currentStage: 3,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const SevenStages: Story = {
  args: {
    stages: [
      ...fiveStages,
      { phase_number: 6, title: 'Implementation Support', date: null, description: 'Providing implementation guidance and tools.', ctas: [], id: 's6' },
      { phase_number: 7, title: 'Post-Implementation Review', date: null, description: 'Assessing effectiveness of the new standard.', ctas: [], id: 's7' },
    ],
    currentStage: 4,
  },
}

export const EmptyStages: Story = {
  args: {
    stages: [],
    currentStage: 1,
  },
}
