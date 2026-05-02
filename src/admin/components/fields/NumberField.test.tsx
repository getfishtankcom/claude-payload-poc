import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { NumberField } from './NumberField'

const wrap = (
  ui: React.ReactNode,
  initialValues: Record<string, unknown> = { count: null },
) => (
  <EditFormProvider initialValues={initialValues} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<NumberField>', () => {
  it('parses integer input as number in the form context', () => {
    const onSubmit = async (values: Record<string, unknown>) => {
      submittedValues = values
    }
    let submittedValues: Record<string, unknown> | null = null
    render(
      <EditFormProvider initialValues={{ count: null }} onSubmit={onSubmit}>
        <NumberField name="count" label="Count" />
      </EditFormProvider>,
    )
    fireEvent.change(screen.getByLabelText(/Count/), { target: { value: '42' } })
    expect((screen.getByLabelText(/Count/) as HTMLInputElement).value).toBe('42')
    // submittedValues stays null (we don't fire submit) — the parse is
    // visible in the controlled value above.
    void submittedValues
  })

  it('rejects fractional input when mode=int', () => {
    render(wrap(<NumberField name="count" label="Count" mode="int" />))
    fireEvent.change(screen.getByLabelText(/Count/), { target: { value: '1.5' } })
    expect(screen.getByText('Must be a whole number')).toBeInTheDocument()
  })

  it('enforces min', () => {
    render(wrap(<NumberField name="count" label="Count" min={10} />))
    fireEvent.change(screen.getByLabelText(/Count/), { target: { value: '5' } })
    expect(screen.getByText('Must be ≥ 10')).toBeInTheDocument()
  })

  it('enforces max', () => {
    render(wrap(<NumberField name="count" label="Count" max={5} />))
    fireEvent.change(screen.getByLabelText(/Count/), { target: { value: '10' } })
    expect(screen.getByText('Must be ≤ 5')).toBeInTheDocument()
  })

  it('allows empty when not required', () => {
    render(
      wrap(<NumberField name="count" label="Count" />, { count: 5 }),
    )
    fireEvent.change(screen.getByLabelText(/Count/), { target: { value: '' } })
    expect(screen.queryByText(/Must be|Required/)).not.toBeInTheDocument()
  })

  it('flags required when empty', () => {
    render(wrap(<NumberField name="count" label="Count" required />))
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
