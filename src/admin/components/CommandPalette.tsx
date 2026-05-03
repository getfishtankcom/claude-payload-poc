/**
 * Command Palette — Cmd/Ctrl+K global shortcut.
 *
 * Three groups: Navigate (static admin sections), Recent Items (last 5
 * from useRecentItems / localStorage), Create New (collection scaffolds).
 *
 * Closes on Escape, click-outside, or item selection. Search field is
 * autofocused on open.
 */
'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useFavorites } from '../hooks/useFavorites'

const NAVIGATE_ITEMS: Array<{ label: string; href: string; badge?: string }> = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Content Tree', href: '/admin/tree' },
  { label: 'Workbox', href: '/admin/workbox' },
  { label: 'Media Library', href: '/admin/media' },
  { label: 'Pages', href: '/admin/collections/pages', badge: 'Collection' },
  { label: 'News', href: '/admin/collections/news', badge: 'Collection' },
  { label: 'Projects', href: '/admin/collections/projects', badge: 'Collection' },
  { label: 'Events', href: '/admin/collections/events', badge: 'Collection' },
  { label: 'Documents', href: '/admin/collections/documents', badge: 'Collection' },
  { label: 'Resources', href: '/admin/collections/resources', badge: 'Collection' },
  { label: 'Boards', href: '/admin/collections/boards', badge: 'Collection' },
  { label: 'Standards', href: '/admin/collections/standards', badge: 'Collection' },
]

const CREATE_ITEMS: Array<{ label: string; href: string }> = [
  { label: 'New Page', href: '/admin/collections/pages/create' },
  { label: 'New News Article', href: '/admin/collections/news/create' },
  { label: 'New Project', href: '/admin/collections/projects/create' },
  { label: 'New Event', href: '/admin/collections/events/create' },
  { label: 'New Document', href: '/admin/collections/documents/create' },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)
  const { favorites } = useFavorites()

  // Cmd/Ctrl+K toggle.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    window.location.assign(href)
  }, [])

  if (!open) return null

  return (
    <div
      data-testid="command-palette-backdrop"
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        // Admin-shell overlay token (rgba(0,0,0,0.5)) — strong enough to
        // visually own the viewport so dashboard widgets behind the
        // palette read as inactive (#87 / QA-017).
        background: 'var(--surface-overlay)',
        backdropFilter: 'blur(2px)',
        WebkitBackdropFilter: 'blur(2px)',
        zIndex: 10001,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
      }}
    >
      <div
        data-testid="command-palette-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '560px',
          maxWidth: '90vw',
          // Opaque panel via admin-shell token so the surface stays solid
          // even when Payload's `--theme-elevation-*` vars aren't in scope
          // (e.g. on the bare /admin shell route).
          background: 'var(--surface-page)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-default)',
          borderRadius: '8px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
          overflow: 'hidden',
        }}
      >
        <Command
          label="Command Palette"
          loop
          style={{ width: '100%' }}
        >
          <Command.Input
            autoFocus
            placeholder="Type a command or search…"
            style={{
              width: '100%',
              padding: '14px 16px',
              border: 'none',
              borderBottom: '1px solid var(--border-default)',
              fontSize: '15px',
              outline: 'none',
              background: 'transparent',
              color: 'var(--text-primary)',
            }}
          />
          <Command.List
            style={{ maxHeight: '400px', overflow: 'auto', padding: '8px 4px' }}
          >
            <Command.Empty style={{ padding: '14px', color: 'var(--text-muted)', fontSize: '13px' }}>
              No results.
            </Command.Empty>

            <Command.Group heading="Navigate">
              {NAVIGATE_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => navigate(item.href)}
                  style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                >
                  <span>{item.label}</span>
                  {item.badge && (
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.badge}</span>
                  )}
                </Command.Item>
              ))}
            </Command.Group>

            {favorites.length > 0 && (
              <Command.Group heading="Pinned">
                {favorites.slice(0, 5).map((fav) => (
                  <Command.Item
                    key={`${fav.collection}:${fav.id}`}
                    onSelect={() => navigate(fav.path)}
                    style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                  >
                    <span>{fav.title}</span>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{fav.collection}</span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            <Command.Group heading="Create New">
              {CREATE_ITEMS.map((item) => (
                <Command.Item
                  key={item.href}
                  onSelect={() => navigate(item.href)}
                  style={{ padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  {item.label}
                </Command.Item>
              ))}
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  )
}

export default CommandPalette
