'use client'

/**
 * @description
 * <LocalizedField> — wraps any Layer 1 field component to render its
 * EN + FR variants. Two layouts:
 * - `mode="side-by-side"` (default): renders both locales as separate
 *   instances of the inner field, each bound to a `<name>__<locale>`
 *   key in the form context.
 * - `mode="toggle"`: renders one variant at a time, with a small
 *   locale chip group switching between them.
 *
 * Per-locale dirty tracking falls out automatically because each
 * locale binds to its own form context key.
 *
 * @notes
 * - The wrapper is composable around ANY Layer 1 field — caller passes
 *   a `renderField(localeName, locale)` callback so the LocalizedField
 *   doesn't need to know which primitive it's wrapping.
 * - Sync to `?locale=` URL param is the responsibility of the
 *   surrounding route (LanguageSwitcher already exists in #8); this
 *   component takes its initial locale via a prop.
 */

import * as React from 'react'

export type Locale = 'en' | 'fr'

export type LocalizedFieldMode = 'side-by-side' | 'toggle'

export type LocalizedFieldProps = {
  /** Base field name; per-locale names become `<name>__<locale>`. */
  name: string
  /** Visible group label. */
  label?: string
  mode?: LocalizedFieldMode
  /** Initial locale for toggle mode. */
  initialLocale?: Locale
  /**
   * Renders the inner field bound to the given per-locale name. The
   * caller should hand the returned `localeName` directly to the
   * primitive's `name` prop.
   */
  renderField: (localeName: string, locale: Locale) => React.ReactNode
}

const LOCALE_LABEL: Record<Locale, string> = { en: 'English', fr: 'Français' }
const LOCALE_SHORT: Record<Locale, string> = { en: 'EN', fr: 'FR' }

/**
 * Builds the per-locale field name. Exported for consumers that need
 * to read/write locale-specific values from the form context.
 */
export const localeFieldName = (base: string, locale: Locale): string =>
  `${base}__${locale}`

export const LocalizedField: React.FC<LocalizedFieldProps> = ({
  name,
  label,
  mode = 'side-by-side',
  initialLocale = 'en',
  renderField,
}) => {
  const [active, setActive] = React.useState<Locale>(initialLocale)

  if (mode === 'toggle') {
    return (
      <div data-localized-field={name}>
        {label && (
          <div
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'var(--text-primary)',
              marginBottom: 6,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {label}
            <span
              role="group"
              aria-label="Locale"
              style={{ display: 'inline-flex', gap: 2, marginLeft: 'auto' }}
            >
              {(['en', 'fr'] as Locale[]).map((loc) => (
                <button
                  key={loc}
                  type="button"
                  aria-pressed={active === loc}
                  onClick={() => setActive(loc)}
                  data-testid={`localized-${name}-${loc}`}
                  style={{
                    padding: '2px 8px',
                    minWidth: 28,
                    fontSize: 11,
                    fontWeight: 600,
                    border: '1px solid var(--border-strong)',
                    borderRadius: 3,
                    background: active === loc ? 'var(--brand-fras)' : 'var(--surface-page)',
                    color: active === loc ? 'var(--text-on-brand)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {LOCALE_SHORT[loc]}
                </button>
              ))}
            </span>
          </div>
        )}
        <div data-locale={active}>{renderField(localeFieldName(name, active), active)}</div>
      </div>
    )
  }

  return (
    <div data-localized-field={name}>
      {label && (
        <div
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: 'var(--text-primary)',
            marginBottom: 6,
          }}
        >
          {label}
        </div>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 12,
        }}
      >
        {(['en', 'fr'] as Locale[]).map((loc) => (
          <div
            key={loc}
            data-locale={loc}
            style={{
              border: '1px solid var(--border-default)',
              borderRadius: 4,
              padding: 8,
              background: 'var(--surface-elevated)',
            }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--text-muted)',
                marginBottom: 6,
              }}
            >
              {LOCALE_LABEL[loc]}
            </div>
            {renderField(localeFieldName(name, loc), loc)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default LocalizedField
