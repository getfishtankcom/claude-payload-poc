/**
 * @description
 * Storybook stories for the Media Library admin view (Epic 24).
 * Shows the two-panel layout with folder tree and media grid.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MediaLibraryClient } from './MediaLibraryClient'
import { mockMediaFolders, mockMediaItems } from '@/__mocks__/cms-data'

// Mock fetch for folder tree and media API
function withMockFetch(Story: React.FC) {
  const folders = mockMediaFolders()
  const mediaItems = mockMediaItems()
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()

    if (url.includes('/api/media-folders/tree')) {
      return new Response(JSON.stringify({ nodes: folders }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (url.includes('/api/media')) {
      // Parse folder filter from URL
      const urlObj = new URL(url, 'http://localhost')
      const folderFilter = urlObj.searchParams.get('where[folder][equals]')

      let filteredItems = mediaItems
      if (folderFilter) {
        filteredItems = mediaItems.filter((item) => String(item.folder) === folderFilter)
      }

      return new Response(
        JSON.stringify({ docs: filteredItems, totalDocs: filteredItems.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return originalFetch(input)
  }

  return (
    <div style={{ height: '600px', border: '1px solid #ddd' }}>
      <Story />
    </div>
  )
}

const meta = {
  title: 'Admin/MediaLibrary',
  component: MediaLibraryClient,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockFetch],
} satisfies Meta<typeof MediaLibraryClient>

export default meta
type Story = StoryObj<typeof meta>

/** Default view — all media, grid layout */
export const Default: Story = {}

/** Empty folder state */
export const EmptyFolder: Story = {
  decorators: [
    (Story) => {
      const folders = mockMediaFolders()
      const originalFetch = window.fetch

      window.fetch = async (input: RequestInfo | URL) => {
        const url = typeof input === 'string' ? input : input.toString()
        if (url.includes('/api/media-folders/tree')) {
          return new Response(JSON.stringify({ nodes: folders }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
        if (url.includes('/api/media')) {
          return new Response(
            JSON.stringify({ docs: [], totalDocs: 0 }),
            { status: 200, headers: { 'Content-Type': 'application/json' } },
          )
        }
        return originalFetch(input)
      }

      return (
        <div style={{ height: '600px', border: '1px solid #ddd' }}>
          <Story />
        </div>
      )
    },
  ],
}

/** Mobile viewport */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
