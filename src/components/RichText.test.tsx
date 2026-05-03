import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { RichText } from './RichText'

const validDoc = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        version: 1,
        format: '',
        indent: 0,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            version: 1,
            text: 'Hello world',
            format: 0,
            mode: 'normal',
            style: '',
            detail: 0,
          },
        ],
      },
    ],
  },
} as const

const emptyDoc = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [],
  },
} as const

const unknownNodeDoc = {
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'something-unknown-node-type',
        version: 1,
      },
    ],
  },
} as const

describe('<RichText>', () => {
  it('renders text from a valid Lexical document', () => {
    const { container } = render(<RichText content={validDoc} />)
    expect(container.textContent).toContain('Hello world')
  })

  it('renders nothing when content is null', () => {
    const { container } = render(<RichText content={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing when content is undefined', () => {
    const { container } = render(<RichText content={undefined} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nothing for an empty Lexical document', () => {
    const { container } = render(<RichText content={emptyDoc} />)
    expect(container.firstChild).toBeNull()
  })

  it('does not throw on unknown node types', () => {
    expect(() => render(<RichText content={unknownNodeDoc} />)).not.toThrow()
  })

  it('applies the className to the wrapper', () => {
    const { container } = render(
      <RichText content={validDoc} className="prose" />,
    )
    expect((container.firstChild as HTMLElement).className).toBe('prose')
  })
})
