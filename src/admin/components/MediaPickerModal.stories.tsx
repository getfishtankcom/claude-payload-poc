/**
 * @description
 * Storybook stories for the MediaPickerModal component (Epic 24).
 * Shows the modal for selecting media from the library.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MediaPickerModal } from './MediaPickerModal'
import { mockMediaFolders, mockMediaItems } from '@/__mocks__/cms-data'

// Mock fetch for folder tree and media API
function withMockFetch(Story: React.FC) {
  const folders = mockMediaFolders()
  const items = mockMediaItems()
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
        JSON.stringify({ docs: items, totalDocs: items.length }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return originalFetch(input)
  }

  return <Story />
}

const meta = {
  title: 'Admin/MediaPickerModal',
  component: MediaPickerModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [withMockFetch],
} satisfies Meta<typeof MediaPickerModal>

export default meta
type Story = StoryObj<typeof meta>

/** Default open state */
export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('close'),
    onSelect: (item) => console.log('selected:', item.filename),
  },
}

/** Images only filter */
export const ImagesOnly: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('close'),
    onSelect: (item) => console.log('selected:', item.filename),
    mimeTypeFilter: 'image/',
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    isOpen: true,
    onClose: () => console.log('close'),
    onSelect: (item) => console.log('selected:', item.filename),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}
