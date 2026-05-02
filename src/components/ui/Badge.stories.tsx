/**
 * @description
 * Stories for the Badge component — 9 content type variants.
 * Shows all badge colors from the design token system.
 *
 * @dependencies
 * - Badge: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Badge } from './Badge'

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    variant: 'standard',
    children: 'Badge',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'standard',
        'news',
        'webinar',
        'meeting',
        'guidance',
        'consultation',
        'decision',
        'deadline',
        'resource',
      ],
    },
  },
} satisfies Meta<typeof Badge>

export default meta
type Story = StoryObj<typeof meta>

export const Standard: Story = {
  args: { variant: 'standard', children: 'Standard' },
}

export const News: Story = {
  args: { variant: 'news', children: 'News' },
}

export const Webinar: Story = {
  args: { variant: 'webinar', children: 'Webinar' },
}

export const Meeting: Story = {
  args: { variant: 'meeting', children: 'Meeting' },
}

/** Guidance uses outline/ghost style instead of filled */
export const Guidance: Story = {
  args: { variant: 'guidance', children: 'Guidance' },
}

export const Consultation: Story = {
  args: { variant: 'consultation', children: 'Consultation' },
}

export const Decision: Story = {
  args: { variant: 'decision', children: 'Decision' },
}

export const Deadline: Story = {
  args: { variant: 'deadline', children: 'Deadline' },
}

export const Resource: Story = {
  args: { variant: 'resource', children: 'Resource' },
}

/** All 9 variants displayed in a grid for visual comparison */
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Badge variant="standard">Standard</Badge>
      <Badge variant="news">News</Badge>
      <Badge variant="webinar">Webinar</Badge>
      <Badge variant="meeting">Meeting</Badge>
      <Badge variant="guidance">Guidance</Badge>
      <Badge variant="consultation">Consultation</Badge>
      <Badge variant="decision">Decision</Badge>
      <Badge variant="deadline">Deadline</Badge>
      <Badge variant="resource">Resource</Badge>
    </div>
  ),
}
