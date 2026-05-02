/**
 * @description
 * Stories for the Container component — default (1440px) and narrow (1200px) variants.
 * Shows responsive padding behavior at different viewport sizes.
 *
 * @dependencies
 * - Container: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Container } from './Container'

const meta = {
  title: 'UI/Container',
  component: Container,
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'narrow'],
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'main'],
    },
  },
} satisfies Meta<typeof Container>

export default meta
type Story = StoryObj<typeof meta>

/** Default container — max-width 1440px with responsive padding */
export const Default: Story = {
  render: () => (
    <Container>
      <div className="bg-alt p-4 text-center">
        Default container (max-width: 1440px)
      </div>
    </Container>
  ),
}

/** Narrow container — max-width 1200px for content-focused layouts */
export const Narrow: Story = {
  render: () => (
    <Container variant="narrow">
      <div className="bg-alt p-4 text-center">
        Narrow container (max-width: 1200px)
      </div>
    </Container>
  ),
}

/** Container as main element for page-level wrapping */
export const AsMain: Story = {
  render: () => (
    <Container as="main">
      <div className="bg-alt p-4 text-center">
        Container rendered as {'<main>'} element
      </div>
    </Container>
  ),
}
