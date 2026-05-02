import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { SelectField } from './SelectField'

const FLAT_OPTIONS = [
  { value: 'a', label: 'Apple' },
  { value: 'b', label: 'Banana' },
  { value: 'c', label: 'Cherry' },
]

const GROUPED_OPTIONS = [
  { label: 'Fruits', options: FLAT_OPTIONS },
  { label: 'Other', options: [{ value: 'z', label: 'Zucchini' }] },
]

const wrap = (
  ui: React.ReactNode,
  initial: Record<string, unknown> = { fruit: '' },
) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<SelectField>', () => {
  it('renders single-select with options + placeholder', () => {
    render(wrap(<SelectField name="fruit" label="Fruit" options={FLAT_OPTIONS} />))
    const select = screen.getByLabelText(/Fruit/) as HTMLSelectElement
    expect(select.tagName).toBe('SELECT')
    expect(screen.getByRole('option', { name: 'Apple' })).toBeInTheDocument()
  })

  it('dispatches onChange in single mode', () => {
    render(wrap(<SelectField name="fruit" label="Fruit" options={FLAT_OPTIONS} />))
    fireEvent.change(screen.getByLabelText(/Fruit/), { target: { value: 'b' } })
    expect((screen.getByLabelText(/Fruit/) as HTMLSelectElement).value).toBe('b')
  })

  it('supports multi mode with array values', () => {
    render(
      wrap(
        <SelectField name="fruit" label="Fruit" options={FLAT_OPTIONS} multi />,
        { fruit: [] },
      ),
    )
    const select = screen.getByLabelText(/Fruit/) as HTMLSelectElement
    // Programmatically select multiple options.
    Array.from(select.options).forEach((opt) => {
      if (['a', 'c'].includes(opt.value)) opt.selected = true
    })
    fireEvent.change(select)
    const picked = Array.from(select.selectedOptions, (o) => o.value)
    expect(picked).toEqual(['a', 'c'])
  })

  it('renders grouped options as <optgroup>', () => {
    render(wrap(<SelectField name="fruit" label="Fruit" options={GROUPED_OPTIONS} />))
    expect(screen.getByRole('group', { name: 'Fruits' })).toBeInTheDocument()
    expect(screen.getByRole('group', { name: 'Other' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Zucchini' })).toBeInTheDocument()
  })

  it('searchable variant filters options', () => {
    render(
      wrap(
        <SelectField name="fruit" label="Fruit" options={FLAT_OPTIONS} searchable />,
      ),
    )
    fireEvent.click(screen.getByTestId('searchable-fruit-trigger'))
    fireEvent.change(screen.getByTestId('searchable-fruit-filter'), {
      target: { value: 'an' },
    })
    expect(screen.getByRole('option', { name: 'Banana' })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: 'Cherry' })).not.toBeInTheDocument()
  })

  it('disables when locked by another user', () => {
    render(
      wrap(
        <SelectField
          name="fruit"
          label="Fruit"
          options={FLAT_OPTIONS}
          lock="locked-by-other"
        />,
        { fruit: 'a' },
      ),
    )
    expect((screen.getByLabelText(/Fruit/) as HTMLSelectElement).disabled).toBe(true)
  })
})
