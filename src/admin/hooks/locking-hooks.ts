/**
 * @description
 * Item locking hooks for concurrent edit prevention.
 * Auto-unlocks items after 30 minutes of idle time.
 *
 * Key features:
 * - beforeChange: checks if lock has expired (30min), auto-clears if so
 * - Locking/unlocking is done via REST API from the client component
 *
 * @notes
 * - Lock fields (lockedBy, lockedAt) are on the Pages collection
 * - Admin force-unlock is handled via the admin component
 * - 30-minute timeout checked in beforeChange to prevent stale locks blocking saves
 */
import type { CollectionBeforeChangeHook } from 'payload'

const LOCK_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutes

/**
 * beforeChange hook: auto-clears expired locks.
 * If the document is locked and the lock has expired, clear it.
 */
export const clearExpiredLock: CollectionBeforeChangeHook = ({
  data,
  originalDoc,
}) => {
  if (!originalDoc?.lockedAt) return data

  const lockedAt = new Date(originalDoc.lockedAt).getTime()
  const now = Date.now()

  if (now - lockedAt > LOCK_TIMEOUT_MS) {
    // Lock expired — clear it
    data.lockedBy = null
    data.lockedAt = null
  }

  return data
}
