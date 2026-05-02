import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { CheckboxField, RadioField, ToggleField } from './BooleanFields'

const wrap = (
  ui: React.ReactNode,
  initial: Record<string, unknown>,
) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<CheckboxField>', () => {
  it('reflects the bound boolean value', () => {
    render(wrap(<CheckboxField name="agree" label="Agree" caption="OK" />, { agree: true }))
    expect((screen.getByLabelText(/Agree/) as HTMLInputElement).checked).toBe(true)
  })

  it('toggles on click', () => {
    render(wrap(<CheckboxField name="agree" label="Agree" />, { agree: false }))
    fireEvent.click(screen.getByLabelText(/Agree/))
    expect((screen.getByLabelText(/Agree/) as HTMLInputElement).checked).toBe(true)
  })

  it('flags required when unchecked', () => {
    render(wrap(<CheckboxField name="agree" label="Agree" required />, { agree: false }))
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('disables when locked by another user', () => {
    render(
      wrap(<CheckboxField name="agree" label="Agree" lock="locked-by-other" />, {
        agree: true,
      }),
    )
    expect((screen.getByLabelText(/Agree/) as HTMLInputElement).disabled).toBe(true)
  })
})

describe('<ToggleField>', () => {
  it('renders with role=switch and toggles', () => {
    render(wrap(<ToggleField name="on" label="On" />, { on: false }))
    const sw = screen.getByRole('switch') as HTMLInputElement
    expect(sw.checked).toBe(false)
    fireEvent.click(sw)
    expect(sw.checked).toBe(true)
  })
})

describe('<RadioField>', () => {
  const OPTIONS = [
    { value: 'a', label: 'Alpha' },
    { value: 'b', label: 'Beta' },
  ]

  it('renders one input per option, selects the bound value', () => {
    render(
      wrap(<RadioField name="pick" label="Pick" options={OPTIONS} />, { pick: 'b' }),
    )
    expect((screen.getByLabelText('Alpha') as HTMLInputElement).checked).toBe(false)
    expect((screen.getByLabelText('Beta') as HTMLInputElement).checked).toBe(true)
  })

  it('updates the bound value when a different option is picked', () => {
    render(
      wrap(<RadioField name="pick" label="Pick" options={OPTIONS} />, { pick: 'a' }),
    )
    fireEvent.click(screen.getByLabelText('Beta'))
    expect((screen.getByLabelText('Beta') as HTMLInputElement).checked).toBe(true)
  })

  it('flags required when nothing selected', () => {
    render(
      wrap(<RadioField name="pick" label="Pick" required options={OPTIONS} />, {
        pick: null,
      }),
    )
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})
