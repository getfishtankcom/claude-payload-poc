/**
 * @description
 * Storybook stories for the AddComponentModal component.
 * Shows the searchable, categorized component picker grid.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { AddComponentModal } from './AddComponentModal'

const noop = () => {}

const meta = {
  title: 'Admin/Builder/AddComponentModal',
  component: AddComponentModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AddComponentModal>

export default meta
type Story = StoryObj<typeof meta>

/** Default — all components available */
export const Default: Story = {
  args: {
    allowedComponents: [],
    onSelect: noop,
    onClose: noop,
  },
}

/** Restricted zone — only content components */
export const RestrictedToContent: Story = {
  args: {
    allowedComponents: ['rich-text', 'heading', 'image', 'video', 'accordion', 'tabs', 'table', 'blockquote', 'divider', 'image-grid'],
    onSelect: noop,
    onClose: noop,
  },
}

/** Single component allowed (e.g., results zone) */
export const SingleComponentAllowed: Story = {
  args: {
    allowedComponents: ['project-list'],
    onSelect: noop,
    onClose: noop,
  },
}
