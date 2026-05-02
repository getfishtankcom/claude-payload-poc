/**
 * @description
 * Storybook stories for FilterSidebar component.
 * Shows default, with active filters, and collapsed states.
 */
import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { FilterSidebar } from './FilterSidebar'

const meta: Meta<typeof FilterSidebar> = {
  title: 'Components/FilterSidebar',
  component: FilterSidebar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof FilterSidebar>

function InteractiveWrapper({ initialFilters = {} }: { initialFilters?: Record<string, string[]> }) {
  const [filters, setFilters] = useState<Record<string, string[]>>(initialFilters)

  return (
    <FilterSidebar
      activeFilters={filters}
      onFilterChange={(sectionId, values) =>
        setFilters((prev) => ({ ...prev, [sectionId]: values }))
      }
      onClearAll={() => setFilters({})}
    />
  )
}

export const Default: Story = {
  render: () => <InteractiveWrapper />,
}

export const WithActiveFilters: Story = {
  render: () => (
    <InteractiveWrapper
      initialFilters={{
        board: ['AcSB', 'PSAB'],
        content_type: ['news'],
        date: ['3m'],
      }}
    />
  ),
}

export const NoActiveFilters: Story = {
  render: () => <InteractiveWrapper initialFilters={{}} />,
}
