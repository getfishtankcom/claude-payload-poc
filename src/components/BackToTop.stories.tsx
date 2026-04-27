import type { Meta, StoryObj } from '@storybook/react'
import { BackToTop } from './BackToTop'

const meta: Meta<typeof BackToTop> = {
  component: BackToTop,
  title: 'Utilities/BackToTop',
  decorators: [
    (Story) => (
      <div style={{ height: '1500px', padding: '24px' }}>
        <p style={{ marginBottom: '16px' }}>Scroll past 400px to reveal the button (bottom-right).</p>
        <Story />
      </div>
    ),
  ],
}
export default meta
type Story = StoryObj<typeof BackToTop>

export const Default: Story = {
  args: { threshold: 400 },
}

export const LowerThreshold: Story = {
  args: { threshold: 100 },
}
