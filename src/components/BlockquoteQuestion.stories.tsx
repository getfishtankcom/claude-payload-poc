/**
 * @description
 * Storybook stories for BlockquoteQuestion component.
 * Shows numbered question blockquotes with rich text content.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { BlockquoteQuestion } from './BlockquoteQuestion'

const meta = {
  title: 'UI/BlockquoteQuestion',
  component: BlockquoteQuestion,
  tags: ['autodocs'],
} satisfies Meta<typeof BlockquoteQuestion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    questionNumber: 1,
    questionText: null,
  },
}

export const Question2: Story = {
  args: {
    questionNumber: 2,
    questionText: null,
  },
}

export const HighNumber: Story = {
  args: {
    questionNumber: 15,
    questionText: null,
  },
}

export const Mobile: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
