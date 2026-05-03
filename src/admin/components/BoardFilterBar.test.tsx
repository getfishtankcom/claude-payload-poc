/**
 * Unit tests for BoardFilterBar.
 *
 * Mocks next/navigation so we can assert the bar reads the active board
 * from `useSearchParams()` and pushes the right query string when a
 * different board is clicked. The router push assertion is the contract:
 * - "All" clears the where param and resets the page param
 * - A board sets `where[board][equals]=<slug>` and resets the page param
 */
import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

const pushSpy = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushSpy,
    replace: () => {},
    refresh: () => {},
  }),
  useSearchParams: () => mockSearchParams,
}))

let mockSearchParams: URLSearchParams

import { BoardFilterBar } from './BoardFilterBar'

afterEach(() => {
  pushSpy.mockClear()
})

describe('<BoardFilterBar>', () => {
  it('renders six options including the "All" reset', () => {
    mockSearchParams = new URLSearchParams()
    render(<BoardFilterBar />)
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
    for (const label of ['AcSB', 'PSAB', 'CSSB', 'AASB', 'RASOC']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument()
    }
  })

  it('marks the active board with aria-pressed when its slug is in the URL', () => {
    mockSearchParams = new URLSearchParams('where[board][equals]=acsb')
    render(<BoardFilterBar />)
    const acsb = screen.getByRole('button', { name: 'AcSB' })
    expect(acsb).toHaveAttribute('aria-pressed', 'true')
    const all = screen.getByRole('button', { name: 'All' })
    expect(all).toHaveAttribute('aria-pressed', 'false')
  })

  it('marks "All" as active when no board param is set', () => {
    mockSearchParams = new URLSearchParams()
    render(<BoardFilterBar />)
    const all = screen.getByRole('button', { name: 'All' })
    expect(all).toHaveAttribute('aria-pressed', 'true')
  })

  it('clicking a board pushes the where param and clears pagination', () => {
    mockSearchParams = new URLSearchParams('page=4')
    render(<BoardFilterBar />)
    fireEvent.click(screen.getByRole('button', { name: 'PSAB' }))
    expect(pushSpy).toHaveBeenCalledTimes(1)
    const arg = pushSpy.mock.calls[0]?.[0] as string
    expect(arg).toContain('where%5Bboard%5D%5Bequals%5D=psab')
    expect(arg).not.toContain('page=4')
  })

  it('clicking "All" removes the where param', () => {
    mockSearchParams = new URLSearchParams('where[board][equals]=psab&page=2')
    render(<BoardFilterBar />)
    fireEvent.click(screen.getByRole('button', { name: 'All' }))
    expect(pushSpy).toHaveBeenCalledTimes(1)
    const arg = pushSpy.mock.calls[0]?.[0] as string
    expect(arg).not.toContain('where')
    expect(arg).not.toContain('page=2')
  })
})
