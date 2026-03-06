/**
 * @description
 * Storybook stories for the TreeDndWrapper component (Epic 23, task 23.5).
 * Shows the DnD context with draggable items in various configurations.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { TreeDndWrapper, DraggableTreeItem } from './TreeDndWrapper'
import { mockTreeNodes } from '@/__mocks__/cms-data'

const meta = {
  title: 'Admin/TreeDndWrapper',
  component: TreeDndWrapper,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof TreeDndWrapper>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    tree: mockTreeNodes(),
    onMoveNode: async (result) => {
      console.log('Move:', result)
    },
  },
  render: (args) => (
    <TreeDndWrapper {...args}>
      <div style={{ width: 300, padding: 8 }}>
        {['Item 1', 'Item 2', 'Item 3'].map((label, i) => (
          <DraggableTreeItem key={i} id={`item-${i}`}>
            {({ isDragging, isOver, setDragRef, setDropRef, dragListeners }) => (
              <div
                ref={(el) => { setDragRef(el); setDropRef(el) }}
                {...(dragListeners || {})}
                style={{
                  padding: '8px 12px',
                  margin: '4px 0',
                  border: '1px solid #ddd',
                  borderRadius: 4,
                  backgroundColor: isOver ? '#e0f0ff' : isDragging ? '#f0f0f0' : '#fff',
                  opacity: isDragging ? 0.5 : 1,
                  cursor: 'grab',
                  outline: isOver ? '2px solid #3B82F6' : 'none',
                }}
              >
                {label}
              </div>
            )}
          </DraggableTreeItem>
        ))}
      </div>
    </TreeDndWrapper>
  ),
}

export const EmptyTree: Story = {
  args: {
    tree: [],
    onMoveNode: async () => {},
  },
  render: (args) => (
    <TreeDndWrapper {...args}>
      <div style={{ padding: 16, color: '#999' }}>No items to drag</div>
    </TreeDndWrapper>
  ),
}
