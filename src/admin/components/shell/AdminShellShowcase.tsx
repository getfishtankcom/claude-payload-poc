'use client'

/**
 * @description
 * Visual showcase of <AdminShell> wired with placeholder slot contents,
 * useful for verifying chrome layout / responsive behavior before the real
 * slots (left tree spine, action bar, language switcher, etc.) ship.
 *
 * @notes
 * - Demonstrates default + collapsed-rail variants. The real Storybook
 *   stories will wrap this once Storybook lands in the v2 admin shell.
 */

import * as React from 'react'

import { AdminShell } from './AdminShell'

const Placeholder: React.FC<React.PropsWithChildren<{ label: string }>> = ({ label, children }) => (
  <div
    style={{
      padding: '8px 12px',
      borderRadius: 6,
      border: '1px dashed var(--border-default)',
      background: 'var(--surface-elevated)',
      color: 'var(--text-muted)',
      fontSize: 12,
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
    }}
  >
    <div style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{label}</div>
    {children}
  </div>
)

export const AdminShellShowcase: React.FC<{ defaultCollapsed?: boolean }> = ({
  defaultCollapsed = false,
}) => (
  <AdminShell
    defaultCollapsed={defaultCollapsed}
    languageSwitcher={<Placeholder label="ShellLocaleToggle" />}
    commandPaletteTrigger={<Placeholder label="⌘K" />}
    notificationBell={<Placeholder label="🔔" />}
    userMenu={<Placeholder label="UserMenu" />}
    leftRail={
      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Placeholder label="Tree spine">Tree items render here (#6).</Placeholder>
        <Placeholder label="Status gutter">Workflow / lock / locale icons.</Placeholder>
      </div>
    }
    actionBar={
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <Placeholder label="Save Draft" />
        <Placeholder label="Submit for Review" />
        <Placeholder label="Publish" />
      </div>
    }
  >
    <div style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0, fontSize: 22 }}>Workspace</h1>
      <p style={{ color: 'var(--text-muted)' }}>
        The current route renders here. <code>{'<AdminShell>'}</code> owns the chrome; route
        components fill the workspace slot.
      </p>
    </div>
  </AdminShell>
)

export default AdminShellShowcase
