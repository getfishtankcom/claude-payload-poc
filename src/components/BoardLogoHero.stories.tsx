/**
 * @description
 * Storybook stories for BoardLogoHero component.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { BoardLogoHero } from './BoardLogoHero'

const meta = {
  title: 'Standards/BoardLogoHero',
  component: BoardLogoHero,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BoardLogoHero>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    logo: '/placeholder-logo.svg',
    boardName: 'Accounting Standards Board',
    backgroundColor: '#601F5B',
  },
}

export const BlueBoardColor: Story = {
  args: {
    logo: '/placeholder-logo.svg',
    boardName: 'Public Sector Accounting Board',
    backgroundColor: '#00438C',
  },
}

export const RedBrownBoardColor: Story = {
  args: {
    logo: '/placeholder-logo.svg',
    boardName: 'Auditing and Assurance Standards Board',
    backgroundColor: '#983232',
  },
}

export const Mobile: Story = {
  args: {
    logo: '/placeholder-logo.svg',
    boardName: 'Canadian Sustainability Standards Board',
    backgroundColor: '#00438C',
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
