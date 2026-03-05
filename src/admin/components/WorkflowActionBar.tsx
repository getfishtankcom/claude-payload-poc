/**
 * @description
 * Workflow Action Bar component for the admin edit view.
 * Shows context-sensitive buttons based on current workflow state and user role.
 *
 * Key features:
 * - Buttons change per state + role per PRD Section 5.4:
 *   - Draft: Save Draft, Submit for Review
 *   - In Review: Save Draft, Approve, Reject (Editor/Admin only)
 *   - Needs Revision: Save Draft, Submit for Review (shows rejection banner)
 *   - Approved: Publish Now, Schedule (Editor/Admin only)
 *   - Published: Edit (creates new draft), Unpublish
 * - Rejection modal with mandatory comment field
 * - Rejection banner at top showing reviewer's comment
 *
 * @dependencies
 * - @payloadcms/ui: useAuth, useDocumentInfo, useField
 *
 * @notes
 * - Registered via collection admin.components.edit.beforeDocumentControls
 * - data-testid="workflow-bar" on container
 * - Uses fetch to Payload REST API for state transitions
 */
'use client'

import React, { useState, useCallback } from 'react'
import { useAuth } from '@payloadcms/ui'

type UserWithRole = {
  id: string
  role?: 'admin' | 'editor' | 'author'
  [key: string]: unknown
}

type WorkflowState = 'draft' | 'in_review' | 'needs_revision' | 'approved' | 'published' | 'unpublished'

interface WorkflowActionBarProps {
  docId?: string
  collectionSlug?: string
  workflowState?: WorkflowState
  workflowHistory?: Array<{
    from?: string
    to?: string
    user?: { firstName?: string; email?: string } | string
    date?: string
    comment?: string
  }>
}

const STATE_LABELS: Record<WorkflowState, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  needs_revision: 'Needs Revision',
  approved: 'Approved',
  published: 'Published',
  unpublished: 'Unpublished',
}

const STATE_COLORS: Record<WorkflowState, string> = {
  draft: '#6b7280',
  in_review: '#3b82f6',
  needs_revision: '#f59e0b',
  approved: '#22c55e',
  published: '#8b5cf6',
  unpublished: '#ef4444',
}

export const WorkflowActionBar: React.FC<WorkflowActionBarProps> = ({
  docId,
  collectionSlug = 'pages',
  workflowState = 'draft',
  workflowHistory = [],
}) => {
  const { user } = useAuth()
  const typedUser = user as UserWithRole | null
  const isEditorOrAdmin = typedUser?.role === 'admin' || typedUser?.role === 'editor'
  const isAdminRole = typedUser?.role === 'admin'

  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectComment, setRejectComment] = useState('')
  const [transitioning, setTransitioning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Find latest rejection comment for banner
  const latestRejection = [...workflowHistory].reverse().find(
    (entry) => entry.to === 'needs_revision' && entry.comment,
  )

  const transition = useCallback(async (newState: WorkflowState, comment?: string) => {
    if (!docId) return
    setTransitioning(true)
    setError(null)
    try {
      const res = await fetch(`/api/${collectionSlug}/${docId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workflowState: newState,
          _context: { workflowComment: comment || undefined },
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.errors?.[0]?.message || `Transition failed: ${res.status}`)
      } else {
        // Refresh the page to show new state
        window.location.reload()
      }
    } catch (err) {
      setError(`Network error: ${err}`)
    } finally {
      setTransitioning(false)
    }
  }, [docId, collectionSlug])

  const handleReject = () => {
    if (!rejectComment.trim()) return
    setShowRejectModal(false)
    transition('needs_revision', rejectComment)
    setRejectComment('')
  }

  return (
    <div data-testid="workflow-bar">
      {/* Rejection Banner */}
      {workflowState === 'needs_revision' && latestRejection && (
        <div style={{
          padding: '12px 16px',
          marginBottom: '12px',
          background: '#fef3c7',
          border: '1px solid #f59e0b',
          borderRadius: '6px',
          fontSize: '13px',
        }}>
          <div style={{ fontWeight: 600, marginBottom: '4px', color: '#92400e' }}>
            NEEDS REVISION
          </div>
          <div style={{ color: '#78350f' }}>
            {latestRejection.date && (
              <span>Rejected on {new Date(latestRejection.date).toLocaleDateString()}: </span>
            )}
            &ldquo;{latestRejection.comment}&rdquo;
          </div>
        </div>
      )}

      {/* Status + Actions Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 0',
        borderTop: '1px solid var(--theme-elevation-150)',
        flexWrap: 'wrap',
      }}>
        {/* Status Badge */}
        <span style={{
          display: 'inline-block',
          padding: '3px 10px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 600,
          color: 'white',
          background: STATE_COLORS[workflowState],
        }}>
          {STATE_LABELS[workflowState]}
        </span>

        <div style={{ flex: 1 }} />

        {/* Error */}
        {error && (
          <span style={{ color: '#ef4444', fontSize: '12px', marginRight: '8px' }}>{error}</span>
        )}

        {/* Buttons per state + role */}
        {workflowState === 'draft' && (
          <>
            <ActionButton label="Submit for Review" onClick={() => transition('in_review')} disabled={transitioning} />
          </>
        )}

        {workflowState === 'in_review' && isEditorOrAdmin && (
          <>
            <ActionButton label="Approve" variant="success" onClick={() => transition('approved')} disabled={transitioning} />
            <ActionButton label="Reject" variant="warning" onClick={() => setShowRejectModal(true)} disabled={transitioning} />
          </>
        )}

        {workflowState === 'needs_revision' && (
          <>
            <ActionButton label="Submit for Review" onClick={() => transition('in_review')} disabled={transitioning} />
          </>
        )}

        {workflowState === 'approved' && isEditorOrAdmin && (
          <>
            <ActionButton label="Publish Now" variant="success" onClick={() => transition('published')} disabled={transitioning} />
          </>
        )}

        {workflowState === 'published' && (
          <>
            {isEditorOrAdmin && (
              <ActionButton label="Unpublish" variant="danger" onClick={() => transition('unpublished')} disabled={transitioning} />
            )}
            {isAdminRole && (
              <ActionButton label="Create New Draft" onClick={() => transition('draft')} disabled={transitioning} />
            )}
          </>
        )}

        {workflowState === 'unpublished' && isEditorOrAdmin && (
          <>
            <ActionButton label="Return to Draft" onClick={() => transition('draft')} disabled={transitioning} />
          </>
        )}
      </div>

      {/* Rejection Modal */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
        }}>
          <div style={{
            background: 'var(--theme-elevation-0)',
            borderRadius: '8px',
            padding: '24px',
            width: '400px',
            maxWidth: '90vw',
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '16px' }}>Reject — Add Comment</h3>
            <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)', margin: '0 0 12px' }}>
              A comment is required when rejecting content. This will be shown to the author.
            </p>
            <textarea
              value={rejectComment}
              onChange={(e) => setRejectComment(e.target.value)}
              placeholder="Explain what needs to be revised..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid var(--theme-elevation-200)',
                fontSize: '13px',
                resize: 'vertical',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <ActionButton label="Cancel" onClick={() => { setShowRejectModal(false); setRejectComment('') }} />
              <ActionButton
                label="Reject"
                variant="warning"
                onClick={handleReject}
                disabled={!rejectComment.trim()}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Styled action button */
const ActionButton: React.FC<{
  label: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
  onClick: () => void
  disabled?: boolean
}> = ({ label, variant = 'default', onClick, disabled }) => {
  const bgColors: Record<string, string> = {
    default: 'var(--theme-elevation-100)',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  }
  const textColors: Record<string, string> = {
    default: 'var(--theme-elevation-800)',
    success: 'white',
    warning: 'white',
    danger: 'white',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: '6px 14px',
        borderRadius: '4px',
        border: 'none',
        fontSize: '13px',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        background: bgColors[variant],
        color: textColors[variant],
      }}
    >
      {label}
    </button>
  )
}

export default WorkflowActionBar
