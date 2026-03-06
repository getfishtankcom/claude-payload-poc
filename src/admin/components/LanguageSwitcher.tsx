/**
 * @description
 * Language switcher component for the admin edit view toolbar.
 * Provides EN/FR locale switching for localized fields.
 *
 * Key features:
 * - Dropdown showing [EN] [FR] with active locale highlighted
 * - Switches Payload's locale context for localized fields
 * - Translation status banner: "FR version: NOT TRANSLATED" when no FR content
 * - "Copy from EN" button when creating FR version of untranslated item
 *
 * @dependencies
 * - @payloadcms/ui: useLocale, useDocumentInfo
 *
 * @notes
 * - Payload's built-in localization handles the field value switching
 * - This component provides a more visible UI than the default locale selector
 * - Registered via admin.components.edit.beforeDocumentControls
 * - The locale is changed by navigating with ?locale= query param
 */
'use client'

import React, { useState, useEffect } from 'react'
import { useDocumentInfo } from '@payloadcms/ui'

export const LanguageSwitcher: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const [currentLocale, setCurrentLocale] = useState<'en' | 'fr'>('en')
  const [hasFrContent, setHasFrContent] = useState<boolean | null>(null)

  // Read locale from URL search params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const locale = params.get('locale')
    if (locale === 'fr') {
      setCurrentLocale('fr')
    } else {
      setCurrentLocale('en')
    }
  }, [])

  // Check if FR content exists
  useEffect(() => {
    if (!id || !collectionSlug) return
    const checkFr = async () => {
      try {
        const res = await fetch(`/api/${collectionSlug}/${id}?locale=fr&depth=0&select=title`)
        if (res.ok) {
          const data = await res.json()
          // If the FR title exists and differs from empty/null, consider it translated
          setHasFrContent(Boolean(data.title && data.title.trim().length > 0))
        }
      } catch {
        setHasFrContent(null)
      }
    }
    checkFr()
  }, [id, collectionSlug])

  const switchLocale = (locale: 'en' | 'fr') => {
    if (locale === currentLocale) return
    const url = new URL(window.location.href)
    url.searchParams.set('locale', locale)
    window.location.href = url.toString()
  }

  const handleCopyFromEN = async () => {
    if (!id || !collectionSlug) return
    try {
      // Fetch EN content
      const res = await fetch(`/api/${collectionSlug}/${id}?locale=en&depth=0`)
      if (!res.ok) return
      const enData = await res.json()

      // Copy localized fields to FR
      const localizedFields: Record<string, unknown> = {}
      if (enData.title) localizedFields.title = enData.title
      if (enData.excerpt) localizedFields.excerpt = enData.excerpt
      // Additional localized fields can be added here

      await fetch(`/api/${collectionSlug}/${id}?locale=fr`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(localizedFields),
      })

      // Reload to show copied content
      window.location.reload()
    } catch {
      // Non-critical
    }
  }

  // Don't render on create view
  if (!id) return null

  return (
    <div style={{ marginBottom: '8px' }}>
      {/* Locale Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        marginBottom: hasFrContent === false && currentLocale === 'fr' ? '8px' : '0',
      }}>
        <span style={{ fontSize: '12px', color: 'var(--theme-elevation-500)', marginRight: '4px' }}>
          Language:
        </span>
        <button
          type="button"
          onClick={() => switchLocale('en')}
          style={{
            padding: '3px 10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
            fontSize: '12px',
            fontWeight: currentLocale === 'en' ? 700 : 400,
            background: currentLocale === 'en' ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-50)',
            color: currentLocale === 'en' ? 'white' : 'var(--theme-elevation-600)',
            cursor: 'pointer',
          }}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => switchLocale('fr')}
          style={{
            padding: '3px 10px',
            borderRadius: '4px',
            border: '1px solid var(--theme-elevation-200)',
            fontSize: '12px',
            fontWeight: currentLocale === 'fr' ? 700 : 400,
            background: currentLocale === 'fr' ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-50)',
            color: currentLocale === 'fr' ? 'white' : 'var(--theme-elevation-600)',
            cursor: 'pointer',
          }}
        >
          FR
        </button>

        {/* Translation status */}
        {hasFrContent === false && (
          <span style={{
            marginLeft: '8px',
            padding: '2px 8px',
            borderRadius: '4px',
            background: '#fef3c7',
            color: '#92400e',
            fontSize: '11px',
            fontWeight: 500,
          }}>
            FR: NOT TRANSLATED
          </span>
        )}
      </div>

      {/* Copy from EN banner */}
      {currentLocale === 'fr' && hasFrContent === false && (
        <div style={{
          padding: '8px 12px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '6px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ color: '#1e40af' }}>
            This item has no French translation yet.
          </span>
          <button
            type="button"
            onClick={handleCopyFromEN}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid #3b82f6',
              background: '#3b82f6',
              color: 'white',
              fontSize: '12px',
              cursor: 'pointer',
            }}
          >
            Copy from EN
          </button>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
