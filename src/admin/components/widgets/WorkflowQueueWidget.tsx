/**
 * @description
 * Workflow Queue dashboard widget.
 * Shows items grouped by workflow state (In Review, Needs Revision, Approved).
 * Authors see own items; Editors/Admins see all.
 *
 * @notes
 * - Fetches from Payload REST API on mount and window focus
 * - Click item to navigate to edit view
 */
'use client'

import React, { useEffect, useState, useCallback } from 'react'
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

const STATE_COLORS: Record<string, string> = {
  in_review: '#3b82f6',
  needs_revision: '#f59e0b',
  approved: '#22c55e',
}

export const WorkflowQueueWidget: React.FC<WorkflowQueueWidgetProps> = ({ userId, role }) => {
  const [items, setItems] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState(true)

  const isAuthorOnly = role === 'author'

  const fetchItems = useCallback(async () => {
    try {
      let url = '/api/pages?where[workflowState][in]=in_review,needs_revision,approved&limit=20&sort=-updatedAt'
      // Authors only see their own items
      if (isAuthorOnly && userId) {
        url += `&where[createdBy][equals]=${userId}`
      }
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setItems(data.docs || [])
      }
    } catch {
      // Non-critical widget
    } finally {
      setLoading(false)
    }
  }, [isAuthorOnly, userId])

  useEffect(() => {
    fetchItems()
    const handleFocus = () => fetchItems()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchItems])

  // Group items by state
  const grouped = items.reduce<Record<string, WorkflowItem[]>>((acc, item) => {
    const state = item.workflowState
    if (!acc[state]) acc[state] = []
    acc[state].push(item)
    return acc
  }, {})

  return (
    <WidgetCard title="Workflow Queue" badge={items.length} testId="widget-workflow-queue">
      {loading && <div style={{ color: 'var(--theme-elevation-400)', fontSize: '13px' }}>Loading...</div>}
      {!loading && items.length === 0 && (
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '13px' }}>No items awaiting action</div>
      )}
      {!loading && Object.entries(grouped).map(([state, stateItems]) => (
        <div key={state} style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: STATE_COLORS[state] || '#888',
            marginBottom: '4px',
            textTransform: 'uppercase',
          }}>
            {STATE_LABELS[state] || state} ({stateItems.length})
          </div>
          {stateItems.map((item) => (
            <a
              key={item.id}
              href={`/admin/collections/pages/${item.id}`}
              style={{
                display: 'block',
                padding: '4px 0',
                fontSize: '13px',
                color: 'var(--theme-elevation-800)',
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
