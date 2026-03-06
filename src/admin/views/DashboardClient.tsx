/**
 * @description
 * Client-side dashboard UI for FRAS Canada CMS admin.
 * Rendered by the server-side Dashboard wrapper which strips
 * non-serializable props (locale.toString, etc.) from Payload.
 *
 * Key features:
 * - 4 widgets in 2x2 grid: Workflow Queue, Quick Actions, My Recent Items, Publishing Schedule
 * - Role-filtered: Authors see own items, Editors/Admins see all
 * - Publishing Schedule widget is Editor/Admin only
 *
 * @dependencies
 * - @payloadcms/ui: useAuth
 * - Widget sub-components
 */
'use client'

import React from 'react'
import { useAuth } from '@payloadcms/ui'
import { WorkflowQueueWidget } from '../components/widgets/WorkflowQueueWidget'
import { QuickActionsWidget } from '../components/widgets/QuickActionsWidget'
import { RecentItemsWidget } from '../components/widgets/RecentItemsWidget'
import { PublishingScheduleWidget } from '../components/widgets/PublishingScheduleWidget'

type UserWithRole = {
  id: string
  role?: 'admin' | 'editor' | 'author'
  firstName?: string
  email?: string
  [key: string]: unknown
}

export const DashboardClient: React.FC = () => {
  const { user } = useAuth()
  const typedUser = user as UserWithRole | null
  const isEditorOrAdmin = typedUser?.role === 'admin' || typedUser?.role === 'editor'
  const displayName = typedUser?.firstName || typedUser?.email || 'User'

  return (
    <div
      data-testid="admin-dashboard"
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>
          Welcome, {displayName}
        </h1>
        {typedUser?.role && (
          <span style={{
            display: 'inline-block',
            marginTop: '8px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: 600,
            textTransform: 'capitalize',
            background: 'var(--theme-elevation-100)',
            color: 'var(--theme-elevation-600)',
          }}>
            {typedUser.role}
          </span>
        )}
      </div>

      {/* Widget Grid — 2x2 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isEditorOrAdmin ? '1fr 1fr' : '1fr 1fr',
        gap: '20px',
      }}>
        <WorkflowQueueWidget userId={typedUser?.id} role={typedUser?.role} />
        <QuickActionsWidget />
        <RecentItemsWidget userId={typedUser?.id} />
        {isEditorOrAdmin && <PublishingScheduleWidget />}
      </div>
    </div>
  )
}

export default DashboardClient
