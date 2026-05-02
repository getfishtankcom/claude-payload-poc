/**
 * @description
 * Server component wrapper for the custom admin dashboard.
 * Payload's DashboardView passes props containing non-serializable objects
 * (locale with toString function, req, i18n, etc.) via RenderServerComponent.
 * This server component absorbs those props and renders the client component
 * without forwarding them, avoiding the "Functions cannot be passed to Client
 * Components" error.
 *
 * @notes
 * - Registered via payload.config.ts admin.components.views.dashboard
 * - The actual UI lives in DashboardClient.tsx (client component)
 */
import React from 'react'
import { DashboardClient } from './DashboardClient'

const Dashboard: React.FC = () => {
  return <DashboardClient />
}

export default Dashboard
