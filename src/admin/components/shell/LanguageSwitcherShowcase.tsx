'use client'

/**
 * @description
 * Visual showcase of <LanguageSwitcher> in EN + FR states and
 * <MissingLocaleBanner> hidden + visible. To be wrapped as Storybook
 * stories when Storybook lands.
 */

import * as React from 'react'

import { LanguageSwitcher, MissingLocaleBanner, type Locale } from './LanguageSwitcher'

const Card: React.FC<React.PropsWithChildren<{ title: string }>> = ({ title, children }) => (
  <section
    style={{
      border: '1px solid var(--border-default)',
      borderRadius: 8,
      background: 'var(--surface-elevated)',
      padding: 12,
    }}
  >
    <header
      style={{
        fontSize: 12,
        fontWeight: 600,
        color: 'var(--text-secondary)',
        marginBottom: 8,
      }}
    >
      {title}
    </header>
    {children}
  </section>
)

export const LanguageSwitcherShowcase: React.FC = () => {
  const [locale, setLocale] = React.useState<Locale>('en')

  return (
    <div
      style={{
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        backgroundColor: 'var(--surface-page)',
        color: 'var(--text-primary)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <Card title="Switcher (interactive)">
        <LanguageSwitcher locale={locale} onChange={setLocale} />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
          Active: {locale}
        </p>
      </Card>

      <Card title="Banner — missing FR (current=EN)">
        <MissingLocaleBanner locale="en" otherLocaleExists={false} onTranslate={() => {}} />
      </Card>

      <Card title="Banner — missing EN (current=FR)">
        <MissingLocaleBanner locale="fr" otherLocaleExists={false} onTranslate={() => {}} />
      </Card>

      <Card title="Banner — both locales present (renders nothing)">
        <MissingLocaleBanner locale="en" otherLocaleExists={true} />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          (banner hidden when other locale exists)
        </span>
      </Card>
    </div>
  )
}

export default LanguageSwitcherShowcase
