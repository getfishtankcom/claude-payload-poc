/**
 * @description
 * Regression tests for the tree gutter icons. The original implementation
 * wrote `fill={var(--workflow-…)}` directly onto the `<circle>` SVG attribute,
 * which the browser does not resolve (CSS custom properties only work through
 * real CSS properties). These assertions lock in the working pattern: the SVG
 * carries the token via `color` and the shapes paint with `currentColor`.
 *
 * @notes
 * - jsdom does not compute `getComputedStyle` for SVG `fill` reliably, so the
 *   tests assert structural intent (`fill="currentColor"` + inline `color`
 *   carries the token) rather than the resolved pixel color.
 */

import * as React from 'react'
import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { FrMissingGutterIcon, Gutter, LockGutterIcon, WorkflowGutterIcon } from './GutterIcons'
import type { WorkflowState } from './types'

const WORKFLOW_STATES: { state: WorkflowState; varName: string }[] = [
  { state: 'draft', varName: '--workflow-draft' },
  { state: 'in-review', varName: '--workflow-review' },
  { state: 'needs-revision', varName: '--workflow-revision' },
  { state: 'approved', varName: '--workflow-approved' },
  { state: 'published', varName: '--workflow-published' },
]

describe('<WorkflowGutterIcon>', () => {
  it.each(WORKFLOW_STATES)(
    'paints the $state circle via currentColor with the $varName token',
    ({ state, varName }) => {
      const { container } = render(<WorkflowGutterIcon state={state} />)
      const svg = container.querySelector('svg') as SVGSVGElement | null
      const circle = container.querySelector('circle') as SVGCircleElement | null

      expect(svg).not.toBeNull()
      expect(circle).not.toBeNull()
      expect(circle!.getAttribute('fill')).toBe('currentColor')
      // The SVG attribute must NOT carry an unresolved var(...) — the regression we're locking in.
      expect(circle!.getAttribute('fill')).not.toMatch(/var\(/)
      expect(svg!.style.color).toBe(`var(${varName})`)
    },
  )

  it('exposes a human-readable label for each state', () => {
    const { container } = render(<WorkflowGutterIcon state="needs-revision" />)
    expect(container.querySelector('svg')?.getAttribute('aria-label')).toBe('Needs revision')
  })
})

describe('<LockGutterIcon>', () => {
  it('paints the lock glyph via currentColor + lock token', () => {
    const { container } = render(<LockGutterIcon />)
    const svg = container.querySelector('svg') as SVGSVGElement | null
    const path = container.querySelector('path') as SVGPathElement | null
    expect(svg?.style.color).toBe('var(--lock-locked)')
    expect(path?.getAttribute('fill')).toBe('currentColor')
  })
})

describe('<FrMissingGutterIcon>', () => {
  it('renders an FR badge with the language-missing token', () => {
    const { container, getByText } = render(<FrMissingGutterIcon />)
    expect(getByText('FR')).toBeInTheDocument()
    const span = container.querySelector('span') as HTMLSpanElement | null
    expect(span?.style.color).toBe('var(--lang-missing)')
  })
})

describe('<Gutter>', () => {
  it('renders only the workflow icon when nothing else is set', () => {
    const { container } = render(<Gutter workflow="published" />)
    expect(container.querySelectorAll('svg')).toHaveLength(1)
  })

  it('stacks workflow + lock + FR-missing in order', () => {
    const { container, getByText } = render(
      <Gutter workflow="draft" locked hasFr={false} />,
    )
    // Two SVGs (workflow dot + lock glyph) + one FR badge span
    expect(container.querySelectorAll('svg')).toHaveLength(2)
    expect(getByText('FR')).toBeInTheDocument()
  })

  it('omits the FR badge when hasFr is true', () => {
    const { queryByText } = render(<Gutter workflow="published" hasFr />)
    expect(queryByText('FR')).toBeNull()
  })
})
