import * as React from 'react'
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { RelationshipField, type RelationshipOption } from './RelationshipField'

afterEach(() => vi.useRealTimers())

const wrap = (ui: React.ReactNode, initial: Record<string, unknown>) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

const ALL: RelationshipOption[] = [
  { id: '1', label: 'Apple', breadcrumb: 'Fruit > Apple' },
  { id: '2', label: 'Banana', breadcrumb: 'Fruit > Banana' },
  { id: '3', label: 'Cherry', breadcrumb: 'Fruit > Cherry' },
]

const makeLoader = () => {
  const fn = vi.fn(async (q: string) =>
    ALL.filter((o) => o.label.toLowerCase().includes(q.toLowerCase())),
  )
  return fn
}

describe('<RelationshipField> single mode', () => {
  it('debounces searches and only invokes loader after the quiet period', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: false })
    const load = makeLoader()
    render(wrap(<RelationshipField name="ref" label="Ref" loadOptions={load} />, { ref: null }))

    fireEvent.click(screen.getByTestId('rel-ref-trigger'))
    // Initial load fires after the debounce window even with empty query.
    await act(async () => {
      await vi.advanceTimersByTimeAsync(260)
    })
    expect(load).toHaveBeenCalledWith('')

    // Two rapid changes — only the last should trigger a load.
    fireEvent.change(screen.getByTestId('rel-ref-search'), { target: { value: 'an' } })
    await act(async () => {
      await vi.advanceTimersByTimeAsync(100)
    })
    fireEvent.change(screen.getByTestId('rel-ref-search'), { target: { value: 'ana' } })
    expect(load).toHaveBeenCalledTimes(1)

    await act(async () => {
      await vi.advanceTimersByTimeAsync(260)
    })
    expect(load).toHaveBeenLastCalledWith('ana')
  })

  it('selects an option and closes the listbox', async () => {
    const load = makeLoader()
    render(wrap(<RelationshipField name="ref" label="Ref" loadOptions={load} />, { ref: null }))
    fireEvent.click(screen.getByTestId('rel-ref-trigger'))
    await waitFor(() => expect(screen.getByRole('option', { name: /Apple/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('option', { name: /Apple/ }))
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(screen.getByTestId('rel-ref-trigger').textContent).toContain('Apple')
  })

  it('renders breadcrumb under each option', async () => {
    const load = makeLoader()
    render(wrap(<RelationshipField name="ref" label="Ref" loadOptions={load} />, { ref: null }))
    fireEvent.click(screen.getByTestId('rel-ref-trigger'))
    await waitFor(() => expect(screen.getByText('Fruit > Apple')).toBeInTheDocument())
  })
})

describe('<RelationshipField> multi mode', () => {
  it('toggles selections and stores an array', async () => {
    const load = makeLoader()
    render(
      wrap(<RelationshipField name="ref" label="Ref" multi loadOptions={load} />, { ref: [] }),
    )
    fireEvent.click(screen.getByTestId('rel-ref-trigger'))
    await waitFor(() => expect(screen.getByRole('option', { name: /Apple/ })).toBeInTheDocument())
    fireEvent.click(screen.getByRole('option', { name: /Apple/ }))
    fireEvent.click(screen.getByRole('option', { name: /Cherry/ }))
    expect(screen.getByTestId('rel-ref-trigger').textContent).toContain('Apple')
    expect(screen.getByTestId('rel-ref-trigger').textContent).toContain('Cherry')
  })
})

describe('<RelationshipField> tree-picker mode', () => {
  it('walks the tree and selects a node', () => {
    const tree = [
      {
        id: 'root',
        label: 'Root',
        children: [{ id: 'child', label: 'Child' }],
      },
    ]
    render(wrap(<RelationshipField name="ref" label="Ref" tree={tree} />, { ref: null }))
    fireEvent.click(screen.getByTestId('rel-ref-trigger'))
    expect(screen.getByRole('option', { name: 'Root' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Child' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'Child' }))
    expect(screen.getByTestId('rel-ref-trigger').textContent).toContain('Child')
  })
})

describe('<RelationshipField> create-on-the-fly', () => {
  it('exposes a + Create row when query is set', async () => {
    const load = vi.fn(async () => [])
    const onCreate = vi.fn(async (label: string) => ({
      id: `new-${label}`,
      label,
    }))
    render(
      wrap(
        <RelationshipField name="ref" label="Ref" loadOptions={load} onCreate={onCreate} />,
        { ref: null },
      ),
    )
    fireEvent.click(screen.getByTestId('rel-ref-trigger'))
    fireEvent.change(screen.getByTestId('rel-ref-search'), { target: { value: 'New thing' } })
    const createBtn = await waitFor(() => screen.getByTestId('rel-ref-create'))
    fireEvent.click(createBtn)
    await waitFor(() => expect(onCreate).toHaveBeenCalledWith('New thing'))
  })
})
