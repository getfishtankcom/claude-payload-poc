/**
 * @description
 * Storybook stories for the custom admin Dashboard view.
 * Shows the 4-widget grid with role-specific visibility.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Dashboard } from './Dashboard'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'
import { mockWorkflowItems, mockRecentItems, mockScheduledItems } from '@/__mocks__/cms-data'

// Shared fetch mock decorator for all dashboard stories
function withMockFetch(Story: React.FC) {
  const workflowItems = mockWorkflowItems()
  const recentItems = mockRecentItems()
  const scheduledItems = mockScheduledItems()
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/pages')) {
      // Decide which mock to return based on query params
      if (url.includes('publishOn')) {
        return new Response(JSON.stringify({ docs: scheduledItems, totalDocs: scheduledItems.length }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      if (url.includes('workflowState')) {
        return new Response(JSON.stringify({ docs: workflowItems, totalDocs: workflowItems.length }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      // Recent items (default pages query)
      return new Response(JSON.stringify({ docs: recentItems, totalDocs: recentItems.length }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input)
  }
  return <Story />
}

const meta = {
  title: 'Admin/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockFetch],
} satisfies Meta<typeof Dashboard>

export default meta
type Story = StoryObj<typeof meta>

export const AdminView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const EditorView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '2', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Sarah' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const AuthorView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '3', role: 'author', email: 'author@frascanada.ca', firstName: 'James' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
