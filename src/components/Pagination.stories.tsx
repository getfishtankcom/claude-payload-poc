/**
 * @description
 * Storybook stories for Pagination component.
 * Shows various page counts, current page states, and edge cases.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Pagination } from './Pagination'

const meta = {
  title: 'UI/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    totalItems: 50,
    itemsPerPage: 10,
    currentPage: 1,
    onChange: () => {},
  },
}

export const MiddlePage: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 5,
    onChange: () => {},
  },
}

export const LastPage: Story = {
  args: {
    totalItems: 47,
    itemsPerPage: 10,
    currentPage: 5,
    onChange: () => {},
  },
}

export const ManyPages: Story = {
  args: {
    totalItems: 250,
    itemsPerPage: 10,
    currentPage: 12,
    onChange: () => {},
  },
}

export const FewPages: Story = {
  args: {
    totalItems: 15,
    itemsPerPage: 10,
    currentPage: 1,
    onChange: () => {},
  },
}

export const SinglePage: Story = {
  args: {
    totalItems: 8,
    itemsPerPage: 10,
    currentPage: 1,
    onChange: () => {},
  },
}

export const Mobile: Story = {
  args: {
    totalItems: 100,
    itemsPerPage: 10,
    currentPage: 5,
    onChange: () => {},
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
