import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { ArrayField } from './ArrayField'

type Row = { title: string }

const renderHarness = (initial: Row[] = [], required = false) => {
  return render(
    <EditFormProvider initialValues={{ items: initial }} onSubmit={async () => {}}>
      <ArrayField<Row>
        name="items"
        label="Items"
        required={required}
        newRow={() => ({ title: 'new' })}
        renderRow={(item, index, setItem) => (
          <input
            data-testid={`row-${index}-title`}
            value={item.title}
            onChange={(e) => setItem({ title: e.target.value })}
          />
        )}
      />
    </EditFormProvider>,
  )
}

describe('<ArrayField>', () => {
  it('renders empty state', () => {
    renderHarness([])
    expect(screen.getByText('(no rows)')).toBeInTheDocument()
  })

  it('adds a row and renders its editor', () => {
    renderHarness([])
    fireEvent.click(screen.getByTestId('array-items-add'))
    expect(screen.getByTestId('row-0-title')).toBeInTheDocument()
    expect((screen.getByTestId('row-0-title') as HTMLInputElement).value).toBe('new')
  })

  it('removes a row', () => {
    renderHarness([{ title: 'one' }, { title: 'two' }])
    fireEvent.click(screen.getByTestId('array-row-0-remove'))
    expect(screen.queryByTestId('row-1-title')).not.toBeInTheDocument()
    expect((screen.getByTestId('row-0-title') as HTMLInputElement).value).toBe('two')
  })

  it('mutates a row through setItem', () => {
    renderHarness([{ title: 'one' }])
    fireEvent.change(screen.getByTestId('row-0-title'), { target: { value: 'changed' } })
    expect((screen.getByTestId('row-0-title') as HTMLInputElement).value).toBe('changed')
  })

  it('flags required when empty', () => {
    renderHarness([], true)
    expect(screen.getByText('At least one row required')).toBeInTheDocument()
  })
})
