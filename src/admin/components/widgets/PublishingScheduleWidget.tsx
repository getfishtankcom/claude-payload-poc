/**
 * @description
 * Publishing Schedule dashboard widget.
 * Shows upcoming scheduled publishes grouped by day.
 * Editor/Admin only (hidden from Authors in the Dashboard parent).
 */
'use client'

import React, { useEffect, useState, useCallback } from 'react'
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

export const PublishingScheduleWidget: React.FC = () => {
  const [items, setItems] = useState<ScheduledItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    try {
      const now = new Date().toISOString()
      const res = await fetch(
        `/api/pages?where[workflowState][equals]=approved&where[publishOn][greater_than]=${now}&sort=publishOn&limit=20`,
      )
      if (res.ok) {
        const data = await res.json()
        setItems(data.docs || [])
      }
    } catch {
      // Non-critical
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
    const handleFocus = () => fetchItems()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchItems])

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
      {loading && <div style={{ color: 'var(--theme-elevation-400)', fontSize: '13px' }}>Loading...</div>}
      {!loading && items.length === 0 && (
        <div style={{ color: 'var(--theme-elevation-400)', fontSize: '13px' }}>No scheduled publishes</div>
      )}
      {!loading && Object.entries(grouped).map(([day, dayItems]) => (
        <div key={day} style={{ marginBottom: '12px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--theme-elevation-500)',
            marginBottom: '4px',
          }}>
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
                color: 'var(--theme-elevation-800)',
                textDecoration: 'none',
              }}
            >
              <span>{item.title || item.slug || item.id}</span>
              {item.publishOn && (
                <span style={{ color: 'var(--theme-elevation-400)', fontSize: '11px' }}>
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
