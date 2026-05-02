/**
 * @description
 * Storybook stories for the CustomNav admin sidebar component.
 * Uses PayloadMockProvider to mock useAuth with different roles.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { CustomNav } from './CustomNav'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'

const meta = {
  title: 'Admin/CustomNav',
  component: CustomNav,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => {
      // Mock fetch for workbox count
      const originalFetch = window.fetch
      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/pages')) {
          return new Response(JSON.stringify({ docs: [], totalDocs: 5 }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return originalFetch(input)
      }
      return <Story />
    },
  ],
} satisfies Meta<typeof CustomNav>

export default meta
type Story = StoryObj<typeof meta>

export const AdminRole: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </PayloadMockProvider>
    ),
  ],
}

export const EditorRole: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '2', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Sarah' } }}>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </PayloadMockProvider>
    ),
  ],
}

export const AuthorRole: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '3', role: 'author', email: 'author@frascanada.ca', firstName: 'James' } }}>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </PayloadMockProvider>
    ),
  ],
}

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <div style={{ height: '100vh' }}>
          <Story />
        </div>
      </PayloadMockProvider>
    ),
  ],
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
