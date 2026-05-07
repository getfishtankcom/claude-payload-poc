/**
 * Workflow Queue dashboard widget. Items grouped by workflow state
 * (In Review, Needs Revision, Approved). Authors see only their own
 * items; Editors/Admins see all. Refetches on window focus.
 */
'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { WidgetCard } from './WidgetCard'

interface WorkflowItem {
  id: string
  title?: string
  slug?: string
  workflowState: string
  createdBy?: { id: string; email?: string; firstName?: string } | string
  updatedAt?: string
}

interface WorkflowQueueWidgetProps {
  userId?: string
  role?: string
}

const STATE_LABELS: Record<string, string> = {
  in_review: 'In Review',
  needs_revision: 'Needs Revision',
  approved: 'Approved',
}

// Use admin-shell workflow tokens — every value passes WCAG AA on white
// (#100 / QA-030).
const STATE_COLORS: Record<string, string> = {
  in_review: 'var(--workflow-review)',
  needs_revision: 'var(--workflow-revision)',
  approved: 'var(--workflow-approved)',
}

async function fetchWorkflowItems({
  isAuthorOnly,
  userId,
}: {
  isAuthorOnly: boolean
  userId?: string
}): Promise<WorkflowItem[]> {
  let url = '/api/pages?where[workflowState][in]=in_review,needs_revision,approved&limit=20&sort=-updatedAt'
  if (isAuthorOnly && userId) {
    url += `&where[createdBy][equals]=${userId}`
  }
  const res = await fetch(url)
  if (!res.ok) return []
  const data = await res.json()
  return (data.docs as WorkflowItem[]) ?? []
}

export const WorkflowQueueWidget: React.FC<WorkflowQueueWidgetProps> = ({ userId, role }) => {
  const isAuthorOnly = role === 'author'

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['widget', 'workflow-queue', { isAuthorOnly, userId }],
    queryFn: () => fetchWorkflowItems({ isAuthorOnly, userId }),
    refetchOnWindowFocus: true,
  })

  // Group items by state
  const grouped = items.reduce<Record<string, WorkflowItem[]>>((acc, item) => {
    const state = item.workflowState
    if (!acc[state]) acc[state] = []
    acc[state].push(item)
    return acc
  }, {})

  return (
    <WidgetCard title="Workflow Queue" badge={items.length} testId="widget-workflow-queue">
      {isLoading && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>}
      {!isLoading && items.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          No items awaiting action
        </div>
      )}
      {!isLoading &&
        Object.entries(grouped).map(([state, stateItems]) => (
          // Bumped section gap (12 → 18), header gap (4 → 8), header
          // line-height + tracking, and row vertical padding (4 → 6) +
          // line-height. The previous layout collapsed when 4-5 rows
          // stacked under a section header. (#161 / QA-113)
          <div key={state} style={{ marginBottom: '18px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: STATE_COLORS[state] || 'var(--text-muted)',
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                lineHeight: 1.4,
              }}
            >
              {STATE_LABELS[state] || state} ({stateItems.length})
            </div>
            {stateItems.map((item) => (
              <a
                key={item.id}
                href={`/admin/collections/pages/${item.id}`}
                style={{
                  display: 'block',
                  padding: '6px 0',
                  fontSize: '13px',
                  lineHeight: 1.4,
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                {item.title || item.slug || item.id}
              </a>
            ))}
          </div>
        ))}
    </WidgetCard>
  )
}
