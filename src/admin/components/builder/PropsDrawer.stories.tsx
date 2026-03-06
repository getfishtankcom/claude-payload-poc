/**
 * @description
 * Storybook stories for the PropsDrawer component.
 * Shows the slide-out props editing panel for different component types.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { PropsDrawer } from './PropsDrawer'
import type { ComponentInstance } from '../../templates/types'

const noop = () => {}

const meta = {
  title: 'Admin/Builder/PropsDrawer',
  component: PropsDrawer,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '600px', display: 'flex', justifyContent: 'flex-end' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PropsDrawer>

export default meta
type Story = StoryObj<typeof meta>

/** Heading component props */
export const HeadingProps: Story = {
  args: {
    component: {
      id: 'heading-1',
      type: 'heading',
      props: { text: 'Welcome to FRAS', level: '2', alignment: 'left' },
    },
    zone: 'main',
    onApply: noop,
    onClose: noop,
  },
}

/** Card Grid component with array items */
export const CardGridProps: Story = {
  args: {
    component: {
      id: 'card-grid-1',
      type: 'card-grid',
      props: {
        columns: 3,
        style: 'default',
        items: [
          { title: 'Card 1', description: 'First card' },
          { title: 'Card 2', description: 'Second card' },
        ],
      },
    },
    zone: 'main',
    onApply: noop,
    onClose: noop,
  },
}

/** Data-driven widget (News Feed) with data source fields */
export const NewsFeedProps: Story = {
  args: {
    component: {
      id: 'news-feed-1',
      type: 'news-feed',
      props: { dataSource: 'dynamic', collection: 'news', limit: 5, showExcerpts: true },
    },
    zone: 'main',
    onApply: noop,
    onClose: noop,
  },
}

/** Simple component with few props (Divider) */
export const DividerProps: Story = {
  args: {
    component: {
      id: 'divider-1',
      type: 'divider',
      props: { style: 'line', spacing: 'medium' },
    },
    zone: 'main',
    onApply: noop,
    onClose: noop,
  },
}

/** Unknown component type — error state */
export const UnknownComponent: Story = {
  args: {
    component: {
      id: 'unknown-1',
      type: 'nonexistent-component',
      props: {},
    },
    zone: 'main',
    onApply: noop,
    onClose: noop,
  },
}
