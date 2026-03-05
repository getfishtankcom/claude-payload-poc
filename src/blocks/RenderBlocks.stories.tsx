/**
 * @description
 * Storybook stories for RenderBlocks component.
 * Demonstrates rendering mixed block types in sequence.
 *
 * @notes
 * - Uses inline mock data since blocks use Lexical JSON
 * - Shows CTA, RichText, NewsGrid, and BrowseByStandard blocks together
 */
import type { Meta, StoryObj } from '@storybook/react'

import { RenderBlocks } from './RenderBlocks'

const meta = {
  title: 'Blocks/RenderBlocks',
  component: RenderBlocks,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof RenderBlocks>

export default meta
type Story = StoryObj<typeof meta>

export const MixedBlocks: Story = {
  args: {
    blocks: [
      {
        blockType: 'cta',
        variant: 'light',
        richText: null,
        links: null,
      },
      {
        blockType: 'browseByStandard',
        heading: 'Browse by Standard',
        categories: [
          {
            name: 'Sustainability',
            links: [
              { label: 'CSDS', url: '/standards/csds' },
              { label: 'CSSB', url: '/boards/cssb' },
            ],
          },
          {
            name: 'Accounting',
            links: [
              { label: 'IFRS', url: '/standards/ifrs' },
              { label: 'ASPE', url: '/standards/aspe' },
            ],
          },
        ],
      },
      {
        blockType: 'newsGrid',
        heading: 'Latest News',
        news_count: 3,
        show_view_all: true,
        populateBy: 'selection',
        selectedNews: [],
      },
    ],
  },
}

export const EmptyBlocks: Story = {
  args: {
    blocks: [],
  },
}

export const NullBlocks: Story = {
  args: {
    blocks: null,
  },
}

export const SingleCTABlock: Story = {
  args: {
    blocks: [
      {
        blockType: 'cta',
        variant: 'purple',
        richText: null,
        links: null,
      },
    ],
  },
}
