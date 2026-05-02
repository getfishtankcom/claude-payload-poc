import * as React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { JoinField, type JoinedItem } from './JoinField'

describe('<JoinField>', () => {
  it('renders empty state when loader resolves []', async () => {
    render(
      <JoinField
        name="refs"
        label="References"
        loadJoined={async () => []}
      />,
    )
    await waitFor(() =>
      expect(screen.getByText('No related records')).toBeInTheDocument(),
    )
  })

  it('renders each joined record with a link to its edit view', async () => {
    const items: JoinedItem[] = [
      { id: '1', label: 'Page A', href: '/admin/edit/pages/1', breadcrumb: 'FRAS > Pages' },
      { id: '2', label: 'Page B', href: '/admin/edit/pages/2' },
    ]
    render(
      <JoinField name="refs" label="References" loadJoined={async () => items} />,
    )
    await waitFor(() => expect(screen.getByText('Page A')).toBeInTheDocument())
    expect(screen.getByText('Page A').getAttribute('href')).toBe('/admin/edit/pages/1')
    expect(screen.getByText('FRAS > Pages')).toBeInTheDocument()
    expect(screen.getByText('Page B').getAttribute('href')).toBe('/admin/edit/pages/2')
  })

  it('shows lock badge when locked-by-other', async () => {
    render(
      <JoinField
        name="refs"
        label="References"
        lock="locked-by-other"
        loadJoined={async () => []}
      />,
    )
    expect(screen.getByText('locked')).toBeInTheDocument()
  })
})
