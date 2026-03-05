/**
 * @description
 * Storybook stories for SiteFooter component.
 * Shows desktop and mobile viewport variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SiteFooter } from './SiteFooter'

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

export const Default: Story = {}

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}
