/**
 * @description
 * Storybook stories for the LanguageSwitcher admin component.
 * Provides EN/FR locale switching with translation status indicators.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'

const meta = {
  title: 'Admin/LanguageSwitcher',
  component: LanguageSwitcher,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof LanguageSwitcher>

export default meta
type Story = StoryObj<typeof meta>

// Helper: mock fetch to simulate translation states
function translatedDecorator(Story: React.FC) {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/pages/123')) {
      return new Response(JSON.stringify({ title: 'Reconnaissance des revenus' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input, init)
  }
  return <Story />
}

function untranslatedDecorator(Story: React.FC) {
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/pages/123')) {
      return new Response(JSON.stringify({ title: '' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input, init)
  }
  return <Story />
}

export const EnglishLocaleTranslated: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    translatedDecorator,
  ],
}

export const EnglishLocaleUntranslated: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    untranslatedDecorator,
  ],
}

export const CreateView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: undefined, collectionSlug: 'pages' },
      }}>
        <p style={{ fontSize: '13px', color: '#888' }}>LanguageSwitcher renders nothing on create view (no document ID)</p>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{
        user: { id: '1', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Editor' },
        documentInfo: { id: '123', collectionSlug: 'pages' },
      }}>
        <Story />
      </PayloadMockProvider>
    ),
    untranslatedDecorator,
  ],
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
