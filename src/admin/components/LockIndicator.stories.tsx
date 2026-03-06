/**
 * @description
 * Storybook stories for the LockIndicator admin component.
 * Shows lock status for document editing — locked by self, by another, or admin force-unlock.
 *
 * @notes
 * - LockIndicator uses useDocumentInfo and useAuth hooks (mocked via PayloadMockProvider)
 * - It fetches lock info on mount and attempts to acquire the lock
 */
import type { Meta, StoryObj } from '@storybook/react'
import { LockIndicator } from './LockIndicator'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'

const meta = {
  title: 'Admin/LockIndicator',
  component: LockIndicator,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof LockIndicator>

export default meta
type Story = StoryObj<typeof meta>

// Helper: mock fetch to simulate different lock states
function lockedByMeDecorator(Story: React.FC) {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/pages/123')) {
      if (init?.method === 'PATCH') {
        return new Response(JSON.stringify({ id: '123' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({ lockedBy: null, lockedAt: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input, init)
  }
  return <Story />
}

function lockedByOtherDecorator(Story: React.FC) {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/pages/123')) {
      if (init?.method === 'PATCH') {
        return new Response(JSON.stringify({ id: '123' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
      }
      return new Response(JSON.stringify({
        lockedBy: { id: '99', firstName: 'Sarah', email: 'sarah@frascanada.ca' },
        lockedAt: new Date().toISOString(),
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input, init)
  }
  return <Story />
}

export const LockedByMe: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    lockedByMeDecorator,
  ],
}

export const LockedByOtherAsEditor: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '2', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    lockedByOtherDecorator,
  ],
}

export const LockedByOtherAsAdmin: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    lockedByOtherDecorator,
  ],
}

export const CreateView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' },
        documentInfo: { id: undefined, collectionSlug: 'pages' },
      }}>
        <p style={{ fontSize: '13px', color: '#888' }}>LockIndicator renders nothing on create view (no document ID)</p>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '2', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    lockedByOtherDecorator,
  ],
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
