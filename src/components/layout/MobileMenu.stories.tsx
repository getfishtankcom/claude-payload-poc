/**
 * @description
 * Storybook stories for MobileMenu component.
 * Shows open state with CMS-driven navigation sections.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { MobileMenu } from './MobileMenu'
import { mockNavigationData } from '@/__mocks__/cms-data'

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
    navigation: mockNavigationData(),
  },
}

export const Interactive: Story = {
  args: {
    isOpen: false,
    onClose: () => {},
    navigation: mockNavigationData(),
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
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          navigation={mockNavigationData()}
        />
      </div>
    )
  },
}

export const EmptyNavigation: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    navigation: null,
  },
}
