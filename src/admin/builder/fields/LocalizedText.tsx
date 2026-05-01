/**
 * @description
 * Custom Puck field type for localized text per G4: stores `{ en, fr }`
 * shape in Puck JSON. Renders an EN/FR tabbed editor in the props drawer.
 * The Next.js page route reads the active locale from `params.locale`
 * and picks the matching value at render time.
 *
 * This satisfies G10 R2 (custom field types render in props drawer with
 * full Payload integration). POC-3 wires it into a sample component;
 * Epic 25 task 25.7 expands it with a Lexical-based LocalizedRichText sibling.
 */
'use client'

import * as React from 'react'
import type { CustomField } from '@measured/puck'

export type LocalizedTextValue = {
  en: string
  fr: string
}

export const localizedTextDefault: LocalizedTextValue = { en: '', fr: '' }

/**
 * Puck CustomField factory. Use as a field config like:
 *   { type: 'custom', label: 'Heading', render: localizedTextField }
 */
export const localizedTextField: CustomField<LocalizedTextValue>['render'] = ({
  value,
  onChange,
  field,
}) => {
  const safeValue: LocalizedTextValue =
    value && typeof value === 'object' ? value : localizedTextDefault

  const [activeLocale, setActiveLocale] = React.useState<'en' | 'fr'>('en')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600 }}>{field.label}</label>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {(['en', 'fr'] as const).map((loc) => (
          <button
            key={loc}
            type="button"
            onClick={() => setActiveLocale(loc)}
            style={{
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 600,
              border: '1px solid var(--puck-color-grey-09, #ddd)',
              borderRadius: 4,
              cursor: 'pointer',
              background:
                activeLocale === loc
                  ? 'var(--puck-color-azure-05, #2680eb)'
                  : 'transparent',
              color: activeLocale === loc ? 'white' : 'inherit',
            }}
          >
            {loc.toUpperCase()}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={safeValue[activeLocale]}
        onChange={(e) =>
          onChange({ ...safeValue, [activeLocale]: e.target.value })
        }
        style={{
          padding: '8px 10px',
          border: '1px solid var(--puck-color-grey-09, #ddd)',
          borderRadius: 4,
          fontSize: 14,
        }}
      />
    </div>
  )
}

/**
 * Helper for the public page renderer — given a LocalizedTextValue and a
 * locale string, return the right side. Handles legacy plain-string values
 * gracefully (treats them as EN).
 */
export const pickLocalizedText = (
  value: LocalizedTextValue | string | null | undefined,
  locale: string
): string => {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (locale === 'fr') return value.fr || value.en || ''
  return value.en || value.fr || ''
}
