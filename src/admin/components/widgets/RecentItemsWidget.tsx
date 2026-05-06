/**
 * My Recent Items dashboard widget. Shows last 10 pages the current user
 * has access to, with relative timestamps. Refetches on window focus.
 */
'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
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

async function fetchRecentItems(): Promise<RecentItem[]> {
  const res = await fetch('/api/pages?sort=-updatedAt&limit=10')
  if (!res.ok) return []
  const data = await res.json()
  return (data.docs as RecentItem[]) ?? []
}

export const RecentItemsWidget: React.FC<RecentItemsWidgetProps> = ({ userId }) => {
  const { data: items = [], isLoading } = useQuery({
    queryKey: ['widget', 'recent-items', userId],
    queryFn: fetchRecentItems,
    enabled: Boolean(userId),
    refetchOnWindowFocus: true,
  })

  return (
    <WidgetCard title="My Recent Items" testId="widget-recent-items">
      {isLoading && <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>Loading...</div>}
      {!isLoading && items.length === 0 && (
        <div style={{ color: 'var(--text-muted)', fontSize: '13px' }}>No recent items</div>
      )}
      {!isLoading &&
        items.map((item) => (
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
            <span
              style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1,
                minWidth: 0,
              }}
            >
              {item.title || item.slug || item.id}
            </span>
            {item.updatedAt && (
              <span
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '11px',
                  marginLeft: '8px',
                  flexShrink: 0,
                }}
              >
                {relativeTime(item.updatedAt)}
              </span>
            )}
          </a>
        ))}
    </WidgetCard>
  )
}
