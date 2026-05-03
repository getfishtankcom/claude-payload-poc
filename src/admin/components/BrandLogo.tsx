/**
 * Brand wordmark for the admin auth views (login / forgot / reset).
 *
 * Mounted via `admin.components.graphics.Logo` in `payload.config.ts` so
 * Payload picks it up at the top of every auth page automatically — one
 * registration, three pages branded.
 *
 * Design: text-only wordmark in brand purple (matches the public
 * SiteHeader, which is also a text wordmark — no logo PNG/SVG asset
 * exists yet). Imports `BRAND` from the project's brand-constants module
 * per the CLAUDE.md "never hardcode org name" rule.
 */
import * as React from 'react'

import { BRAND } from '@/config/brand'

export const BrandLogo: React.FC = () => {
  return (
    <div
      data-testid="admin-brand-logo"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        padding: '0 0 8px',
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-body, system-ui, -apple-system, sans-serif)',
          fontSize: '28px',
          fontWeight: 700,
          letterSpacing: '-0.01em',
          color: 'var(--brand-fras, #601F5B)',
          lineHeight: 1.1,
        }}
      >
        {BRAND.name}
      </span>
      <span
        style={{
          fontSize: '11px',
          fontWeight: 500,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: 'var(--text-muted, #6b7280)',
        }}
      >
        {BRAND.adminTitle}
      </span>
    </div>
  )
}

export default BrandLogo
