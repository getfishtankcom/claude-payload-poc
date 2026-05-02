/**
 * @description
 * Storybook stories for SiteFooter component.
 * Shows desktop and mobile variants with CMS footer data.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SiteFooter } from './SiteFooter'
import { mockFooterData } from '@/__mocks__/cms-data'

const meta = {
  title: 'Layout/SiteFooter',
  component: SiteFooter,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof SiteFooter>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    footer: mockFooterData(),
  },
}

export const Mobile: Story = {
  args: {
    footer: mockFooterData(),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const EmptyFooter: Story = {
  args: {
    footer: null,
  },
}
