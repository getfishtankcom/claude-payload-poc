/**
 * @description
 * Lock indicator component for the admin edit view.
 * Auto-locks the document when opened for editing, shows lock status,
 * and provides unlock/force-unlock functionality.
 *
 * Key features:
 * - Auto-lock on mount via REST API PATCH
 * - Shows "Locked by [Name]" with lock icon
 * - If locked by another user: shows read-only warning + "Request Unlock"
 * - Auto-unlock on unmount (component cleanup)
 * - Admin force-unlock capability
 *
 * @notes
 * - Registered as a beforeDocumentControls component alongside WorkflowActionBarField
 */
'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useDocumentInfo, useAuth } from '@payloadcms/ui'

import type { UserWithRole } from '../types/workflow'

interface LockInfo {
  lockedBy: { id: string; firstName?: string; email?: string } | null
  lockedAt: string | null
}

export const LockIndicator: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const { user } = useAuth()
  const typedUser = user as UserWithRole | null
  const [lockInfo, setLockInfo] = useState<LockInfo>({ lockedBy: null, lockedAt: null })
  const [isLockedByMe, setIsLockedByMe] = useState(false)
  const [isLockedByOther, setIsLockedByOther] = useState(false)

  const isAdmin = typedUser?.role === 'admin'

  // Fetch current lock status and attempt to lock
  const acquireLock = useCallback(async () => {
    if (!id || !collectionSlug || !typedUser?.id) return

    try {
      // First check current lock status
      const checkRes = await fetch(`/api/${collectionSlug}/${id}?depth=1&select=lockedBy,lockedAt`)
      if (!checkRes.ok) return
      const doc = await checkRes.json()

      const lockedById = typeof doc.lockedBy === 'object' ? doc.lockedBy?.id : doc.lockedBy

      if (lockedById && lockedById !== typedUser.id) {
        // Check if lock has expired (30 min)
        const lockedAt = doc.lockedAt ? new Date(doc.lockedAt).getTime() : 0
        const isExpired = Date.now() - lockedAt > 30 * 60 * 1000

        if (!isExpired) {
          // Locked by someone else — read only
          setLockInfo({
            lockedBy: typeof doc.lockedBy === 'object' ? doc.lockedBy : { id: doc.lockedBy },
            lockedAt: doc.lockedAt,
          })
          setIsLockedByOther(true)
          return
        }
      }

      // Lock it for ourselves
      const lockRes = await fetch(`/api/${collectionSlug}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lockedBy: typedUser.id,
          lockedAt: new Date().toISOString(),
        }),
      })
      if (lockRes.ok) {
        setIsLockedByMe(true)
        setIsLockedByOther(false)
        setLockInfo({ lockedBy: typedUser as LockInfo['lockedBy'], lockedAt: new Date().toISOString() })
      }
    } catch {
      // Non-critical
    }
  }, [id, collectionSlug, typedUser])

  // Release lock on unmount
  const releaseLock = useCallback(async () => {
    if (!id || !collectionSlug || !isLockedByMe) return
    try {
      await fetch(`/api/${collectionSlug}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lockedBy: null,
          lockedAt: null,
        }),
        keepalive: true,
      })
    } catch {
      // Best effort
    }
  }, [id, collectionSlug, isLockedByMe])

  useEffect(() => {
    acquireLock()
    return () => { releaseLock() }
  }, [acquireLock, releaseLock])

  const handleForceUnlock = async () => {
    if (!id || !collectionSlug) return
    try {
      await fetch(`/api/${collectionSlug}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lockedBy: null,
          lockedAt: null,
        }),
      })
      setIsLockedByOther(false)
      // Re-acquire for self
      acquireLock()
    } catch {
      // Non-critical
    }
  }

  // Don't render on create view
  if (!id) return null

  // No lock info to show
  if (!isLockedByOther && !isLockedByMe) return null

  const lockerName = lockInfo.lockedBy
    ? (lockInfo.lockedBy.firstName || lockInfo.lockedBy.email || 'Unknown')
    : 'Unknown'

  if (isLockedByOther) {
    return (
      <div style={{
        padding: '8px 16px',
        marginBottom: '8px',
        background: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '6px',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span>
          🔒 Locked by <strong>{lockerName}</strong> — this document is read-only
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          {isAdmin && (
            <button
              type="button"
              onClick={handleForceUnlock}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid #ef4444',
                background: 'white',
                color: '#ef4444',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              Force Unlock
            </button>
          )}
        </div>
      </div>
    )
  }

  // Locked by me — subtle indicator
  return (
    <div style={{
      padding: '4px 16px',
      marginBottom: '4px',
      fontSize: '11px',
      color: 'var(--theme-elevation-400)',
    }}>
      🔒 Editing — locked by you
    </div>
  )
}

export default LockIndicator
