import type { Meta, StoryObj } from '@storybook/react'
import { SiteAlert } from './SiteAlert'

const meta: Meta<typeof SiteAlert> = {
  component: SiteAlert,
  title: 'Layout/SiteAlert',
}
export default meta
type Story = StoryObj<typeof SiteAlert>

export const Info: Story = {
  args: {
    show: true,
    message: 'New website redesign rolling out — let us know what you think.',
    severity: 'info',
    alertId: 'sb-info',
    link: { url: '#', label: 'Learn more' },
  },
}

export const Warning: Story = {
  args: {
    show: true,
    message: 'Scheduled maintenance Saturday 9pm–midnight ET.',
    severity: 'warning',
    alertId: 'sb-warn',
  },
}

export const Urgent: Story = {
  args: {
    show: true,
    message: 'Service disruption: search results may be incomplete.',
    severity: 'urgent',
    alertId: 'sb-urgent',
  },
}

export const Hidden: Story = {
  args: {
    show: false,
    message: 'You should not see this.',
    alertId: 'sb-hidden',
  },
}
