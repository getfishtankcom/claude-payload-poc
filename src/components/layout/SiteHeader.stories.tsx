/**
 * @description
 * Storybook stories for SiteHeader component.
 * Shows desktop and mobile viewport variants with CMS navigation data.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { SiteHeader } from './SiteHeader'
import { mockNavigationData } from '@/__mocks__/cms-data'

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

export const Default: Story = {
  args: {
    navigation: mockNavigationData(),
  },
}

export const Desktop: Story = {
  args: {
    navigation: mockNavigationData(),
  },
  parameters: {
    viewport: { defaultViewport: 'responsive' },
  },
}

export const Mobile: Story = {
  args: {
    navigation: mockNavigationData(),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}

export const EmptyNavigation: Story = {
  args: {
    navigation: null,
  },
}
