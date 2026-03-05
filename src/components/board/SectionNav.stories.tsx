/**
 * @description
 * Storybook stories for the SectionNav component.
 * Shows vertical sidebar navigation with active state, mobile dropdown, and edge cases.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SectionNav } from './SectionNav'

const defaultItems = [
  { label: 'Overview', slug: 'overview' },
  { label: 'Consultations', slug: 'consultations' },
  { label: 'Projects & Initiatives', slug: 'projects' },
  { label: 'Resources', slug: 'resources' },
  { label: 'Meetings & Decision Summaries', slug: 'meetings' },
  { label: 'Committees', slug: 'committees' },
  { label: 'Volunteer', slug: 'volunteer' },
]

const meta = {
  title: 'Board/SectionNav',
  component: SectionNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SectionNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    items: defaultItems,
    activeItem: 'overview',
    boardName: 'PSAB',
  },
}

export const ActiveMiddle: Story = {
  args: {
    items: defaultItems,
    activeItem: 'resources',
    boardName: 'AcSB',
  },
}

export const WithoutBoardName: Story = {
  args: {
    items: defaultItems,
    activeItem: 'overview',
  },
}

export const Mobile: Story = {
  args: {
    items: defaultItems,
    activeItem: 'consultations',
    boardName: 'CSSB',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const EmptyItems: Story = {
  args: {
    items: [],
  },
}

export const TwoItems: Story = {
  args: {
    items: [
      { label: 'Overview', slug: 'overview' },
      { label: 'Resources', slug: 'resources' },
    ],
    activeItem: 'overview',
  },
}
