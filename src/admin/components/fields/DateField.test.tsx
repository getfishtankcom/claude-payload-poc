import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import {
  DateField,
  DateTimeField,
  isoToLocalInput,
  localInputToIso,
} from './DateField'

const wrap = (
  ui: React.ReactNode,
  initial: Record<string, unknown> = { d: '' },
) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<DateField>', () => {
  it('renders the value as YYYY-MM-DD', () => {
    render(wrap(<DateField name="d" label="When" />, { d: '2026-05-02' }))
    expect((screen.getByLabelText(/When/) as HTMLInputElement).value).toBe('2026-05-02')
  })

  it('dispatches onChange with the new ISO date', () => {
    render(wrap(<DateField name="d" label="When" />))
    fireEvent.change(screen.getByLabelText(/When/), { target: { value: '2026-12-31' } })
    expect((screen.getByLabelText(/When/) as HTMLInputElement).value).toBe('2026-12-31')
  })

  it('flags required when empty', () => {
    render(wrap(<DateField name="d" label="When" required />))
    expect(screen.getByText('Required')).toBeInTheDocument()
  })
})

describe('<DateTimeField> helpers', () => {
  it('isoToLocalInput strips seconds and converts to local-input format', () => {
    // Construct a known local-time then round-trip to ISO and back.
    const local = '2026-05-02T13:45'
    const iso = localInputToIso(local)!
    expect(isoToLocalInput(iso)).toBe(local)
  })

  it('localInputToIso returns null for empty', () => {
    expect(localInputToIso('')).toBeNull()
  })

  it('localInputToIso returns null for malformed input', () => {
    expect(localInputToIso('not-a-date')).toBeNull()
  })
})

describe('<DateTimeField>', () => {
  it('renders a datetime-local input', () => {
    const iso = new Date('2026-05-02T13:45:00').toISOString()
    render(wrap(<DateTimeField name="d" label="When" />, { d: iso }))
    const input = screen.getByLabelText(/When/) as HTMLInputElement
    expect(input.type).toBe('datetime-local')
    expect(input.value).toBe(isoToLocalInput(iso))
  })
})
