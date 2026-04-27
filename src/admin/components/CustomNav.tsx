/**
 * @description
 * Custom sidebar navigation for RAS Canada CMS admin panel.
 * Replaces Payload's default Nav component via admin.components.Nav.
 *
 * Key features:
 * - Sections: Dashboard, Content Tree, Workbox (with badge count), Collections, Tools, System
 * - Admin-only links (Users, Settings) hidden for Author/Editor roles
 * - Collapsible to icons on smaller screens via CSS
 * - Workbox badge shows count of items awaiting action
 *
 * @dependencies
 * - @payloadcms/ui: Link, useAuth hooks
 *
 * @notes
 * - Registered in payload.config.ts via admin.components.Nav
 * - Server component by default; interactivity via client sub-components
 * - data-testid="sidebar-nav" for self-testing
 */
'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@payloadcms/ui'
import { NavLink } from './NavLink'

import type { UserWithRole } from '../types/workflow'

export const CustomNav: React.FC = () => {
  const { user } = useAuth()
  const typedUser = user as UserWithRole | null
  const isAdmin = typedUser?.role === 'admin'
  const [workboxCount, setWorkboxCount] = useState(0)

  // Fetch workbox count on mount and on focus
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/pages?where[workflowState][in]=in_review,needs_revision,approved&limit=0')
        if (res.ok) {
          const data = await res.json()
          setWorkboxCount(data.totalDocs || 0)
        }
      } catch {
        // Silently fail — badge count is non-critical
      }
    }

    fetchCount()
    const handleFocus = () => fetchCount()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  return (
    <nav
      data-testid="sidebar-nav"
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '16px 0',
        borderRight: '1px solid var(--theme-elevation-150)',
        background: 'var(--theme-elevation-0)',
        width: '240px',
        minWidth: '240px',
        overflow: 'auto',
      }}
    >
      {/* Logo / Brand */}
      <div style={{ padding: '0 16px 16px', borderBottom: '1px solid var(--theme-elevation-150)' }}>
        <span style={{ fontSize: '14px', fontWeight: 600 }}>RAS Canada CMS</span>
      </div>

      {/* Main Navigation */}
      <div style={{ padding: '8px 0', flex: 1 }}>
        <NavLink href="/admin" label="Dashboard" icon="home" />
        <NavLink href="/admin/tree" label="Content Tree" icon="folder" />
        <NavLink
          href="/admin/workbox"
          label="Workbox"
          icon="inbox"
          badge={workboxCount > 0 ? workboxCount : undefined}
        />

        {/* Collections Section */}
        <NavSection label="COLLECTIONS" />
        <NavLink href="/admin/collections/boards" label="Boards" icon="grid" />
        <NavLink href="/admin/collections/projects" label="Projects" icon="briefcase" />
        <NavLink href="/admin/collections/consultations" label="Consultations" icon="clipboard" />
        <NavLink href="/admin/collections/news" label="News" icon="newspaper" />
        <NavLink href="/admin/collections/events" label="Events" icon="calendar" />
        <NavLink href="/admin/collections/documents" label="Documents" icon="file" />
        <NavLink href="/admin/collections/contacts" label="Contacts" icon="users" />
        <NavLink href="/admin/collections/standards" label="Standards" icon="book" />
        <NavLink href="/admin/collections/board-members" label="Members" icon="user" />
        <NavLink href="/admin/collections/pages" label="Pages" icon="layout" />

        {/* Tools Section */}
        <NavSection label="TOOLS" />
        <NavLink href="/admin/media" label="Media Library" icon="image" />
        <NavLink href="/admin/schedule" label="Schedule" icon="calendar" />
        <NavLink href="/admin/language-audit" label="Language Audit" icon="file" />
        <NavLink href="/admin/collections/redirects" label="Redirects" icon="layout" />
        <NavLink href="/admin/globals/search-config" label="Search Config" icon="search" />

        {/* System Section — Admin only */}
        {isAdmin && (
          <>
            <NavSection label="SYSTEM" />
            <NavLink href="/admin/globals/navigation" label="Navigation" icon="menu" />
            <NavLink href="/admin/globals/footer" label="Footer" icon="layout" />
            <NavLink href="/admin/globals/homepage" label="Homepage" icon="home" />
            <NavLink href="/admin/collections/users" label="Users" icon="shield" />
            <NavLink href="/admin/globals/auth-config" label="Settings" icon="settings" />
          </>
        )}
      </div>

      {/* User info at bottom */}
      {typedUser && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--theme-elevation-150)',
          fontSize: '12px',
          color: 'var(--theme-elevation-500)',
        }}>
          <div>{typedUser.firstName || typedUser.email}</div>
          <div style={{ textTransform: 'capitalize' }}>{typedUser.role}</div>
        </div>
      )}
    </nav>
  )
}

/** Section header in the nav */
const NavSection: React.FC<{ label: string }> = ({ label }) => (
  <div style={{
    padding: '16px 16px 4px',
    fontSize: '11px',
    fontWeight: 600,
    color: 'var(--theme-elevation-400)',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  }}>
    {label}
  </div>
)

export default CustomNav
