/**
 * @description
 * Storybook stories for MobileMenu component.
 * Shows open state with accordion navigation sections.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { MobileMenu } from './MobileMenu'

const meta = {
  title: 'Layout/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    viewport: { defaultViewport: 'mobile1' },
  },
} satisfies Meta<typeof MobileMenu>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
  },
}

export const Interactive: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
  render: function InteractiveMobileMenu() {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded bg-primary px-4 py-2 text-white"
        >
          Open Mobile Menu
        </button>
        <MobileMenu isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    )
  },
}

export const Closed: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
  },
}
