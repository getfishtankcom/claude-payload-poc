/**
 * @description
 * Storybook stories for the Content Tree admin view (Epic 23).
 * Shows the tree with expand/collapse, type icons, gutter indicators,
 * and search functionality.
 */
import type { Meta, StoryObj } from '@storybook/react'
import ContentTree from './ContentTree'
import { PayloadMockProvider } from '../../../.storybook/mocks/payloadcms-ui'
import { mockTreeNodes } from '@/__mocks__/cms-data'

// Mock fetch to return tree data
function withMockTreeFetch(Story: React.FC) {
  const treeData = mockTreeNodes()
  const originalFetch = window.fetch
  window.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()
    if (url.includes('/api/tree/search')) {
      const q = new URL(url, window.location.origin).searchParams.get('q') || ''
      // Simple mock search: filter tree nodes by title
      const results: Array<{ id: string; title: string; slug: string; contentType: string; workflowState: string; parent: string | null; ancestorIds: string[] }> = []
      const searchNodes = (nodes: typeof treeData, parentIds: string[] = []) => {
        for (const node of nodes) {
          if (node.title.toLowerCase().includes(q.toLowerCase())) {
            results.push({
              id: String(node.id),
              title: node.title,
              slug: node.slug,
              contentType: node.contentType,
              workflowState: node.workflowState,
              parent: node.parent ? String(node.parent) : null,
              ancestorIds: parentIds,
            })
          }
          if (node.children) {
            searchNodes(node.children, [...parentIds, String(node.id)])
          }
        }
      }
      searchNodes(treeData)
      const expandIds = [...new Set(results.flatMap((r) => r.ancestorIds))]
      return new Response(JSON.stringify({ results, expandIds }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    if (url.includes('/api/tree')) {
      return new Response(JSON.stringify({ nodes: treeData }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return originalFetch(input)
  }
  return <Story />
}

const meta = {
  title: 'Admin/ContentTree',
  component: ContentTree,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockTreeFetch],
} satisfies Meta<typeof ContentTree>

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

export const EmptyTree: Story = {
  decorators: [
    (Story) => {
      // Override fetch to return empty tree
      const originalFetch = window.fetch
      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/tree')) {
          return new Response(JSON.stringify({ nodes: [] }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        return originalFetch(input)
      }
      return (
        <PayloadMockProvider value={{ user: { id: '1', role: 'admin', email: 'admin@frascanada.ca', firstName: 'Admin' } }}>
          <Story />
        </PayloadMockProvider>
      )
    },
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
