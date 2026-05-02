/**
 * Publishing schedule — list view grouped by day.
 *
 * Tabs: Today / This Week / This Month. Each tab updates the from/to
 * window passed to /api/admin/schedule. Items show content type,
 * title (link), scheduled time, and a board badge.
 */
'use client'

import React, { useMemo, useState } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ModalOverlay, ModalButton } from '../components/ui/Modal'

type Range = 'today' | 'week' | 'month'

interface ScheduleItem {
  id: string | number
  title: string
  publishOn: string | null
  collection: string
  board?: { title?: string; slug?: string } | null
}

function rangeBounds(range: Range): { from: string; to: string } {
  const now = new Date()
  const d = (date: Date) => date.toISOString().slice(0, 10)
  if (range === 'today') return { from: d(now), to: d(now) }
  if (range === 'week') {
    const end = new Date(now)
    end.setDate(end.getDate() + 7)
    return { from: d(now), to: d(end) }
  }
  const end = new Date(now)
  end.setDate(end.getDate() + 30)
  return { from: d(now), to: d(end) }
}

function formatDay(iso: string): string {
  const date = new Date(iso)
  return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}
function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
}

export function ScheduleViewClient() {
  const [range, setRange] = useState<Range>('month')
  const [popover, setPopover] = useState<ScheduleItem | null>(null)
  const [actionState, setActionState] = useState<'idle' | 'busy' | 'error'>('idle')
  const [actionError, setActionError] = useState<string | null>(null)
  const queryClient = useQueryClient()
  const { from, to } = useMemo(() => rangeBounds(range), [range])

  const query = useQuery<{ items: ScheduleItem[]; total: number }>({
    queryKey: ['admin-schedule', from, to],
    queryFn: async () => {
      const res = await fetch(`/api/admin/schedule?from=${from}&to=${to}`)
      if (!res.ok) throw new Error(`Schedule fetch failed: ${res.status}`)
      return res.json()
    },
  })

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['admin-schedule'] })

  const handleRemoveSchedule = async () => {
    if (!popover) return
    setActionState('busy')
    setActionError(null)
    try {
      const res = await fetch(`/api/${popover.collection}/${popover.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishOn: null }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setPopover(null)
      setActionState('idle')
      refresh()
    } catch (err) {
      setActionState('error')
      setActionError(err instanceof Error ? err.message : 'Failed to remove schedule')
    }
  }

  const handlePublishNow = async () => {
    if (!popover) return
    setActionState('busy')
    setActionError(null)
    try {
      const res = await fetch(`/api/${popover.collection}/${popover.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workflowState: 'published', publishOn: null }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      setPopover(null)
      setActionState('idle')
      refresh()
    } catch (err) {
      setActionState('error')
      setActionError(err instanceof Error ? err.message : 'Failed to publish')
    }
  }

  const items = query.data?.items ?? []
  const grouped = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>()
    for (const item of items) {
      if (!item.publishOn) continue
      const day = item.publishOn.slice(0, 10)
      const bucket = map.get(day)
      if (bucket) bucket.push(item)
      else map.set(day, [item])
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [items])

  return (
    <div data-testid="page-schedule" style={{ padding: '24px', maxWidth: '960px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>Publishing Schedule</h1>
      <p style={{ color: 'var(--theme-elevation-500)', fontSize: '13px', margin: '4px 0 16px' }}>
        Approved items waiting to publish.
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {(['today', 'week', 'month'] as Range[]).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => setRange(r)}
            aria-pressed={range === r}
            style={{
              padding: '4px 12px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-200)',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 500,
              background: range === r ? '#601F5B' : 'var(--theme-elevation-0)',
              color: range === r ? '#ffffff' : 'var(--theme-elevation-700)',
            }}
          >
            {r === 'today' ? 'Today' : r === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {query.isLoading && <p style={{ fontSize: '13px' }}>Loading…</p>}
      {query.isError && (
        <p style={{ color: '#b91c1c', fontSize: '13px' }}>
          Failed to load schedule: {(query.error as Error)?.message}
        </p>
      )}

      {!query.isLoading && !query.isError && grouped.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)' }}>
          Nothing scheduled in this window.
        </p>
      )}

      {grouped.map(([day, dayItems]) => (
        <section
          key={day}
          style={{
            marginBottom: '24px',
            borderTop: '1px solid var(--theme-elevation-150)',
            paddingTop: '12px',
          }}
        >
          <h2 style={{ fontSize: '13px', fontWeight: 600, margin: '0 0 8px', color: 'var(--theme-elevation-700)' }}>
            {formatDay(`${day}T00:00:00`)}
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {dayItems.map((item) => (
              <li
                key={`${item.collection}:${item.id}`}
                onClick={(e) => {
                  // Don't intercept clicks on the inner edit-link.
                  if ((e.target as HTMLElement).closest('a')) return
                  setPopover(item)
                  setActionState('idle')
                  setActionError(null)
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '13px',
                  padding: '8px 12px',
                  background: 'var(--theme-elevation-50)',
                  borderRadius: '4px',
                  cursor: 'pointer',
                }}
              >
                <span
                  style={{
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    color: 'var(--theme-elevation-500)',
                    minWidth: '60px',
                  }}
                >
                  {item.collection}
                </span>
                <a
                  href={`/admin/collections/${item.collection}/${item.id}`}
                  style={{ color: 'var(--theme-elevation-800)', textDecoration: 'none', flex: 1 }}
                >
                  {item.title}
                </a>
                {item.board && (
                  <span
                    style={{
                      fontSize: '11px',
                      background: 'var(--theme-elevation-100)',
                      color: 'var(--theme-elevation-700)',
                      padding: '2px 6px',
                      borderRadius: '3px',
                    }}
                  >
                    {item.board.title ?? item.board.slug}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', minWidth: '60px', textAlign: 'right' }}>
                  {item.publishOn ? formatTime(item.publishOn) : ''}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {popover && (
        <ModalOverlay onClose={() => setPopover(null)} ariaLabel="Edit scheduled item">
          <h2 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>{popover.title}</h2>
          <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginBottom: '14px' }}>
            {popover.collection}
            {popover.publishOn && ` · scheduled ${new Date(popover.publishOn).toLocaleString()}`}
          </div>

          {actionError && (
            <p role="alert" style={{ fontSize: '12px', color: '#b91c1c', marginTop: 0 }}>
              {actionError}
            </p>
          )}

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a
              href={`/admin/collections/${popover.collection}/${popover.id}`}
              style={{ fontSize: '12px', color: '#601F5B', alignSelf: 'center', marginRight: 'auto' }}
            >
              Open in editor →
            </a>
            <ModalButton
              label="Remove schedule"
              variant="ghost"
              disabled={actionState === 'busy'}
              onClick={handleRemoveSchedule}
            />
            <ModalButton
              label={actionState === 'busy' ? 'Working…' : 'Publish now'}
              variant="primary"
              disabled={actionState === 'busy'}
              onClick={handlePublishNow}
            />
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

export default ScheduleViewClient
