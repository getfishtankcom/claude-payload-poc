/**
 * @description
 * Storybook stories for AnchorNav scroll-spy sidebar component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { AnchorNav } from './AnchorNav'

const meta = {
  title: 'Navigation/AnchorNav',
  component: AnchorNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof AnchorNav>

export default meta
type Story = StoryObj<typeof meta>

const committeeItems = [
  { label: 'Accounting Standards Advisory Forum', id: 'asaf' },
  { label: 'Advisory Committee', id: 'advisory-committee' },
  { label: 'Agriculture Advisory Group', id: 'agriculture' },
  { label: 'Due Process Oversight Committee', id: 'due-process' },
  { label: 'Employee Future Benefits Task Force', id: 'efb' },
  { label: 'Financial Instruments Advisory Committee', id: 'fiac' },
  { label: 'Insurance Advisory Group', id: 'insurance' },
  { label: 'NFP Advisory Group', id: 'nfp' },
  { label: 'Pension Advisory Group', id: 'pension' },
  { label: 'Private Enterprise Advisory Committee', id: 'peac' },
  { label: 'Revenue Advisory Group', id: 'revenue' },
  { label: 'User Advisory Council', id: 'uac' },
  { label: 'XBRL Advisory Committee', id: 'xbrl' },
]

export const Default: Story = {
  args: {
    items: committeeItems,
  },
}

export const FewItems: Story = {
  args: {
    items: committeeItems.slice(0, 4),
  },
}

export const Mobile: Story = {
  args: {
    items: committeeItems,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const Empty: Story = {
  args: {
    items: [],
  },
}
