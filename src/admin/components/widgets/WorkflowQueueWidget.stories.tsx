/**
 * @description
 * Storybook stories for the Workflow Queue dashboard widget.
 * Groups workflow items by state (In Review, Needs Revision, Approved).
 *
 * @notes
 * - Uses mock fetch via Storybook's msw-addon pattern (global fetch mock)
 * - The widget fetches from /api/pages on mount
 */
import type { Meta, StoryObj } from '@storybook/react'
import { WorkflowQueueWidget } from './WorkflowQueueWidget'
import { mockWorkflowItems } from '@/__mocks__/cms-data'

const meta = {
  title: 'Admin/Widgets/WorkflowQueueWidget',
  component: WorkflowQueueWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    // Mock fetch responses for the widget
    mockData: mockWorkflowItems(),
  },
  // Override fetch for stories since widget fetches data on mount
  decorators: [
    (Story) => {
      const items = mockWorkflowItems()
      const originalFetch = window.fetch
      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/pages')) {
          return new Response(JSON.stringify({ docs: items, totalDocs: items.length }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return originalFetch(input)
      }
      return <Story />
    },
  ],
} satisfies Meta<typeof WorkflowQueueWidget>

export default meta
type Story = StoryObj<typeof meta>

export const EditorView: Story = {
  args: {
    userId: '1',
    role: 'editor',
  },
}

export const AuthorView: Story = {
  args: {
    userId: '2',
    role: 'author',
  },
}

export const AdminView: Story = {
  args: {
    userId: '1',
    role: 'admin',
  },
}

export const EmptyQueue: Story = {
  args: {
    userId: '1',
    role: 'editor',
  },
  decorators: [
    (Story) => {
      const originalFetch = window.fetch
      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/pages')) {
          return new Response(JSON.stringify({ docs: [], totalDocs: 0 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return originalFetch(input)
      }
      return <Story />
    },
  ],
}

export const Mobile: Story = {
  args: {
    userId: '1',
    role: 'editor',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
