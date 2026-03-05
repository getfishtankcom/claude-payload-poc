/**
 * @description
 * Storybook stories for SortFilterBar component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SortFilterBar } from './SortFilterBar'

const meta = {
  title: 'UI/SortFilterBar',
  component: SortFilterBar,
  tags: ['autodocs'],
} satisfies Meta<typeof SortFilterBar>

export default meta
type Story = StoryObj<typeof meta>

const sortOptions = [
  { label: 'Publication date: Newest', value: 'newest' },
  { label: 'Publication date: Oldest', value: 'oldest' },
]

const itemsPerPageOptions = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
  { label: 'All', value: 'all' },
]

const typeFilterOptions = [
  { label: 'All Types', value: '' },
  { label: 'Audio', value: 'Audio' },
  { label: 'PDF', value: 'PDF' },
  { label: 'Video', value: 'Video' },
  { label: 'Webpage', value: 'Webpage' },
]

export const Default: Story = {
  args: {
    sortOptions,
    sortValue: 'newest',
    onSortChange: () => {},
    itemsPerPageOptions,
    itemsPerPageValue: '10',
    onItemsPerPageChange: () => {},
  },
}

export const WithTypeFilter: Story = {
  args: {
    ...Default.args,
    typeFilterOptions,
    typeFilterValue: '',
    onTypeFilterChange: () => {},
  },
}

export const WithDateRange: Story = {
  args: {
    ...Default.args,
    showDateRange: true,
    startDate: '',
    endDate: '',
    onDateRangeChange: () => {},
  },
}

export const FullControls: Story = {
  args: {
    ...Default.args,
    typeFilterOptions,
    typeFilterValue: '',
    onTypeFilterChange: () => {},
    showDateRange: true,
    startDate: '',
    endDate: '',
    onDateRangeChange: () => {},
  },
}

export const Mobile: Story = {
  args: {
    ...FullControls.args,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
