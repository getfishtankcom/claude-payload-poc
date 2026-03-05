/**
 * @description
 * Stories for the Card compound component — Card, Card.Header, Card.Body, Card.Footer.
 * Demonstrates the flexible slot-based composition pattern.
 *
 * @dependencies
 * - Card: Compound component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Card } from './Card'

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  args: {
    children: null,
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'article', 'section'],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

/** Minimal card with body content only */
export const Default: Story = {
  render: () => (
    <Card>
      <Card.Body>
        <p>A simple card with body content.</p>
      </Card.Body>
    </Card>
  ),
}

/** Card with all three slots populated */
export const WithAllSlots: Story = {
  render: () => (
    <Card>
      <Card.Header>
        <h3 className="text-lg font-semibold">Exposure Draft: Revenue Recognition</h3>
      </Card.Header>
      <Card.Body>
        <p className="text-text-muted">
          This exposure draft proposes amendments to the revenue recognition standard
          for not-for-profit organizations.
        </p>
      </Card.Body>
      <Card.Footer>
        <span className="text-sm text-text-muted">Comment period ends: March 31, 2026</span>
      </Card.Footer>
    </Card>
  ),
}

/** Card rendered as an article element for semantic HTML */
export const AsArticle: Story = {
  render: () => (
    <Card as="article">
      <Card.Header>
        <h3 className="text-lg font-semibold">AcSB Decision Summary</h3>
      </Card.Header>
      <Card.Body>
        <p className="text-text-muted">
          At its June meeting, the AcSB decided to proceed with amendments to
          Section 3856, Financial Instruments.
        </p>
      </Card.Body>
    </Card>
  ),
}

/** Card without border — using className override */
export const NoBorder: Story = {
  render: () => (
    <Card className="border-0 shadow-none">
      <Card.Body>
        <p>A borderless card variant for embedded content.</p>
      </Card.Body>
    </Card>
  ),
}
