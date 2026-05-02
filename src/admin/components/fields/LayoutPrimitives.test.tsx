import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { GroupField, RowField, TabsField } from './LayoutPrimitives'

describe('<TabsField>', () => {
  const TABS = [
    { id: 'a', label: 'A', content: <div>panel-a</div> },
    { id: 'b', label: 'B', content: <div>panel-b</div> },
  ]

  it('renders the first tab active by default', () => {
    render(<TabsField tabs={TABS} />)
    expect(screen.getByText('panel-a')).toBeInTheDocument()
    expect(screen.queryByText('panel-b')).not.toBeInTheDocument()
  })

  it('switches active tab on click', () => {
    render(<TabsField tabs={TABS} />)
    fireEvent.click(screen.getByRole('tab', { name: 'B' }))
    expect(screen.getByText('panel-b')).toBeInTheDocument()
    expect(screen.queryByText('panel-a')).not.toBeInTheDocument()
  })

  it('respects controlled activeId', () => {
    const { rerender } = render(<TabsField tabs={TABS} activeId="a" />)
    expect(screen.getByText('panel-a')).toBeInTheDocument()
    rerender(<TabsField tabs={TABS} activeId="b" />)
    expect(screen.getByText('panel-b')).toBeInTheDocument()
  })
})

describe('<GroupField>', () => {
  it('renders open by default with children visible', () => {
    render(
      <GroupField label="Section">
        <p>inner</p>
      </GroupField>,
    )
    expect(screen.getByText('inner')).toBeInTheDocument()
  })

  it('collapses on click', () => {
    render(
      <GroupField label="Section">
        <p>inner</p>
      </GroupField>,
    )
    fireEvent.click(screen.getByRole('button', { name: /Section/ }))
    expect(screen.queryByText('inner')).not.toBeInTheDocument()
  })

  it('respects defaultOpen=false', () => {
    render(
      <GroupField label="Section" defaultOpen={false}>
        <p>inner</p>
      </GroupField>,
    )
    expect(screen.queryByText('inner')).not.toBeInTheDocument()
  })
})

describe('<RowField>', () => {
  it('renders all children', () => {
    render(
      <RowField>
        <span>one</span>
        <span>two</span>
        <span>three</span>
      </RowField>,
    )
    expect(screen.getByText('one')).toBeInTheDocument()
    expect(screen.getByText('two')).toBeInTheDocument()
    expect(screen.getByText('three')).toBeInTheDocument()
  })
})
