/**
 * @description
 * Storybook stories for CategoryPills component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { CategoryPills } from './CategoryPills'

const meta = {
  title: 'UI/CategoryPills',
  component: CategoryPills,
  tags: ['autodocs'],
} satisfies Meta<typeof CategoryPills>

export default meta
type Story = StoryObj<typeof meta>

const defaultOptions = [
  { label: 'All Items', value: '', isActive: true },
  { label: 'Article', value: 'Article', isActive: false },
  { label: 'Guidance', value: 'Guidance', isActive: false },
  { label: 'In Brief', value: 'In Brief', isActive: false },
  { label: 'Other', value: 'Other', isActive: false },
  { label: 'Webinar', value: 'Webinar', isActive: false },
]

export const Default: Story = {
  args: {
    options: defaultOptions,
    onChange: () => {},
  },
}

export const GuidanceActive: Story = {
  args: {
    options: defaultOptions.map((o) => ({
      ...o,
      isActive: o.value === 'Guidance',
    })),
    onChange: () => {},
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
