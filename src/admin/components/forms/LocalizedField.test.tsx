import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { TextField } from '../fields/TextField'
import { EditFormProvider } from './EditFormProvider'
import { LocalizedField, localeFieldName } from './LocalizedField'

const wrap = (
  ui: React.ReactNode,
  initial: Record<string, unknown>,
) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('localeFieldName', () => {
  it('joins base + locale with double-underscore', () => {
    expect(localeFieldName('title', 'en')).toBe('title__en')
    expect(localeFieldName('title', 'fr')).toBe('title__fr')
  })
})

describe('<LocalizedField> side-by-side mode', () => {
  it('renders both locales as separate fields', () => {
    render(
      wrap(
        <LocalizedField
          name="title"
          label="Title"
          renderField={(localeName) => <TextField name={localeName} label={localeName} />}
        />,
        { title__en: 'EN value', title__fr: 'FR value' },
      ),
    )
    expect((screen.getByLabelText('title__en') as HTMLInputElement).value).toBe('EN value')
    expect((screen.getByLabelText('title__fr') as HTMLInputElement).value).toBe('FR value')
  })

  it('writes to the per-locale form key on change', () => {
    render(
      wrap(
        <LocalizedField
          name="title"
          renderField={(localeName) => <TextField name={localeName} label={localeName} />}
        />,
        { title__en: '', title__fr: '' },
      ),
    )
    fireEvent.change(screen.getByLabelText(/title__en/), { target: { value: 'hello' } })
    expect((screen.getByLabelText(/title__en/) as HTMLInputElement).value).toBe('hello')
    expect((screen.getByLabelText(/title__fr/) as HTMLInputElement).value).toBe('')
  })
})

describe('<LocalizedField> toggle mode', () => {
  it('only renders the active locale and switches on click', () => {
    render(
      wrap(
        <LocalizedField
          name="title"
          label="Title"
          mode="toggle"
          renderField={(localeName) => <TextField name={localeName} label={localeName} />}
        />,
        { title__en: 'EN', title__fr: 'FR' },
      ),
    )
    expect(screen.getByLabelText('title__en')).toBeInTheDocument()
    expect(screen.queryByLabelText('title__fr')).not.toBeInTheDocument()
    fireEvent.click(screen.getByTestId('localized-title-fr'))
    expect(screen.getByLabelText('title__fr')).toBeInTheDocument()
    expect(screen.queryByLabelText('title__en')).not.toBeInTheDocument()
  })
})
