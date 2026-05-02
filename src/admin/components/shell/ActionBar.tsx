'use client'

/**
 * @description
 * <ActionBar> — sticky bottom workflow strip for `<AdminShell>`. Each edit
 * view contributes verbs (Save Draft, Submit, Approve, Reject, Publish,
 * Schedule, Preview, Open in Page Builder, etc.); each verb declares
 * visibility against the current record's workflow state. Only applicable
 * verbs render.
 *
 * @notes
 * - Deep module per PRD §Testing Decisions — slot/contribution model is
 *   testable in isolation against synthetic verb sets + workflow states.
 * - Pure presentational; wiring to actual workflow hooks lands in Layer 3.
 */

import * as React from 'react'

export type WorkflowState =
  | 'draft'
  | 'in-review'
  | 'needs-revision'
  | 'approved'
  | 'published'

export type VerbVariant = 'primary' | 'secondary' | 'destructive'

export type ActionVerb = {
  /** Stable identifier — also used as React key. */
  id: string
  /** Visible label. */
  label: string
  /** Visual emphasis. Defaults to 'secondary'. */
  variant?: VerbVariant
  /**
   * Workflow states this verb applies to. If omitted, the verb is always
   * visible. Filter is OR — at least one state in the list must match.
   */
  visibleIn?: WorkflowState[]
  /** Disabled state for in-flight async work. */
  disabled?: boolean
  /** Click handler. */
  onClick?: () => void
}

export type ActionBarProps = {
  /** Current record's workflow state — filters verbs. */
  workflowState: WorkflowState
  /** Verbs contributed by the active edit view. Order = render order. */
  verbs: ActionVerb[]
  /** Optional left-aligned status / context content (e.g. "Editing v3"). */
  status?: React.ReactNode
}

/**
 * Filters verbs by workflow-state predicate. Exported for unit testing.
 */
export const filterVerbs = (verbs: ActionVerb[], state: WorkflowState): ActionVerb[] =>
  verbs.filter((v) => !v.visibleIn || v.visibleIn.includes(state))

const variantStyles: Record<VerbVariant, React.CSSProperties> = {
  primary: {
    background: 'var(--brand-fras)',
    color: 'var(--text-on-brand)',
    border: '1px solid var(--brand-fras)',
  },
  secondary: {
    background: 'var(--surface-page)',
    color: 'var(--text-primary)',
    border: '1px solid var(--border-strong)',
  },
  destructive: {
    background: 'var(--workflow-revision-bg)',
    color: 'var(--workflow-revision)',
    border: '1px solid var(--workflow-revision)',
  },
}

const buttonBase: React.CSSProperties = {
  height: 36,
  padding: '0 14px',
  borderRadius: 6,
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
}

export const ActionBar: React.FC<ActionBarProps> = ({ workflowState, verbs, status }) => {
  const visible = filterVerbs(verbs, workflowState)

  return (
    <div
      role="toolbar"
      aria-label="Workflow actions"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 56,
        padding: '8px 16px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0, color: 'var(--text-muted)', fontSize: 12 }}>
        {status}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        {visible.length === 0 ? (
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
            No actions for this state
          </span>
        ) : (
          visible.map((v) => (
            <button
              key={v.id}
              type="button"
              disabled={v.disabled}
              onClick={v.onClick}
              style={{
                ...buttonBase,
                ...variantStyles[v.variant ?? 'secondary'],
                opacity: v.disabled ? 0.55 : 1,
                cursor: v.disabled ? 'not-allowed' : 'pointer',
              }}
            >
              {v.label}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export default ActionBar
