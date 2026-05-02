/**
 * Notification bell — polled every 60s, opens a dropdown with the last
 * 20 notifications for the current user.
 */
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

interface Notification {
  id: string | number
  type: 'workflow_transition' | 'lock_alert' | 'system' | 'mention'
  message: string
  link?: string
  read: boolean
  createdAt: string
}

const POLL_INTERVAL_MS = 60_000

export function NotificationBell() {
  const { user } = useAuth()
  const userId = (user as { id?: string | number } | null)?.id
  const [items, setItems] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  const fetchItems = useCallback(async () => {
    if (!userId) return
    try {
      const res = await fetch(
        `/api/notifications?where[recipient][equals]=${userId}&limit=20&sort=-createdAt&depth=0`,
      )
      if (!res.ok) return
      const data = (await res.json()) as { docs?: Notification[] }
      setItems(data.docs ?? [])
    } catch {
      // Silently fail — next poll will retry.
    }
  }, [userId])

  useEffect(() => {
    fetchItems()
    const id = setInterval(fetchItems, POLL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [fetchItems])

  // Click-outside close.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!panelRef.current?.contains(e.target as Node)) setOpen(false)
    }
    window.addEventListener('mousedown', onClick)
    return () => window.removeEventListener('mousedown', onClick)
  }, [open])

  const unread = items.filter((n) => !n.read).length

  const markAsRead = async (id: string | number) => {
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true }),
      })
    } catch {
      /* surfaced on next poll */
    }
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllRead = async () => {
    const unreadItems = items.filter((n) => !n.read)
    await Promise.allSettled(
      unreadItems.map((n) =>
        fetch(`/api/notifications/${n.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ read: true }),
        }),
      ),
    )
    setItems((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!userId) return null

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={`Notifications (${unread} unread)`}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '6px',
          color: 'var(--theme-elevation-700)',
          position: 'relative',
        }}
      >
        <svg width={18} height={18} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2z" />
        </svg>
        {unread > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              background: '#dc2626',
              color: 'white',
              fontSize: '9px',
              fontWeight: 700,
              borderRadius: '10px',
              padding: '1px 5px',
              minWidth: '14px',
              textAlign: 'center',
              lineHeight: 1,
            }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notifications"
          style={{
            position: 'absolute',
            top: '34px',
            right: '0',
            width: '320px',
            maxHeight: '420px',
            overflow: 'auto',
            background: 'var(--theme-elevation-0)',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '6px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 100,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              borderBottom: '1px solid var(--theme-elevation-150)',
            }}
          >
            <strong style={{ fontSize: '13px' }}>Notifications</strong>
            {unread > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '11px',
                  color: '#601F5B',
                  cursor: 'pointer',
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <p style={{ padding: '14px', fontSize: '12px', color: 'var(--theme-elevation-500)', margin: 0 }}>
              No notifications yet.
            </p>
          ) : (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {items.map((n) => (
                <li
                  key={n.id}
                  style={{
                    padding: '8px 12px',
                    borderBottom: '1px solid var(--theme-elevation-100)',
                    background: n.read ? 'transparent' : 'var(--theme-elevation-50)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                  }}
                >
                  <div style={{ fontSize: '12px', color: 'var(--theme-elevation-800)' }}>{n.message}</div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '11px',
                      color: 'var(--theme-elevation-500)',
                    }}
                  >
                    <span>{new Date(n.createdAt).toLocaleString()}</span>
                    <span style={{ display: 'flex', gap: '8px' }}>
                      {n.link && (
                        <a href={n.link} style={{ color: '#601F5B', textDecoration: 'none' }}>
                          Go to item
                        </a>
                      )}
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(n.id)}
                          style={{ background: 'transparent', border: 'none', color: '#601F5B', cursor: 'pointer', fontSize: '11px' }}
                        >
                          Mark read
                        </button>
                      )}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationBell
