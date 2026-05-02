import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { EditFormProvider } from '../forms/EditFormProvider'
import { BlocksField, type BlockDefinition } from './BlocksField'

type HeroData = { headline: string }
type QuoteData = { text: string }

const HERO: BlockDefinition<HeroData> = {
  type: 'hero',
  label: 'Hero',
  defaults: () => ({ headline: 'New hero' }),
  render: (data, setData) => (
    <input
      data-testid="hero-headline"
      value={data.headline}
      onChange={(e) => setData({ ...data, headline: e.target.value })}
    />
  ),
}

const QUOTE: BlockDefinition<QuoteData> = {
  type: 'quote',
  label: 'Quote',
  defaults: () => ({ text: 'New quote' }),
  render: (data, setData) => (
    <textarea
      data-testid="quote-text"
      value={data.text}
      onChange={(e) => setData({ ...data, text: e.target.value })}
    />
  ),
}

const BLOCKS = [HERO, QUOTE] as unknown as BlockDefinition[]

const wrap = (initial: unknown[] = []) =>
  render(
    <EditFormProvider initialValues={{ body: initial }} onSubmit={async () => {}}>
      <BlocksField name="body" label="Body" blocks={BLOCKS} />
    </EditFormProvider>,
  )

describe('<BlocksField>', () => {
  it('renders empty state', () => {
    wrap([])
    expect(screen.getByText('(no blocks)')).toBeInTheDocument()
  })

  it('opens the block-type picker and inserts a Hero block', () => {
    wrap([])
    fireEvent.click(screen.getByTestId('blocks-body-add'))
    fireEvent.click(screen.getByRole('menuitem', { name: 'Hero' }))
    expect(screen.getByTestId('hero-headline')).toBeInTheDocument()
    expect((screen.getByTestId('hero-headline') as HTMLInputElement).value).toBe('New hero')
  })

  it('mutates the block via setData', () => {
    wrap([{ type: 'hero', data: { headline: 'Hello' } }])
    fireEvent.change(screen.getByTestId('hero-headline'), {
      target: { value: 'Updated' },
    })
    expect((screen.getByTestId('hero-headline') as HTMLInputElement).value).toBe('Updated')
  })

  it('removes a block', () => {
    wrap([
      { type: 'hero', data: { headline: 'Hello' } },
      { type: 'quote', data: { text: 'World' } },
    ])
    fireEvent.click(screen.getByTestId('block-0-remove'))
    expect(screen.queryByTestId('hero-headline')).not.toBeInTheDocument()
    expect(screen.getByTestId('quote-text')).toBeInTheDocument()
  })

  it('renders mixed blocks in order', () => {
    wrap([
      { type: 'hero', data: { headline: 'Top' } },
      { type: 'quote', data: { text: 'Bottom' } },
    ])
    expect(screen.getByTestId('block-0').textContent).toContain('Hero')
    expect(screen.getByTestId('block-1').textContent).toContain('Quote')
  })

  it('renders an unknown-type fallback', () => {
    wrap([{ type: 'mystery', data: {} }])
    expect(screen.getByText(/Block type "mystery" is not registered/)).toBeInTheDocument()
  })
})
