/**
 * Unit tests for RedirectsImportButton.
 *
 * The button parses CSV input client-side and POSTs each row to
 * /api/redirects after first checking for duplicates. We stub fetch
 * to assert the dedupe + create paths and the user-facing status copy.
 */
import * as React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { RedirectsImportButton } from './RedirectsImportButton'

let fetchSpy: ReturnType<typeof vi.spyOn>

const csvFile = (text: string) =>
  new File([text], 'redirects.csv', { type: 'text/csv' })

beforeEach(() => {
  fetchSpy = vi.spyOn(globalThis, 'fetch')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('<RedirectsImportButton>', () => {
  it('renders the import button + format hint in idle state', () => {
    render(<RedirectsImportButton />)
    expect(screen.getByRole('button', { name: /Import CSV/i })).toBeInTheDocument()
    expect(screen.getByText(/from,to,type/)).toBeInTheDocument()
  })

  it('parses a header-less CSV and creates each row, skipping duplicates', async () => {
    fetchSpy.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      // Duplicate-check call: first row exists, second does not.
      if (url.includes('where[from][equals]')) {
        const isFirst = url.includes(encodeURIComponent('/old-a'))
        return new Response(JSON.stringify({ totalDocs: isFirst ? 1 : 0 }), { status: 200 })
      }
      // Create call.
      if (init?.method === 'POST') {
        return new Response(JSON.stringify({ id: 'mock' }), { status: 200 })
      }
      return new Response('{}', { status: 200 })
    })

    render(<RedirectsImportButton />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = csvFile('/old-a,/new-a,301\n/old-b,/new-b,302')
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)

    await waitFor(() =>
      expect(screen.getByText(/Imported 1 · skipped 1 duplicate/i)).toBeInTheDocument(),
    )
  })

  it('reports failures returned by the create endpoint', async () => {
    fetchSpy.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === 'string' ? input : input.toString()
      if (url.includes('where[from][equals]')) {
        return new Response(JSON.stringify({ totalDocs: 0 }), { status: 200 })
      }
      if (init?.method === 'POST') {
        return new Response('boom', { status: 500 })
      }
      return new Response('{}', { status: 200 })
    })

    render(<RedirectsImportButton />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = csvFile('from,to,type\n/x,/y,301')
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)

    await waitFor(() =>
      expect(screen.getByText(/0 · skipped 0 duplicate · 1 failed/i)).toBeInTheDocument(),
    )
  })

  it('shows a status message when the CSV has no valid rows', async () => {
    render(<RedirectsImportButton />)
    const input = document.querySelector('input[type="file"]') as HTMLInputElement
    const file = csvFile('# just a comment\n')
    Object.defineProperty(input, 'files', { value: [file], configurable: true })
    fireEvent.change(input)

    await waitFor(() =>
      expect(screen.getByText(/No valid rows found in CSV/i)).toBeInTheDocument(),
    )
    expect(fetchSpy).not.toHaveBeenCalled()
  })
})
