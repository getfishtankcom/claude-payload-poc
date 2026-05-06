'use client'

/**
 * @description
 * Persistent left tree spine for `<AdminShell>`. Mounted in the layout
 * so its DOM survives navigation between any `/admin/*` route. Exposes
 * search, expansion, selection, gutter icons, and a right-click context
 * menu with valid-child-type filtering.
 *
 * @notes
 * - State persists in module-scope + sessionStorage via `tree-store`.
 * - Virtualization is intentionally not added at this scaffolding step.
 *   Real tree data lands later — at that point swap the inner `<ul>` for
 *   a virtualized list (react-window / @tanstack/react-virtual).
 */

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Gutter } from './GutterIcons'
import { SpineContextMenu, type SpineContextAction } from './SpineContextMenu'
import { treeActions, useTreeState } from './tree-store'
import type { TreeNode, ValidChildMap } from './types'

export type TreeSpineProps = {
  /** Tree data — typically resolved server-side and passed in. */
  nodes: TreeNode[]
  /** Map of parent collection → valid child collections. */
  validChildren: ValidChildMap
  /** Optional callback for context menu actions. */
  onAction?: (node: TreeNode, action: SpineContextAction) => void
  /**
   * Optional slug → display-name overrides for the Insert submenu. Forwarded
   * to `<SpineContextMenu>`. Defaults come from `collection-labels.ts` so
   * callers usually don't need to provide this.
   */
  collectionLabels?: Readonly<Record<string, string>>
}

type FlatRow = { node: TreeNode; depth: number }

/**
 * Flattens the tree, respecting the expanded set, and applies the search
 * query. When a query is active any branch containing a match expands
 * automatically. Exported for unit tests.
 */
export const flattenTree = (
  nodes: TreeNode[],
  expanded: ReadonlySet<string>,
  query: string,
): FlatRow[] => {
  const q = query.trim().toLowerCase()
  const matches = (n: TreeNode): boolean => n.label.toLowerCase().includes(q)
  const subtreeHasMatch = (n: TreeNode): boolean =>
    matches(n) || (n.children?.some(subtreeHasMatch) ?? false)

  const out: FlatRow[] = []
  const walk = (list: TreeNode[], depth: number) => {
    for (const node of list) {
      if (q && !subtreeHasMatch(node)) continue
      out.push({ node, depth })
      const open = expanded.has(node.id) || (q.length > 0 && (node.children?.some(subtreeHasMatch) ?? false))
      if (open && node.children) {
        walk(node.children, depth + 1)
      }
    }
  }
  walk(nodes, 0)
  return out
}

const ROW_HEIGHT = 30

export const TreeSpine: React.FC<TreeSpineProps> = ({
  nodes,
  validChildren,
  onAction,
  collectionLabels,
}) => {
  const router = useRouter()
  const { selectedId, expanded, query, scrollTop } = useTreeState()
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const [menu, setMenu] = React.useState<{ node: TreeNode; x: number; y: number } | null>(null)

  React.useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollTop !== scrollTop) {
      scrollRef.current.scrollTop = scrollTop
    }
    // Only restore once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const rows = React.useMemo(() => flattenTree(nodes, expanded, query), [nodes, expanded, query])

  const navigateToNode = (node: TreeNode) => {
    treeActions.select(node.id)
    router.push(`/admin/edit/${node.collection}/${node.id}`)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: 8, borderBottom: '1px solid var(--border-default)' }}>
        <input
          type="search"
          placeholder="Filter…"
          value={query}
          onChange={(e) => treeActions.setQuery(e.target.value)}
          aria-label="Filter tree"
          style={{
            width: '100%',
            height: 28,
            padding: '0 8px',
            border: '1px solid var(--border-default)',
            borderRadius: 4,
            background: 'var(--surface-page)',
            color: 'var(--text-primary)',
            fontSize: 12,
            fontFamily: 'inherit',
          }}
        />
      </div>

      <div
        ref={scrollRef}
        onScroll={(e) => treeActions.setScrollTop((e.target as HTMLDivElement).scrollTop)}
        style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}
      >
        {rows.length === 0 ? (
          <div style={{ padding: 16, color: 'var(--text-muted)', fontSize: 12 }}>
            No matches.
          </div>
        ) : (
          <ul
            role="tree"
            aria-label="Content tree"
            style={{ listStyle: 'none', margin: 0, padding: 0 }}
          >
            {rows.map(({ node, depth }) => {
              const hasChildren = (node.children?.length ?? 0) > 0
              const isOpen = expanded.has(node.id)
              const isSelected = selectedId === node.id

              return (
                <li
                  key={node.id}
                  role="treeitem"
                  aria-expanded={hasChildren ? isOpen : undefined}
                  aria-selected={isSelected}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    height: ROW_HEIGHT,
                    paddingLeft: 8 + depth * 14,
                    paddingRight: 8,
                    background: isSelected ? 'var(--surface-sunken)' : 'transparent',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                  onClick={() => {
                    if (hasChildren) treeActions.toggleExpanded(node.id)
                    treeActions.select(node.id)
                  }}
                  onDoubleClick={() => navigateToNode(node)}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    treeActions.select(node.id)
                    setMenu({ node, x: e.clientX, y: e.clientY })
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      width: 12,
                      color: 'var(--text-muted)',
                      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                      fontSize: 10,
                      textAlign: 'center',
                    }}
                  >
                    {hasChildren ? (isOpen ? '▾' : '▸') : ''}
                  </span>
                  <Gutter
                    workflow={node.workflow}
                    locked={node.locked}
                    hasFr={node.hasFr}
                  />
                  <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {node.label}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {menu && (
        <SpineContextMenu
          node={menu.node}
          validChildren={validChildren}
          position={{ x: menu.x, y: menu.y }}
          onAction={(action) => onAction?.(menu.node, action)}
          onClose={() => setMenu(null)}
          labels={collectionLabels}
        />
      )}
    </div>
  )
}

export default TreeSpine
