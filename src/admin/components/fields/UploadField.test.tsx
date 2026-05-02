import * as React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { UploadField } from './UploadField'

const wrap = (
  ui: React.ReactNode,
  initial: Record<string, unknown>,
) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<UploadField>', () => {
  it('renders empty state with a Choose button', () => {
    render(wrap(<UploadField name="cover" label="Cover" />, { cover: null }))
    expect(screen.getByText('No file selected')).toBeInTheDocument()
    expect(screen.getByTestId('upload-cover-pick').textContent).toBe('Choose…')
  })

  it('renders the resolved label + Replace + Remove when a value is set', async () => {
    const resolveItem = vi.fn(async () => ({ url: 'http://x/img.png', alt: 'Cover image' }))
    render(
      wrap(<UploadField name="cover" label="Cover" resolveItem={resolveItem} />, {
        cover: '42',
      }),
    )
    await waitFor(() => expect(screen.getByText('Cover image')).toBeInTheDocument())
    expect(screen.getByTestId('upload-cover-pick').textContent).toBe('Replace')
    expect(screen.getByTestId('upload-cover-remove')).toBeInTheDocument()
  })

  it('clears the value when Remove is clicked', async () => {
    const resolveItem = vi.fn(async () => ({ url: 'http://x/img.png', alt: 'Cover image' }))
    render(
      wrap(<UploadField name="cover" label="Cover" resolveItem={resolveItem} />, {
        cover: '42',
      }),
    )
    await waitFor(() => expect(screen.getByText('Cover image')).toBeInTheDocument())
    fireEvent.click(screen.getByTestId('upload-cover-remove'))
    expect(screen.getByText('No file selected')).toBeInTheDocument()
  })

  it('flags required when empty', () => {
    render(wrap(<UploadField name="cover" label="Cover" required />, { cover: null }))
    expect(screen.getByText('Required')).toBeInTheDocument()
  })

  it('disables actions when locked by another user', () => {
    render(
      wrap(
        <UploadField name="cover" label="Cover" lock="locked-by-other" />,
        { cover: '1' },
      ),
    )
    expect((screen.getByTestId('upload-cover-pick') as HTMLButtonElement).disabled).toBe(true)
    expect((screen.getByTestId('upload-cover-remove') as HTMLButtonElement).disabled).toBe(true)
  })
})
