import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { RichTextField } from './RichTextField'

const wrap = (
  ui: React.ReactNode,
  initial: Record<string, unknown> = { body: null },
) => (
  <EditFormProvider initialValues={initial} onSubmit={async () => {}}>
    {ui}
  </EditFormProvider>
)

describe('<RichTextField>', () => {
  it('renders the toolbar with formatting controls', () => {
    render(wrap(<RichTextField name="body" label="Body" />))
    const toolbar = screen.getByTestId('richtext-toolbar')
    expect(toolbar).toBeInTheDocument()
    // Bold / Italic / Underline / H1 / H2 / H3 / Quote / Bulleted / Numbered / Link / Undo / Redo
    expect(screen.getByLabelText('Bold')).toBeInTheDocument()
    expect(screen.getByLabelText('Italic')).toBeInTheDocument()
    expect(screen.getByLabelText('Underline')).toBeInTheDocument()
    expect(screen.getByLabelText('Heading 1')).toBeInTheDocument()
    expect(screen.getByLabelText('Heading 2')).toBeInTheDocument()
    expect(screen.getByLabelText('Heading 3')).toBeInTheDocument()
    expect(screen.getByLabelText('Quote')).toBeInTheDocument()
    expect(screen.getByLabelText('Bulleted list')).toBeInTheDocument()
    expect(screen.getByLabelText('Numbered list')).toBeInTheDocument()
    expect(screen.getByLabelText('Insert link')).toBeInTheDocument()
    expect(screen.getByLabelText('Undo')).toBeInTheDocument()
    expect(screen.getByLabelText('Redo')).toBeInTheDocument()
  })

  it('shows the Insert image button only when pickImage is provided', () => {
    const { rerender } = render(wrap(<RichTextField name="body" label="Body" />))
    expect(screen.queryByLabelText('Insert image')).not.toBeInTheDocument()
    rerender(
      wrap(
        <RichTextField name="body" label="Body" pickImage={() => {}} />,
      ),
    )
    expect(screen.getByLabelText('Insert image')).toBeInTheDocument()
  })

  it('renders a contentEditable region', () => {
    render(wrap(<RichTextField name="body" label="Body" />))
    const editor = screen.getByTestId('richtext-body-editor')
    expect(editor.getAttribute('contenteditable')).toBe('true')
  })

  it('renders read-only when locked by another user', () => {
    render(
      wrap(
        <RichTextField name="body" label="Body" lock="locked-by-other" />,
      ),
    )
    const editor = screen.getByTestId('richtext-body-editor')
    expect(editor.getAttribute('contenteditable')).toBe('false')
  })
})
