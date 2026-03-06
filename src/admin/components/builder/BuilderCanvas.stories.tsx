/**
 * @description
 * Storybook stories for the BuilderCanvas component.
 * Shows locked/editable zones with components placed inside.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { DndContext } from '@dnd-kit/core'
import { BuilderCanvas } from './BuilderCanvas'
import type { PageTemplate } from '../../templates/types'
import type { BuilderLayout, ComponentInstance } from '../../templates/types'

const mockTemplate: PageTemplate = {
  slug: 'content-page',
  label: 'Content Page',
  description: 'Standard content page',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'main', label: 'Main Content', type: 'editable', allowedComponents: [], maxComponents: 0 },
    { name: 'sidebar', label: 'Sidebar', type: 'editable', allowedComponents: ['rich-text', 'heading'], maxComponents: 5 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

const mockLayout: BuilderLayout = {
  zones: {
    main: [
      { id: 'comp-1', type: 'heading', props: { text: 'Welcome to FRAS Canada', level: '1' } },
      { id: 'comp-2', type: 'rich-text', props: { content: 'Lorem ipsum dolor sit amet...' } },
      { id: 'comp-3', type: 'card-grid', props: { columns: 3, items: [{}, {}, {}] } },
    ],
    sidebar: [
      { id: 'comp-4', type: 'rich-text', props: { content: 'Sidebar content' } },
    ],
  },
}

const noop = () => {}

const meta = {
  title: 'Admin/Builder/BuilderCanvas',
  component: BuilderCanvas,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <DndContext>
        <div style={{ height: '800px', display: 'flex', background: '#f3f4f6' }}>
          <Story />
        </div>
      </DndContext>
    ),
  ],
  args: {
    template: mockTemplate,
    layout: mockLayout,
    selectedComponentId: null,
    canvasWidth: 1440,
    dragOverZone: null,
    onSelectComponent: noop,
    onRemoveComponent: noop,
    onDuplicateComponent: noop,
    onCopyComponent: noop,
    onPasteComponent: noop,
    onAddComponent: noop,
    clipboard: null,
  },
} satisfies Meta<typeof BuilderCanvas>

export default meta
type Story = StoryObj<typeof meta>

/** Default canvas with components */
export const Default: Story = {}

/** Canvas with a selected component */
export const WithSelection: Story = {
  args: { selectedComponentId: 'comp-2' },
}

/** Tablet width */
export const TabletWidth: Story = {
  args: { canvasWidth: 768 },
}

/** Mobile width */
export const MobileWidth: Story = {
  args: { canvasWidth: 375 },
}

/** Empty layout — no components placed yet */
export const EmptyLayout: Story = {
  args: { layout: { zones: { main: [], sidebar: [] } } },
}

/** Drag over main zone highlight */
export const DragOver: Story = {
  args: { dragOverZone: 'main' },
}
