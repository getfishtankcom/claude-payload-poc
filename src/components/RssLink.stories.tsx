import type { Meta, StoryObj } from '@storybook/react'
import { RssLink } from './RssLink'

const meta: Meta<typeof RssLink> = {
  component: RssLink,
  title: 'Utilities/RssLink',
}
export default meta
type Story = StoryObj<typeof RssLink>

export const Default: Story = {
  args: { feedUrl: 'https://frascanada.ca/rss.xml' },
}

export const CustomLabel: Story = {
  args: { feedUrl: 'https://frascanada.ca/rss.xml', label: 'Subscribe via RSS' },
}
