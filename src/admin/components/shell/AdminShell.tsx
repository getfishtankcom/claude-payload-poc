'use client'

/**
 * @description
 * <AdminShell> — outer chrome for the entire `/admin/*` experience.
 * Composition-only at this layer. Slot props are filled by sibling
 * issues (#5 routing, #6 left tree spine, #7 action bar, #8 language
 * switcher, #10 auth bridge).
 *
 * Layout zones:
 *  ┌─────────────────────────────────────────────────────────┐
 *  │ Header   (logo · langSwitcher · cmdK · bell · userMenu) │
 *  ├──┬──────────────────────────────────────────────────────┤
 *  │  │                                                      │
 *  │L │              Workspace (children)                    │
 *  │R │                                                      │
 *  ├──┴──────────────────────────────────────────────────────┤
 *  │ Action Bar (sticky)                                     │
 *  └─────────────────────────────────────────────────────────┘
 *
 * @notes
 * - All visual properties resolve from CSS variables in admin-tailwind.css.
 * - Left rail collapses on narrow viewports (<900px) into a drawer
 *   triggered by the hamburger button; toggled state survives navigation
 *   via component-internal state (persistent store lands in #6).
 * - The far-left status gutter is part of the left rail column —
 *   gutter icons are rendered by tree items (#6).
 */

import * as React from 'react'

export type AdminShellProps = {
  /** Workspace content — the route's primary view. */
  children: React.ReactNode
  /** Brand mark / link home. Defaults to a text wordmark. */
  logo?: React.ReactNode
  /** Top-bar locale toggle. Filled by #8. */
  languageSwitcher?: React.ReactNode
  /** Cmd+K trigger button. Filled by Layer 2. */
  commandPaletteTrigger?: React.ReactNode
  /** Notification bell. */
  notificationBell?: React.ReactNode
  /** User avatar / account menu. */
  userMenu?: React.ReactNode
  /** Persistent left tree spine. Filled by #6. */
  leftRail?: React.ReactNode
  /** Sticky bottom action bar. Filled by #7. */
  actionBar?: React.ReactNode
  /** Force the left rail collapsed (overrides responsive default). */
  defaultCollapsed?: boolean
}

const HEADER_HEIGHT = 56
const RAIL_WIDTH = 280
const RAIL_COLLAPSED_WIDTH = 0
const NARROW_BREAKPOINT = 900

const useNarrowViewport = (): boolean => {
  const [narrow, setNarrow] = React.useState(false)
  React.useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${NARROW_BREAKPOINT}px)`)
    const handle = (e: MediaQueryListEvent | MediaQueryList) => setNarrow(e.matches)
    handle(mq)
    mq.addEventListener('change', handle)
    return () => mq.removeEventListener('change', handle)
  }, [])
  return narrow
}

export const AdminShell: React.FC<AdminShellProps> = ({
  children,
  logo,
  languageSwitcher,
  commandPaletteTrigger,
  notificationBell,
  userMenu,
  leftRail,
  actionBar,
  defaultCollapsed = false,
}) => {
  const narrow = useNarrowViewport()
  const [drawerOpen, setDrawerOpen] = React.useState(false)
  const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

  const railVisible = narrow ? drawerOpen : !collapsed
  const railWidth = railVisible ? RAIL_WIDTH : RAIL_COLLAPSED_WIDTH

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--surface-page)',
        color: 'var(--text-primary)',
        display: 'grid',
        gridTemplateRows: `${HEADER_HEIGHT}px 1fr auto`,
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
      data-admin-shell
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '0 16px',
          borderBottom: '1px solid var(--border-default)',
          backgroundColor: 'var(--surface-page)',
          position: 'sticky',
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          type="button"
          aria-label={railVisible ? 'Collapse navigation' : 'Open navigation'}
          aria-expanded={railVisible}
          aria-controls="admin-shell-rail"
          onClick={() => (narrow ? setDrawerOpen((v) => !v) : setCollapsed((v) => !v))}
          style={{
            width: 32,
            height: 32,
            border: '1px solid var(--border-default)',
            borderRadius: 6,
            background: 'var(--surface-elevated)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: 16,
          }}
        >
          ≡
        </button>

        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--brand-fras)' }}>
          {logo ?? 'RAS Canada CMS'}
        </div>

        <div style={{ flex: 1 }} />

        {commandPaletteTrigger}
        {languageSwitcher}
        {notificationBell}
        {userMenu}
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: narrow ? '1fr' : `${railWidth}px 1fr`,
          minHeight: 0,
          position: 'relative',
        }}
      >
        {!narrow && railVisible && (
          <aside
            id="admin-shell-rail"
            aria-label="Content navigation"
            style={{
              borderRight: '1px solid var(--border-default)',
              backgroundColor: 'var(--surface-elevated)',
              overflow: 'auto',
            }}
          >
            {leftRail}
          </aside>
        )}

        {narrow && drawerOpen && (
          <>
            <div
              role="presentation"
              onClick={() => setDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                top: HEADER_HEIGHT,
                background: 'var(--surface-overlay)',
                zIndex: 15,
              }}
            />
            <aside
              id="admin-shell-rail"
              aria-label="Content navigation"
              style={{
                position: 'fixed',
                top: HEADER_HEIGHT,
                left: 0,
                bottom: 0,
                width: Math.min(RAIL_WIDTH, 320),
                backgroundColor: 'var(--surface-elevated)',
                borderRight: '1px solid var(--border-default)',
                overflow: 'auto',
                zIndex: 16,
              }}
            >
              {leftRail}
            </aside>
          </>
        )}

        <main
          style={{
            overflow: 'auto',
            minHeight: 0,
            backgroundColor: 'var(--surface-page)',
          }}
        >
          {children}
        </main>
      </div>

      {actionBar !== undefined && (
        <footer
          style={{
            borderTop: '1px solid var(--border-default)',
            backgroundColor: 'var(--surface-elevated)',
            padding: '8px 16px',
            position: 'sticky',
            bottom: 0,
            zIndex: 10,
          }}
        >
          {actionBar}
        </footer>
      )}
    </div>
  )
}

export default AdminShell
