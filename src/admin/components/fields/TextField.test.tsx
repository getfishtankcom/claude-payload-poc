import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { TextField } from './TextField'

const wrap = (
  ui: React.ReactNode,
  initialValues: Record<string, unknown> = { title: '' },
) => (
  <EditFormProvider initialValues={initialValues} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<TextField>', () => {
  it('renders the bound value from the form context', () => {
    render(wrap(<TextField name="title" label="Title" />, { title: 'Hello' }))
    expect((screen.getByLabelText(/Title/) as HTMLInputElement).value).toBe('Hello')
  })

  it('dispatches onChange through the form context', () => {
    render(wrap(<TextField name="title" label="Title" />))
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'Edited' } })
    expect((screen.getByLabelText(/Title/) as HTMLInputElement).value).toBe('Edited')
  })

  it('renders a validation error inline when required and empty', () => {
    render(wrap(<TextField name="title" label="Title" required />))
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('clears the error once filled', () => {
    render(wrap(<TextField name="title" label="Title" required />))
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'now-set' } })
    expect(screen.queryByText('Required')).not.toBeInTheDocument()
  })

  it('renders read-only when locked by another user', () => {
    render(
      wrap(<TextField name="title" label="Title" lock="locked-by-other" />, { title: 'X' }),
    )
    expect((screen.getByLabelText(/Title/) as HTMLInputElement).readOnly).toBe(true)
    expect(screen.getByText('locked')).toBeInTheDocument()
  })

  it('renders a textarea in multiline variant', () => {
    render(wrap(<TextField name="body" label="Body" multiline rows={3} />, { body: '' }))
    const el = screen.getByLabelText('Body') as HTMLTextAreaElement
    expect(el.tagName).toBe('TEXTAREA')
    expect(el.rows).toBe(3)
  })

  it('flags dirty when the value differs from the initial', () => {
    render(wrap(<TextField name="title" label="Title" />, { title: 'A' }))
    expect(screen.queryByText('modified')).not.toBeInTheDocument()
    fireEvent.change(screen.getByLabelText(/Title/), { target: { value: 'B' } })
    expect(screen.getByText('modified')).toBeInTheDocument()
  })
})
