/**
 * @description
 * Stories for the Button component — 4 variants, 3 sizes, link rendering.
 * Demonstrates polymorphic behavior (button vs anchor) and ghost arrow suffix.
 *
 * @dependencies
 * - Button: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './Button'

const meta = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'dark'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

/** Default primary button — main CTA style */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Get Started',
  },
}

/** Secondary button — transparent with purple border */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Learn More',
  },
}

/** Ghost button — inline link style with arrow suffix */
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'View All News',
  },
}

/** Dark button — for use on colored backgrounds */
export const Dark: Story = {
  args: {
    variant: 'dark',
    children: 'Subscribe',
  },
}

/** Renders as an <a> tag when href is provided */
export const AsLink: Story = {
  args: {
    variant: 'primary',
    children: 'Visit RAS',
    href: 'https://frascanada.ca',
  },
}

/** Disabled state — reduced opacity, no pointer events */
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Unavailable',
    disabled: true,
  },
}

/** All 4 variants side-by-side for visual comparison */
export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="dark">Dark</Button>
    </div>
  ),
}

/** All 3 sizes for the primary variant */
export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
}
