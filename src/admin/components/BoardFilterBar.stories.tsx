/**
 * Storybook stories for BoardFilterBar.
 *
 * The bar reads/writes a `where[board][equals]=<slug>` URL param via
 * next/navigation. We stub the Next router so the stories work in
 * Storybook's Vite environment without an App Router runtime.
 */
import type { Meta, StoryObj } from '@storybook/react'
import { BoardFilterBar } from './BoardFilterBar'

// Vite hoists `vi.mock` only inside test files. For Storybook we instead
// monkey-patch `next/navigation`'s exports at module scope using a small
// alias trick — the stories never assert on router calls, they just need
// the module not to throw.
import * as nav from 'next/navigation'
;(nav as unknown as { useRouter: () => unknown }).useRouter = () => ({
  push: () => {},
  replace: () => {},
  refresh: () => {},
})

const makeSearchParams = (active: string | null) => {
  const usp = new URLSearchParams()
  if (active) usp.set('where[board][equals]', active)
  return {
    get: (key: string) => usp.get(key),
    toString: () => usp.toString(),
  } as unknown as URLSearchParams
}

const meta = {
  title: 'Admin/BoardFilterBar',
  component: BoardFilterBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof BoardFilterBar>

export default meta
type Story = StoryObj<typeof meta>

export const AllBoards: Story = {
  decorators: [
    (Story) => {
      ;(nav as unknown as { useSearchParams: () => unknown }).useSearchParams = () =>
        makeSearchParams(null)
      return <Story />
    },
  ],
}

export const AcsbActive: Story = {
  decorators: [
    (Story) => {
      ;(nav as unknown as { useSearchParams: () => unknown }).useSearchParams = () =>
        makeSearchParams('acsb')
      return <Story />
    },
  ],
}

export const PsabActive: Story = {
  decorators: [
    (Story) => {
      ;(nav as unknown as { useSearchParams: () => unknown }).useSearchParams = () =>
        makeSearchParams('psab')
      return <Story />
    },
  ],
}
