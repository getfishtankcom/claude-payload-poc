/**
 * @description
 * Storybook stories for TagChip component.
 * Shows default, active, interactive, and display-only states.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { TagChip } from './TagChip'

const meta = {
  title: 'UI/TagChip',
  component: TagChip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof TagChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    label: 'IFRS',
  },
}

export const Active: Story = {
  args: {
    label: 'IFRS',
    active: true,
  },
}

export const Interactive: Story = {
  args: {
    label: 'Sustainability',
    onClick: () => {},
  },
}

export const ActiveInteractive: Story = {
  args: {
    label: 'Revenue',
    active: true,
    onClick: () => {},
  },
}

export const TagGroup: Story = {
  args: { label: 'IFRS' },
  render: () => (
    <div className="flex flex-wrap gap-2">
      <TagChip label="IFRS" active onClick={() => {}} />
      <TagChip label="ASPE" onClick={() => {}} />
      <TagChip label="Public Sector" onClick={() => {}} />
      <TagChip label="Sustainability" onClick={() => {}} />
      <TagChip label="Auditing" active onClick={() => {}} />
    </div>
  ),
}

export const Mobile: Story = {
  args: {
    label: 'Revenue Recognition',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
