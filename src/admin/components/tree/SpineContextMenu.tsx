'use client'

/**
 * @description
 * Right-click context menu for the persistent left tree spine in
 * `<AdminShell>`. Lightweight by design — anchored to a screen position,
 * single discriminated-union action callback, no RBAC/lock/depth logic.
 * The full Content Tree page uses the heavier `TreeContextMenu` from
 * `src/admin/components/TreeContextMenu.tsx` instead.
 *
 * The "Insert" submenu is filtered to valid child collection types per
 * `validChildren` so authors cannot create an invalid hierarchy.
 *
 * @notes
 * - Anchored to a screen position; the parent owns visibility state.
 * - Closes on outside click + Escape. Clicking a menu item invokes the
 *   handler then closes.
 */

import * as React from 'react'

import { labelForCollection } from './collection-labels'
import type { TreeNode, ValidChildMap } from './types'

export type SpineContextAction =
  | { kind: 'insert'; childCollection: string }
  | { kind: 'rename' }
  | { kind: 'delete' }
  | { kind: 'duplicate' }

export type SpineContextMenuProps = {
  node: TreeNode
  validChildren: ValidChildMap
  position: { x: number; y: number }
  onAction: (action: SpineContextAction) => void
  onClose: () => void
  /**
   * Optional slug → display-name overrides for the Insert submenu. Falls
   * back to the canonical map in `collection-labels.ts`, then a humanized
   * version of the slug. Lets a parent inject live Payload
   * `labels.singular` data without touching the defaults.
   */
  labels?: Readonly<Record<string, string>>
}

/**
 * Returns the list of collection slugs allowed as children of this node.
 * Exported for tests so the filter logic stays unit-checkable in isolation.
 */
export const getValidChildren = (node: TreeNode, map: ValidChildMap): readonly string[] =>
  map[node.collection] ?? []

const itemStyle: React.CSSProperties = {
  padding: '6px 12px',
  fontSize: 12,
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  background: 'transparent',
  border: 'none',
  textAlign: 'left',
  color: 'var(--text-primary)',
  fontFamily: 'inherit',
  width: '100%',
}

const sectionStyle: React.CSSProperties = {
  padding: '4px 12px',
  fontSize: 10,
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  color: 'var(--text-muted)',
}

export const SpineContextMenu: React.FC<SpineContextMenuProps> = ({
  node,
  validChildren,
  position,
  onAction,
  onClose,
  labels,
}) => {
  const children = getValidChildren(node, validChildren)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('mousedown', onDoc)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDoc)
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const fire = (action: SpineContextAction) => {
    onAction(action)
    onClose()
  }

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={`Actions for ${node.label}`}
      style={{
        position: 'fixed',
        top: position.y,
        left: position.x,
        zIndex: 50,
        minWidth: 200,
        padding: '4px 0',
        background: 'var(--surface-page)',
        border: '1px solid var(--border-default)',
        borderRadius: 6,
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {children.length > 0 && (
        <>
          <div style={sectionStyle}>Insert</div>
          {children.map((c) => (
            <button
              key={`insert-${c}`}
              type="button"
              role="menuitem"
              style={itemStyle}
              onClick={() => fire({ kind: 'insert', childCollection: c })}
            >
              New <strong>{labelForCollection(c, labels)}</strong>
            </button>
          ))}
          <div style={{ height: 1, background: 'var(--border-default)', margin: '4px 0' }} />
        </>
      )}

      <button type="button" role="menuitem" style={itemStyle} onClick={() => fire({ kind: 'rename' })}>
        Rename
      </button>
      <button type="button" role="menuitem" style={itemStyle} onClick={() => fire({ kind: 'duplicate' })}>
        Duplicate
      </button>
      <button
        type="button"
        role="menuitem"
        style={{ ...itemStyle, color: 'var(--workflow-revision)' }}
        onClick={() => fire({ kind: 'delete' })}
      >
        Delete
      </button>
    </div>
  )
}
