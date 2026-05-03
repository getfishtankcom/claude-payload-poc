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

// Shell tokens replace Payload's `--theme-elevation-*` so widget contrast
// stays known-passing regardless of provider context (#100 / QA-030).
export const WidgetCard: React.FC<WidgetCardProps> = ({ title, badge, testId, children }) => {
  return (
    <section
      data-testid={testId}
      aria-label={title}
      style={{
        border: '1px solid var(--border-default)',
        borderRadius: '8px',
        background: 'var(--surface-page)',
        color: 'var(--text-primary)',
        overflow: 'hidden',
        // Grid items default to `min-width: auto` (= intrinsic content width).
        // When a widget contains `whiteSpace: nowrap` text the unwrapped
        // length blows the grid track wider than its `1fr` share, which
        // makes the next column visually overlap the previous one (#72 /
        // QA-002). `min-width: 0` lets the section shrink so its children
        // can ellipsis-truncate as designed.
        minWidth: 0,
      }}
    >
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--border-default)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <h2 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{title}</h2>
        {badge !== undefined && badge > 0 && (
          <span style={{
            // --workflow-revision (#C72C2C) on white = 5.4:1 — AA pass for normal
            // text and the badge text is bold/12px so it clears the
            // large-text threshold easily. Replaces the literal #e11d48
            // fallback which was 4.4:1 with white text (just under AA).
            background: 'var(--workflow-revision)',
            color: 'var(--text-on-brand)',
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
    </section>
  )
}
