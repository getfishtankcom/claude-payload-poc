/**
 * Storybook stories for RedirectsImportButton.
 *
 * The button POSTs to /api/redirects which has no Storybook backend, so
 * stories stub `window.fetch` to return a fake "no duplicate" + success
 * response. This lets the button render in its idle, busy, and result
 * states without a real Payload server.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { RedirectsImportButton } from './RedirectsImportButton'

const installFetchStub = (variant: 'success' | 'duplicates' | 'fail') => {
  if (typeof window === 'undefined') return
  window.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/redirects?where')) {
      const totalDocs = variant === 'duplicates' ? 1 : 0
      return new Response(JSON.stringify({ totalDocs }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (url.includes('/api/redirects') && init?.method === 'POST') {
      return new Response(JSON.stringify({ id: 'mock' }), {
        status: variant === 'fail' ? 500 : 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response('{}', { status: 200 })
  }) as typeof window.fetch
}

const meta = {
  title: 'Admin/RedirectsImportButton',
  component: RedirectsImportButton,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof RedirectsImportButton>

export default meta
type Story = StoryObj<typeof meta>

export const IdleSuccessBackend: Story = {
  decorators: [
    (Story) => {
      installFetchStub('success')
      return <Story />
    },
  ],
}

export const IdleDuplicatesBackend: Story = {
  decorators: [
    (Story) => {
      installFetchStub('duplicates')
      return <Story />
    },
  ],
}

export const IdleFailingBackend: Story = {
  decorators: [
    (Story) => {
      installFetchStub('fail')
      return <Story />
    },
  ],
}
