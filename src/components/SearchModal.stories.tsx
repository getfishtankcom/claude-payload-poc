/**
 * @description
 * Storybook stories for SearchModal component.
 * Covers default state, with popular tags, empty tags, and pre-filled query.
 *
 * @notes
 * - Uses CSF3 format
 * - next/navigation mocked via Storybook's nextjs framework support
 */
import type { Meta, StoryObj } from '@storybook/react'
import React, { useState } from 'react'
import { SearchModal } from './SearchModal'

const meta: Meta<typeof SearchModal> = {
  title: 'Components/SearchModal',
  component: SearchModal,
  parameters: {
    layout: 'fullscreen',
  },
}

export default meta
type Story = StoryObj<typeof SearchModal>

const mockPopularTags = [
  { label: 'IFRS 17', query: 'IFRS 17', id: '1' },
  { label: 'Lease Accounting', query: 'Lease Accounting', id: '2' },
  { label: 'ESG Reporting', query: 'ESG Reporting', id: '3' },
  { label: 'ASPE Updates', query: 'ASPE Updates', id: '4' },
  { label: 'Revenue Recognition', query: 'Revenue Recognition', id: '5' },
]

/** Wrapper to control open/close state */
function ModalWrapper({
  popularTags,
}: {
  popularTags?: typeof mockPopularTags | null
}) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div>
      <button onClick={() => setIsOpen(true)} className="rounded bg-primary px-4 py-2 text-white">
        Open Search Modal
      </button>
      <SearchModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        popularTags={popularTags}
      />
    </div>
  )
}

export const Default: Story = {
  render: () => <ModalWrapper popularTags={mockPopularTags} />,
}

export const NoPopularTags: Story = {
  render: () => <ModalWrapper popularTags={null} />,
}

export const EmptyPopularTags: Story = {
  render: () => <ModalWrapper popularTags={[]} />,
}
