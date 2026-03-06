/**
 * @description
 * Shared card wrapper for dashboard widgets.
 * Provides consistent styling, header with title, and optional badge.
 */
'use client'

import React from 'react'

interface WidgetCardProps {
  title: string
  badge?: number
  testId: string
  children: React.ReactNode
}

export const WidgetCard: React.FC<WidgetCardProps> = ({ title, badge, testId, children }) => {
  return (
    <div
      data-testid={testId}
      style={{
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '8px',
        background: 'var(--theme-elevation-0)',
        overflow: 'hidden',
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--theme-elevation-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{title}</h2>
        {badge !== undefined && badge > 0 && (
          <span style={{
            background: 'var(--theme-error-500, #e11d48)',
            color: 'white',
            fontSize: '11px',
            fontWeight: 700,
            borderRadius: '9px',
            padding: '1px 7px',
            minWidth: '20px',
            textAlign: 'center',
          }}>
            {badge}
          </span>
        )}
      </div>
      <div style={{ padding: '12px 16px', minHeight: '120px' }}>
        {children}
      </div>
    </div>
  )
}
