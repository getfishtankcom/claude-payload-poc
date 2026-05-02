import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FieldSection } from './FieldSection'

describe('<FieldSection>', () => {
  it('renders title + children expanded by default', () => {
    render(
      <FieldSection title="Content">
        <p>inner</p>
      </FieldSection>,
    )
    expect(screen.getByRole('button', { name: /Content/ })).toBeInTheDocument()
    expect(screen.getByText('inner')).toBeVisible()
  })

  it('collapses on header click', () => {
    render(
      <FieldSection title="Content">
        <p>inner</p>
      </FieldSection>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Content/ }))
    expect(screen.queryByText('inner')).not.toBeVisible()
  })

  it('respects defaultCollapsed=true', () => {
    render(
      <FieldSection title="Content" defaultCollapsed>
        <p>inner</p>
      </FieldSection>,
    )
    expect(screen.queryByText('inner')).not.toBeVisible()
  })

  it('renders Shared badge when shared=true', () => {
    render(
      <FieldSection title="Content" shared>
        <p>inner</p>
      </FieldSection>,
    )
    expect(screen.getByLabelText('Shared across locales — not localized')).toBeInTheDocument()
  })

  it('renders Locked badge when locked=true', () => {
    render(
      <FieldSection title="Content" locked>
        <p>inner</p>
      </FieldSection>,
    )
    expect(screen.getByLabelText('Locked by another user')).toBeInTheDocument()
  })

  it('omits both badges when neither is set', () => {
    render(
      <FieldSection title="Content">
        <p>inner</p>
      </FieldSection>,
    )
    expect(
      screen.queryByLabelText('Shared across locales — not localized'),
    ).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Locked by another user')).not.toBeInTheDocument()
  })
})
