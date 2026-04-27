/**
 * @description
 * Wrapper component that renders the WorkflowActionBar inside the edit view.
 * Registered as a beforeDocumentControls component in workflow-enabled collections.
 *
 * @notes
 * - Uses Payload's useDocumentInfo to get current doc data
 * - Fetches workflow state via REST API since useFormFields may not have it
 * - Registered in payload.config.ts via collection admin.components.edit
 */
'use client'

import React, { useEffect, useState } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'
import { WorkflowActionBar } from './WorkflowActionBar'
import type { WorkflowState } from '../types/workflow'

interface WorkflowHistoryEntry {
  from?: string
  to?: string
  user?: { firstName?: string; email?: string } | string
  date?: string
  comment?: string
}

export const WorkflowActionBarField: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const [workflowState, setWorkflowState] = useState<WorkflowState>('draft')
  const [workflowHistory, setWorkflowHistory] = useState<WorkflowHistoryEntry[]>([])

  useEffect(() => {
    if (!id || !collectionSlug) return
    const fetchDoc = async () => {
      try {
        const res = await fetch(`/api/${collectionSlug}/${id}?depth=0`)
        if (res.ok) {
          const data = await res.json()
          setWorkflowState(data.workflowState || 'draft')
          setWorkflowHistory(data.workflowHistory || [])
        }
      } catch {
        // Non-critical
      }
    }
    fetchDoc()
  }, [id, collectionSlug])

  // Don't render on create view (no id yet)
  if (!id) return null

  return (
    <WorkflowActionBar
      docId={id as string}
      collectionSlug={collectionSlug}
      workflowState={workflowState}
      workflowHistory={workflowHistory}
    />
  )
}

export default WorkflowActionBarField
