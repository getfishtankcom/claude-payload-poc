/**
 * Renders a chronological workflow history timeline inside a ModalOverlay.
 *
 * Each entry shows: from → to state badges with a colored dot, user name,
 * relative timestamp, and an optional comment.
 */
'use client'

import React from 'react'
import { ModalOverlay, ModalButton } from './ui/Modal'
import { STATE_COLORS, STATE_LABELS } from '../types/workflow'
import type { WorkflowHistoryEntry, WorkflowState } from '../types/workflow'

function relativeTime(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  if (diff < 60_000) return 'just now'
  const mins = Math.floor(diff / 60_000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function userLabel(user: WorkflowHistoryEntry['user']): string {
  if (!user) return 'Unknown'
  if (typeof user === 'string') return user
  return user.firstName || user.email || 'Unknown'
}

function StateBadge({ state }: { state: WorkflowState | string }) {
  const color = STATE_COLORS[state as WorkflowState] ?? '#888'
  const label = STATE_LABELS[state as WorkflowState] ?? state
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
        }}
      />
      {label}
    </span>
  )
}

export function WorkflowHistoryModal({
  history,
  title = 'Workflow History',
  onClose,
}: {
  history: WorkflowHistoryEntry[]
  title?: string
  onClose: () => void
}) {
  const entries = [...history].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  )

  return (
    <ModalOverlay onClose={onClose} ariaLabel={title}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{title}</h2>
        <ModalButton label="Close" variant="ghost" onClick={onClose} />
      </div>

      {entries.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-500)', fontSize: '13px' }}>
          No workflow history yet.
        </p>
      ) : (
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {entries.map((entry, i) => (
            <li
              key={i}
              style={{
                paddingLeft: '12px',
                borderLeft: '2px solid var(--theme-elevation-150)',
                position: 'relative',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <StateBadge state={entry.from} />
                <span style={{ color: 'var(--theme-elevation-400)' }}>→</span>
                <StateBadge state={entry.to} />
              </div>
              <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>
                <strong>{userLabel(entry.user)}</strong> · {relativeTime(entry.date)}
              </div>
              {entry.comment && (
                <div
                  style={{
                    marginTop: '6px',
                    fontSize: '12px',
                    background: 'var(--theme-elevation-50)',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    color: 'var(--theme-elevation-700)',
                  }}
                >
                  {entry.comment}
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </ModalOverlay>
  )
}
