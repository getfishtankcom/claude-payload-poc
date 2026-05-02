/**
 * Server wrapper for the Publishing Schedule admin view.
 * Mounted at /admin/schedule via payload.config.ts.
 */
import React from 'react'
import { ScheduleViewClient } from './ScheduleViewClient'

const ScheduleView: React.FC = () => {
  return <ScheduleViewClient />
}

export default ScheduleView
