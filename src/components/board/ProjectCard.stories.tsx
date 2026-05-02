/**
 * @description
 * Storybook stories for the ProjectCard component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ProjectCard } from './ProjectCard'

const sampleProject = {
  id: '1',
  title: '2024-2025 Annual Improvements',
  slug: '2024-2025-annual-improvements',
  description: 'This project proposes amendments to several standards as part of the annual improvements process.',
  boardSlug: 'psab',
  badges: [
    { badge_type: 'Exposure Draft', id: 'b1' },
    { badge_type: 'Public Comment', id: 'b2' },
  ],
  currentStage: 3,
  currentStageName: 'Deliberating Feedback',
  ctas: [
    { label: 'View Exposure Draft', url: '/documents/annual-improvements-ed' },
    { label: 'Comment Summary', url: '/documents/annual-improvements-comments' },
  ],
}

const meta = {
  title: 'Board/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof ProjectCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { project: sampleProject },
}

export const NoBadges: Story = {
  args: {
    project: {
      ...sampleProject,
      badges: [],
    },
  },
}

export const NoCTAs: Story = {
  args: {
    project: {
      ...sampleProject,
      ctas: [],
    },
  },
}

export const LongDescription: Story = {
  args: {
    project: {
      ...sampleProject,
      description: 'This is a very long description that should be truncated after two lines. It contains detailed information about the project scope, timeline, and expected outcomes that extends well beyond what can fit in a compact card layout. The purpose is to test line clamping behavior.',
    },
  },
}

export const Mobile: Story = {
  args: { project: sampleProject },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
