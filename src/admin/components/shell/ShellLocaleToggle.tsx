'use client'

/**
 * @description
 * <ShellLocaleToggle> — EN/FR toggle for the AdminShell top header.
 * Locale state syncs to the `?locale=` URL query parameter.
 *
 * @notes
 * - Pure header chrome. Field-level EN/FR rendering lands in Layer 1's
 *   `<LocalizedField>` wrapper.
 * - Reads/writes `?locale=` only — no localStorage / cookie. Server
 *   components downstream resolve locale from the same query param so
 *   navigation is the source of truth.
 */

import * as React from 'react'

export type Locale = 'en' | 'fr'

export const LOCALES: { code: Locale; label: string; long: string }[] = [
  { code: 'en', label: 'EN', long: 'English' },
  { code: 'fr', label: 'FR', long: 'Français' },
]

const buttonStyle = (active: boolean): React.CSSProperties => ({
  height: 28,
  minWidth: 36,
  padding: '0 8px',
  border: '1px solid var(--border-strong)',
  borderRadius: 4,
  background: active ? 'var(--brand-fras)' : 'var(--surface-page)',
  color: active ? 'var(--text-on-brand)' : 'var(--text-primary)',
  fontWeight: active ? 600 : 500,
  fontSize: 12,
  cursor: 'pointer',
  fontFamily: 'inherit',
})

export type ShellLocaleToggleProps = {
  /** Current locale. */
  locale: Locale
  /** Called when the user picks a new locale. */
  onChange: (locale: Locale) => void
}

export const ShellLocaleToggle: React.FC<ShellLocaleToggleProps> = ({ locale, onChange }) => (
  <div role="group" aria-label="Locale" style={{ display: 'inline-flex', gap: 4 }}>
    {LOCALES.map(({ code, label, long }) => (
      <button
        key={code}
        type="button"
        aria-label={long}
        aria-pressed={locale === code}
        onClick={() => onChange(code)}
        style={buttonStyle(locale === code)}
      >
        {label}
      </button>
    ))}
  </div>
)

export type MissingLocaleBannerProps = {
  /** The locale currently being viewed. */
  locale: Locale
  /** Whether the other locale exists for the current item. */
  otherLocaleExists: boolean
  /** Click "Translate" / "Copy from EN" CTA. */
  onTranslate?: () => void
}

/**
 * Renders a banner inside the workspace when the current item lacks the
 * other locale. Hidden when both locales exist.
 */
export const MissingLocaleBanner: React.FC<MissingLocaleBannerProps> = ({
  locale,
  otherLocaleExists,
  onTranslate,
}) => {
  if (otherLocaleExists) return null

  const other = locale === 'en' ? 'FR' : 'EN'
  const otherLong = locale === 'en' ? 'Français' : 'English'

  return (
    <div
      role="status"
      style={{
        margin: '12px 16px',
        padding: '10px 14px',
        borderRadius: 6,
        background: 'var(--lang-missing-bg)',
        color: 'var(--lang-missing)',
        border: '1px solid var(--lang-missing)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        fontSize: 13,
      }}
    >
      <span style={{ flex: 1 }}>
        This item has no <strong>{otherLong}</strong> ({other}) translation yet.
      </span>
      {onTranslate && (
        <button
          type="button"
          onClick={onTranslate}
          style={{
            border: '1px solid var(--lang-missing)',
            background: 'transparent',
            color: 'var(--lang-missing)',
            padding: '4px 10px',
            borderRadius: 4,
            fontSize: 12,
            cursor: 'pointer',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          Translate to {other}
        </button>
      )}
    </div>
  )
}

/**
 * Resolves the active locale from a URLSearchParams instance, defaulting
 * to `en` when missing or unrecognized. Exported for tests.
 */
export const resolveLocale = (params: URLSearchParams | null): Locale => {
  const raw = params?.get('locale')
  return raw === 'fr' ? 'fr' : 'en'
}
