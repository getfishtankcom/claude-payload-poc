/**
 * @description
 * Quick Actions dashboard widget.
 * Provides create shortcuts for Page, News, Project, Event.
 * Each button navigates to the collection's create view.
 */
'use client'

import React from 'react'
import { WidgetCard } from './WidgetCard'

const ACTIONS = [
  { label: '+ New Page', href: '/admin/collections/pages/create' },
  { label: '+ New News Article', href: '/admin/collections/news/create' },
  { label: '+ New Project', href: '/admin/collections/projects/create' },
  { label: '+ New Event', href: '/admin/collections/events/create' },
]

export const QuickActionsWidget: React.FC = () => {
  return (
    <WidgetCard title="Quick Actions" testId="widget-quick-actions">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {ACTIONS.map((action) => (
          <a
            key={action.href}
            href={action.href}
            style={{
              display: 'block',
              padding: '8px 12px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 500,
              // Admin-shell tokens — known-passing contrast on white surfaces.
              color: 'var(--text-primary)',
              background: 'var(--surface-elevated)',
              border: '1px solid var(--border-default)',
              textDecoration: 'none',
              transition: 'background-color 0.15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-sunken)'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--surface-elevated)'
            }}
          >
            {action.label}
          </a>
        ))}
      </div>
    </WidgetCard>
  )
}
