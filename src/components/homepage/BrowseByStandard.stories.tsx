/**
 * @description
 * Stories for BrowseByStandard — 4-column standards category grid.
 * Desktop shows all cards open; mobile shows expandable accordion.
 *
 * @dependencies
 * - BrowseByStandard: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { BrowseByStandard } from './BrowseByStandard'

const meta = {
  title: 'Homepage/BrowseByStandard',
  component: BrowseByStandard,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BrowseByStandard>

export default meta
type Story = StoryObj<typeof meta>

/** Default desktop view — all 4 category cards visible */
export const Default: Story = {}

/** Mobile viewport — expandable accordion cards */
export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
}

/** Tablet viewport — 2-column grid */
export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}
