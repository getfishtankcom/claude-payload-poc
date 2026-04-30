/**
 * @description
 * Storybook stories for the Workbox workflow management dashboard (Epic 27).
 * Renders the tabbed cross-collection review queue with a mocked fetch layer
 * so the client component can run unchanged in Storybook.
 *
 * @notes
 * - Mock data is inlined here (not in src/__mocks__/cms-data.ts) to avoid
 *   coupling the shared mocks module to WorkboxClient internals. The shape
 *   matches the WorkboxItem interface in WorkboxClient.tsx.
 * - The fetch decorator emulates Payload's REST shape per-collection so each
 *   of the 12 WORKFLOW_COLLECTIONS calls returns only its own items.
 */
import type { Meta, StoryObj } from '@storybook/react'
import type React from 'react'
import Workbox from './Workbox'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'

type MockItem = {
  id: string
  title: string
  slug: string
  workflowState: 'in_review' | 'needs_revision' | 'approved'
  createdBy: { id: string; email: string; firstName: string }
  updatedAt: string
  publishOn: string | null
  workflowHistory: Array<{
    from?: string
    to?: string
    user?: { firstName?: string; email?: string } | null
    date?: string
    comment?: string
  }>
  _collection: string
  _collectionLabel: string
}

const COLLECTION_LABELS: Record<string, string> = {
  pages: 'Pages',
  news: 'News',
  projects: 'Projects',
  events: 'Events',
  resources: 'Resources',
}

function mockWorkboxItems(): MockItem[] {
  const now = Date.now()
  const h = (n: number) => new Date(now - n * 3600000).toISOString()
  return [
    {
      id: 'wb-1',
      title: 'AcSB Board Update — March 2026',
      slug: 'acsb-board-update-march',
      workflowState: 'in_review',
      createdBy: { id: '3', email: 'jsmith@frascanada.ca', firstName: 'J. Smith' },
      updatedAt: h(2),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'J. Smith', email: 'jsmith@frascanada.ca' }, date: h(2) },
      ],
      _collection: 'pages',
      _collectionLabel: 'Pages',
    },
    {
      id: 'wb-2',
      title: 'IFRS S1 Project Page',
      slug: 'ifrs-s1-project',
      workflowState: 'in_review',
      createdBy: { id: '4', email: 'mchen@frascanada.ca', firstName: 'M. Chen' },
      updatedAt: h(5),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'M. Chen' }, date: h(5) },
      ],
      _collection: 'projects',
      _collectionLabel: 'Projects',
    },
    {
      id: 'wb-3',
      title: 'March Newsletter',
      slug: 'march-newsletter',
      workflowState: 'in_review',
      createdBy: { id: '5', email: 'klee@frascanada.ca', firstName: 'K. Lee' },
      updatedAt: h(24),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'K. Lee' }, date: h(24) },
      ],
      _collection: 'news',
      _collectionLabel: 'News',
    },
    {
      id: 'wb-4',
      title: 'FAQ Page',
      slug: 'faq-page',
      workflowState: 'needs_revision',
      createdBy: { id: '3', email: 'jsmith@frascanada.ca', firstName: 'J. Smith' },
      updatedAt: h(48),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'J. Smith' }, date: h(72) },
        { from: 'in_review', to: 'needs_revision', user: { firstName: 'P. Roy', email: 'proy@frascanada.ca' }, date: h(48), comment: 'Missing citations for Section 3856 references. Please add source links.' },
      ],
      _collection: 'pages',
      _collectionLabel: 'Pages',
    },
    {
      id: 'wb-5',
      title: 'CSSB Webinar: Climate Disclosure',
      slug: 'cssb-webinar-climate',
      workflowState: 'needs_revision',
      createdBy: { id: '4', email: 'mchen@frascanada.ca', firstName: 'M. Chen' },
      updatedAt: h(36),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'M. Chen' }, date: h(50) },
        { from: 'in_review', to: 'needs_revision', user: { firstName: 'P. Roy' }, date: h(36), comment: 'Missing French translation for the webinar description.' },
      ],
      _collection: 'events',
      _collectionLabel: 'Events',
    },
    {
      id: 'wb-6',
      title: 'Contact Page Update',
      slug: 'contact-page-update',
      workflowState: 'approved',
      createdBy: { id: '5', email: 'klee@frascanada.ca', firstName: 'K. Lee' },
      updatedAt: h(12),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'K. Lee' }, date: h(24) },
        { from: 'in_review', to: 'approved', user: { firstName: 'P. Roy' }, date: h(12) },
      ],
      _collection: 'pages',
      _collectionLabel: 'Pages',
    },
    {
      id: 'wb-7',
      title: 'PSAB Annual Report 2025',
      slug: 'psab-annual-report-2025',
      workflowState: 'approved',
      createdBy: { id: '3', email: 'jsmith@frascanada.ca', firstName: 'J. Smith' },
      updatedAt: h(6),
      publishOn: null,
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'J. Smith' }, date: h(48) },
        { from: 'in_review', to: 'approved', user: { firstName: 'P. Roy' }, date: h(6) },
      ],
      _collection: 'resources',
      _collectionLabel: 'Resources',
    },
    {
      id: 'wb-8',
      title: 'New Auditing Standard CAS 600',
      slug: 'new-auditing-standard-cas-600',
      workflowState: 'approved',
      createdBy: { id: '4', email: 'mchen@frascanada.ca', firstName: 'M. Chen' },
      updatedAt: h(3),
      publishOn: new Date(Date.now() + 48 * 3600000).toISOString(),
      workflowHistory: [
        { from: 'draft', to: 'in_review', user: { firstName: 'M. Chen' }, date: h(72) },
        { from: 'in_review', to: 'approved', user: { firstName: 'P. Roy' }, date: h(3) },
      ],
      _collection: 'resources',
      _collectionLabel: 'Resources',
    },
  ]
}

/**
 * Replace window.fetch so WorkboxClient's per-collection requests resolve
 * against the inline mock dataset. PATCH calls (workflow transitions) return
 * a generic success payload so inline action buttons feel responsive.
 */
function withMockFetch(items: MockItem[]) {
  return function decorator(Story: React.FC) {
    const originalFetch = window.fetch
    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()

      if (init?.method === 'PATCH') {
        return new Response(JSON.stringify({ doc: { id: '1' }, message: 'Updated' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      const collectionMatch = url.match(/\/api\/([^/?]+)/)
      if (collectionMatch && url.includes('workflowState')) {
        const slug = collectionMatch[1]
        const docs = items
          .filter((i) => i._collection === slug)
          .map((i) => ({ ...i, _collectionLabel: COLLECTION_LABELS[slug] ?? slug }))
        return new Response(JSON.stringify({ docs, totalDocs: docs.length }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      return originalFetch(input, init)
    }

    return <Story />
  }
}

const meta = {
  title: 'Admin/Workbox',
  component: Workbox,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockFetch(mockWorkboxItems())],
} satisfies Meta<typeof Workbox>

export default meta
type Story = StoryObj<typeof meta>

/** Admin user — sees every collection and every action. */
export const AdminView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

/** Editor user — approve / reject / publish controls visible. */
export const EditorView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '2', role: 'editor', email: 'editor@frascanada.ca', firstName: 'Sarah' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

/** Author user — limited to their own items. */
export const AuthorView: Story = {
  decorators: [
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '3', role: 'author', email: 'author@frascanada.ca', firstName: 'James' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

/** Empty state — no items in any collection. */
export const EmptyState: Story = {
  decorators: [
    withMockFetch([]),
    (Story) => (
      <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
        <Story />
      </PayloadMockProvider>
    ),
  ],
}

/** Mobile viewport — admin role with the full dataset. */
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
