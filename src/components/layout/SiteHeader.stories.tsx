/**
 * @description
 * Storybook stories for SiteHeader component.
 * Shows desktop and mobile viewport variants.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SiteHeader } from './SiteHeader'

const meta = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
      },
    },
  },
} satisfies Meta<typeof SiteHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Desktop: Story = {
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

export const Tablet: Story = {
  parameters: {
    viewport: { defaultViewport: 'tablet' },
  },
}

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
