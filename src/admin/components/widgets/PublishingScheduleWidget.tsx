/**
 * Publishing Schedule dashboard widget. Upcoming scheduled publishes
 * grouped by day. Editor/Admin only (hidden from Authors in the parent).
 * Refetches on window focus.
 */
'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { WidgetCard } from './WidgetCard'

interface ScheduledItem {
  id: string
  title?: string
  slug?: string
  publishOn?: string
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow'
  return d.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
}

function formatTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-CA', { hour: '2-digit', minute: '2-digit' })
}

async function fetchScheduledItems(): Promise<ScheduledItem[]> {
  const now = new Date().toISOString()
  const res = await fetch(
    `/api/pages?where[workflowState][equals]=approved&where[publishOn][greater_than]=${now}&sort=publishOn&limit=20`,
  )
  if (!res.ok) return []
  const data = await res.json()
  return (data.docs as ScheduledItem[]) ?? []
}

export const PublishingScheduleWidget: React.FC = () => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['widget', 'publishing-schedule'],
    queryFn: fetchScheduledItems,
    refetchOnWindowFocus: true,
  })

  // Group by day
  const grouped = items.reduce<Record<string, ScheduledItem[]>>((acc, item) => {
    if (!item.publishOn) return acc
    const day = formatDate(item.publishOn)
    if (!acc[day]) acc[day] = []
    acc[day].push(item)
    return acc
  }, {})

  return (
    <WidgetCard title="Publishing Schedule" testId="widget-publishing-schedule">
      {isLoading && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>}
      {!isLoading && items.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No scheduled publishes</div>
      )}
      {!isLoading &&
        Object.entries(grouped).map(([day, dayItems]) => (
          <div key={day} style={{ marginBottom: '12px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                marginBottom: '4px',
              }}
            >
              {day}
            </div>
            {dayItems.map((item) => (
              <a
                key={item.id}
                href={`/admin/collections/pages/${item.id}`}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '4px 0',
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                }}
              >
                <span>{item.title || item.slug || item.id}</span>
                {item.publishOn && (
                  <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                    {formatTime(item.publishOn)}
                  </span>
                )}
              </a>
            ))}
          </div>
        ))}
    </WidgetCard>
  )
}
