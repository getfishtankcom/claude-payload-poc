/**
 * Brand mark for the admin auth views (login / forgot / reset).
 *
 * Mounted via `admin.components.graphics.Logo` in `payload.config.ts` —
 * Payload renders this component above the form on every auth page.
 *
 * Behaviour: server component that fetches the `branding` global at
 * request time and renders the uploaded logo when present, falling back
 * to the text wordmark (`BRAND.name` + `BRAND.adminTitle`) when the
 * global is empty so a fresh DB or misconfigured environment still
 * shows a credible login screen.
 *
 * Locale is `en` for the auth surface — the admin language preference
 * is set AFTER login, and the brand mark is shared across locales.
 *
 * Render is split into a sync `BrandLogoView` (testable) and an async
 * data-fetching wrapper. Tests render the view directly without mocking
 * the Payload local API.
 */
import * as React from 'react'

import { BRAND } from '@/config/brand'
import { getBranding } from '@/lib/cms'

export type BrandLogoData = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
} | null

const TextFallback: React.FC = () => (
  <>
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
  </>
)

/** Sync render with resolved data — easy to test, easy to story. */
export const BrandLogoView: React.FC<{ logo?: BrandLogoData }> = ({ logo }) => {
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
      {logo?.url ? (
        <div
          style={{
            // The FRAS wordmark is purple-on-transparent — designed for
            // light backgrounds. Payload's auth view renders dark by
            // default, so we lay the mark on a white tile so it stays
            // legible (and stays WCAG-compliant on contrast).
            backgroundColor: '#ffffff',
            padding: '12px 16px',
            borderRadius: '6px',
            display: 'inline-block',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logo.url}
            alt={logo.alt || BRAND.name}
            width={logo.width || undefined}
            height={logo.height || undefined}
            style={{ maxHeight: '64px', width: 'auto', display: 'block' }}
          />
        </div>
      ) : (
        <TextFallback />
      )}
    </div>
  )
}

/** Async wrapper Payload mounts as the admin Logo graphic. */
export const BrandLogo: React.FC = async () => {
  const branding = await getBranding('en')
  return <BrandLogoView logo={branding?.logo ?? null} />
}

export default BrandLogo
