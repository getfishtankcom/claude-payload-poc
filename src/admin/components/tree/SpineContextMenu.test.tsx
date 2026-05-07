/**
 * @description
 * Integration tests for the tree right-click context menu. Locks in the
 * QA-004 fix: the Insert submenu must render human-readable display names,
 * never raw collection slugs. Also verifies the override prop wins so a
 * future caller can plug in live Payload `labels.singular` data.
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SpineContextMenu } from './SpineContextMenu'
import type { TreeNode, ValidChildMap } from './types'

const HOME_NODE: TreeNode = {
  id: 'home',
  slug: '',
  label: 'Home',
  collection: 'pages',
  workflow: 'published',
  hasFr: true,
}

const VALID_CHILDREN: ValidChildMap = {
  pages: ['pages', 'news', 'projects', 'board-detail', 'document-for-comment', 'mystery-meat'],
}

const baseProps = {
  node: HOME_NODE,
  validChildren: VALID_CHILDREN,
  position: { x: 0, y: 0 },
  onAction: () => {},
  onClose: () => {},
}

describe('<SpineContextMenu> Insert submenu', () => {
  it('renders canonical display names instead of raw slugs', () => {
    render(<SpineContextMenu {...baseProps} />)
    // Names that should appear:
    expect(screen.getByText('Page')).toBeInTheDocument()
    expect(screen.getByText('News article')).toBeInTheDocument()
    expect(screen.getByText('Project')).toBeInTheDocument()
    expect(screen.getByText('Board page')).toBeInTheDocument()
    expect(screen.getByText('Document for Comment')).toBeInTheDocument()
    // Slug should NOT appear as a standalone label.
    expect(screen.queryByText('news')).toBeNull()
    expect(screen.queryByText('board-detail')).toBeNull()
    expect(screen.queryByText('document-for-comment')).toBeNull()
  })

  it('humanizes unknown collection slugs as a fallback', () => {
    render(<SpineContextMenu {...baseProps} />)
    expect(screen.getByText('Mystery Meat')).toBeInTheDocument()
  })

  it('lets a parent override labels via the labels prop', () => {
    render(
      <SpineContextMenu
        {...baseProps}
        labels={{ news: 'Story', 'board-detail': 'Board landing page' }}
      />,
    )
    expect(screen.getByText('Story')).toBeInTheDocument()
    expect(screen.getByText('Board landing page')).toBeInTheDocument()
    expect(screen.queryByText('News article')).toBeNull()
  })

  it('omits the Insert submenu when no valid children are configured', () => {
    render(
      <SpineContextMenu
        {...baseProps}
        node={{ ...HOME_NODE, collection: 'leaf-only' }}
      />,
    )
    expect(screen.queryByText('Insert')).toBeNull()
  })
})
