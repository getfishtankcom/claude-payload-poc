/**
 * @description
 * Storybook stories for the BoardNav component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { BoardNav } from './BoardNav'
import { BOARDS } from '@/__mocks__/cms-data'

const boards = [
  { id: BOARDS.cssb.id, name: BOARDS.cssb.name, slug: BOARDS.cssb.slug, abbreviation: BOARDS.cssb.abbreviation },
  { id: BOARDS.acsb.id, name: BOARDS.acsb.name, slug: BOARDS.acsb.slug, abbreviation: BOARDS.acsb.abbreviation },
  { id: BOARDS.psab.id, name: BOARDS.psab.name, slug: BOARDS.psab.slug, abbreviation: BOARDS.psab.abbreviation },
  { id: BOARDS.aasb.id, name: BOARDS.aasb.name, slug: BOARDS.aasb.slug, abbreviation: BOARDS.aasb.abbreviation },
]

const meta = {
  title: 'Board/BoardNav',
  component: BoardNav,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BoardNav>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    boards,
    activeBoard: null,
    onBoardSelect: () => {},
  },
}

export const WithActiveBoard: Story = {
  args: {
    boards,
    activeBoard: 'psab',
    onBoardSelect: () => {},
  },
}

export const Mobile: Story = {
  args: {
    boards,
    activeBoard: 'acsb',
    onBoardSelect: () => {},
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
