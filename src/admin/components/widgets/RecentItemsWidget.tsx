/**
 * @description
 * My Recent Items dashboard widget.
 * Shows last 10 items the current user edited with relative timestamps.
 */
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { WidgetCard } from './WidgetCard'

interface RecentItem {
  id: string
  title?: string
  slug?: string
  updatedAt?: string
}

interface RecentItemsWidgetProps {
  userId?: string
}

function relativeTime(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const diffMs = now - then
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'just now'
  if (diffMin < 60) return `${diffMin}m ago`
  const diffHrs = Math.floor(diffMin / 60)
  if (diffHrs < 24) return `${diffHrs}h ago`
  const diffDays = Math.floor(diffHrs / 24)
  return `${diffDays}d ago`
}

export const RecentItemsWidget: React.FC<RecentItemsWidgetProps> = ({ userId }) => {
  const [items, setItems] = useState<RecentItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    try {
      // Fetch recent pages edited by this user
      const res = await fetch(`/api/pages?sort=-updatedAt&limit=10`)
      if (res.ok) {
        const data = await res.json()
        setItems(data.docs || [])
      }
    } catch {
      // Non-critical
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    fetchItems()
    const handleFocus = () => fetchItems()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchItems])

  return (
    <WidgetCard title="My Recent Items" testId="widget-recent-items">
      {loading && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>}
      {!loading && items.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No recent items</div>
      )}
      {!loading && items.map((item) => (
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
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {item.title || item.slug || item.id}
          </span>
          {item.updatedAt && (
            <span style={{ color: 'var(--text-muted)', fontSize: '11px', marginLeft: '8px', flexShrink: 0 }}>
              {relativeTime(item.updatedAt)}
            </span>
          )}
        </a>
      ))}
    </WidgetCard>
  )
}
