/**
 * @description
 * Navigation link component for the custom admin sidebar.
 * Renders a link with icon, label, and optional badge count.
 *
 * @dependencies
 * - React (client component)
 *
 * @notes
 * - Uses plain anchor tags (Payload admin uses client-side routing)
 * - Badge shown for Workbox count
 * - Icons are simple text/emoji placeholders — can be swapped for heroicons later
 */
'use client'

import React from 'react'

// Simple icon map using Unicode/emoji placeholders
// These can be replaced with @heroicons/react in a future design pass
const ICON_MAP: Record<string, string> = {
  home: '\u2302',       // ⌂
  folder: '\uD83D\uDCC1',  // 📁
  inbox: '\uD83D\uDCE5',   // 📥
  grid: '\u25A6',       // ▦
  briefcase: '\uD83D\uDCBC', // 💼
  clipboard: '\uD83D\uDCCB', // 📋
  newspaper: '\uD83D\uDCF0', // 📰
  calendar: '\uD83D\uDCC5', // 📅
  file: '\uD83D\uDCC4', // 📄
  users: '\uD83D\uDC65', // 👥
  user: '\uD83D\uDC64', // 👤
  book: '\uD83D\uDCD6', // 📖
  layout: '\u2B1C',     // ⬜
  image: '\uD83D\uDDBC', // 🖼
  search: '\uD83D\uDD0D', // 🔍
  menu: '\u2630',       // ☰
  shield: '\uD83D\uDEE1', // 🛡
  settings: '\u2699',   // ⚙
}

interface NavLinkProps {
  href: string
  label: string
  icon?: string
  badge?: number
}

export const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, badge }) => {
  const iconChar = icon ? ICON_MAP[icon] || '' : ''

  return (
    <a
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 16px',
        fontSize: '13px',
        color: 'var(--theme-elevation-800)',
        textDecoration: 'none',
        borderRadius: '4px',
        margin: '1px 8px',
        transition: 'background-color 0.15s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--theme-elevation-100)'
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
      }}
    >
      {iconChar && <span style={{ width: '20px', textAlign: 'center', fontSize: '14px' }}>{iconChar}</span>}
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span style={{
          background: 'var(--theme-error-500, #e11d48)',
          color: 'white',
          fontSize: '10px',
          fontWeight: 700,
          borderRadius: '9px',
          padding: '1px 6px',
          minWidth: '18px',
          textAlign: 'center',
        }}>
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </a>
  )
}

export default NavLink
