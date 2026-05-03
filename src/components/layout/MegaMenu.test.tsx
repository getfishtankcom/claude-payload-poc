import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { MegaMenu } from './MegaMenu'

const items = [
  {
    label: 'Boards',
    href: '/boards',
    children: [
      { label: 'AcSB', href: '/acsb' },
      { label: 'PSAB', href: '/psab' },
      { label: 'AASB', href: '/aasb' },
      { label: 'CSSB', href: '/cssb' },
    ],
  },
  { label: 'Standards', href: '/standards' },
  { label: 'News', href: '/news' },
  { label: 'Resources', href: '/resources' },
]

function openPanel(triggerLabel = 'Boards') {
  const trigger = screen.getByTestId(`mega-menu-trigger-${triggerLabel.toLowerCase()}`)
  fireEvent.click(trigger)
}

describe('<MegaMenu>', () => {
  it('clamps the multi-column panel to viewport width (no overflow class)', () => {
    render(<MegaMenu trigger="Boards" items={items} variant="multi-column" />)
    openPanel()

    const panel = screen.getByTestId('mega-menu-panel-boards')
    // Width is clamped via min(680px, 100vw - 2rem) so the panel can never
    // grow large enough to push body horizontal scroll.
    expect(panel.className).toContain('w-[min(680px,calc(100vw-2rem))]')
    // The legacy bug was `w-max` which lets the panel grow with content.
    expect(panel.className).not.toContain('w-max')
  })

  it('left-anchors by default', () => {
    render(<MegaMenu trigger="Boards" items={items} variant="multi-column" />)
    openPanel()
    const panel = screen.getByTestId('mega-menu-panel-boards')
    expect(panel.className).toContain('left-0')
    expect(panel.className).not.toContain('right-0')
  })

  it('right-anchors when align="right" so utility-bar dropdowns grow leftward', () => {
    render(
      <MegaMenu trigger="Boards" items={items} variant="multi-column" align="right" />,
    )
    openPanel()
    const panel = screen.getByTestId('mega-menu-panel-boards')
    expect(panel.className).toContain('right-0')
    expect(panel.className).toContain('left-auto')
  })

  it('single-column panel keeps a viewport-bound max-width too', () => {
    render(<MegaMenu trigger="About" items={items} variant="single-column" />)
    openPanel('About')
    const panel = screen.getByTestId('mega-menu-panel-about')
    expect(panel.className).toContain('max-w-[calc(100vw-2rem)]')
  })

  it('multi-column grid is responsive: 2 cols on small screens, 4 on sm+', () => {
    render(<MegaMenu trigger="Boards" items={items} variant="multi-column" />)
    openPanel()
    const grid = screen.getByTestId('mega-menu-panel-boards').querySelector('div.grid')
    expect(grid?.className).toContain('grid-cols-2')
    expect(grid?.className).toContain('sm:grid-cols-4')
  })
})
