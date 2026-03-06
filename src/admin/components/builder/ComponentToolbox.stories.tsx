/**
 * @description
 * Storybook stories for the ComponentToolbox component.
 * Shows the categorized, searchable, draggable component list.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { DndContext } from '@dnd-kit/core'
import { ComponentToolbox } from './ComponentToolbox'

const meta = {
  title: 'Admin/Builder/ComponentToolbox',
  component: ComponentToolbox,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DndContext>
        <div style={{ height: '600px', display: 'flex' }}>
          <Story />
        </div>
      </DndContext>
    ),
  ],
} satisfies Meta<typeof ComponentToolbox>

export default meta
type Story = StoryObj<typeof meta>

/** Default full-width toolbox */
export const Default: Story = {
  args: { compact: false },
}

/** Compact mode — icon-only for tablet/mobile preview */
export const Compact: Story = {
  args: { compact: true },
}
