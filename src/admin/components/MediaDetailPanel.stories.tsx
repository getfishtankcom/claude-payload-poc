/**
 * @description
 * Storybook stories for the MediaDetailPanel component (Epic 24).
 * Shows the slide-out detail drawer for media items.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MediaDetailPanel } from './MediaDetailPanel'
import { mockMediaItems } from '@/__mocks__/cms-data'

// Mock fetch for locale data and usage queries
function withMockFetch(Story: React.FC) {
  const items = mockMediaItems()
  const originalFetch = window.fetch

  window.fetch = async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString()

    // Mock media item fetch (for locale data)
    if (url.includes('/api/media/') && !url.includes('/api/media-folders')) {
      const isFr = url.includes('locale=fr')
      const item = items[0]
      return new Response(JSON.stringify({
        ...item,
        alt: isFr ? 'Bannière héros AcSB' : item.alt,
        title: isFr ? 'Héros page d\'accueil AcSB' : item.title,
        description: isFr ? 'Description en français' : 'English description',
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Mock pages usage query
    if (url.includes('/api/pages')) {
      return new Response(JSON.stringify({
        docs: [
          { id: 'page-1', title: 'AcSB Board Page', slug: 'acsb' },
          { id: 'page-2', title: 'Homepage', slug: 'home' },
        ],
        totalDocs: 2,
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return originalFetch(input)
  }

  return (
    <div style={{ height: '600px', display: 'flex', justifyContent: 'flex-end' }}>
      <Story />
    </div>
  )
}

const meta = {
  title: 'Admin/MediaDetailPanel',
  component: MediaDetailPanel,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockFetch],
} satisfies Meta<typeof MediaDetailPanel>

export default meta
type Story = StoryObj<typeof meta>

const mockItems = mockMediaItems()

/** Image media item with usage */
export const ImageItem: Story = {
  args: {
    item: mockItems[0],
    onClose: () => console.log('close'),
    onSave: () => console.log('save'),
    onDelete: () => console.log('delete'),
  },
}

/** PDF document */
export const DocumentItem: Story = {
  args: {
    item: mockItems[3],
    onClose: () => console.log('close'),
    onSave: () => console.log('save'),
    onDelete: () => console.log('delete'),
  },
}

/** Video file */
export const VideoItem: Story = {
  args: {
    item: mockItems[4],
    onClose: () => console.log('close'),
    onSave: () => console.log('save'),
    onDelete: () => console.log('delete'),
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    item: mockItems[0],
    onClose: () => console.log('close'),
    onSave: () => console.log('save'),
    onDelete: () => console.log('delete'),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
