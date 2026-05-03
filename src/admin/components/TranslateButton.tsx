/**
 * "Translate to FR" button — Payload edit-view component (PRD §13.E).
 *
 * Sits in the doc header alongside FrTranslationWarning and VersionDiffButton.
 * Visible whenever the user is editing a doc in the Payload admin. POSTs to
 * /api/admin/translate, which calls Anthropic Sonnet 4.6 with the FRAS
 * glossary, writes the FR locale, and flips translationStatus to
 * 'pending_review'.
 *
 * Reviewer flow (Path A): user clicks → loading state → success toast →
 * user switches to FR locale tab to eyeball / edit / approve.
 */
'use client'

import React, { useCallback, useState } from 'react'
import { useDocumentInfo, useLocale, toast } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

import { emitFrTranslationCompleted } from '../lib/fr-translation-events'

type ApiResponse = {
  success?: boolean
  error?: string
  translatedFields?: string[]
  cost?: { usd: number }
  cumulativeUsd?: number
}

export const TranslateButton: React.FC = () => {
  const { id, collectionSlug } = useDocumentInfo()
  const locale = useLocale()
  const router = useRouter()
  const [busy, setBusy] = useState(false)

  const onClick = useCallback(async () => {
    if (!id || !collectionSlug) return
    setBusy(true)
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectionSlug, docId: id }),
      })
      const data = (await res.json()) as ApiResponse
      if (!res.ok || !data.success) {
        const msg = data.error || `Translation failed (HTTP ${res.status})`
        toast.error(`Translate to FR: ${msg}`)
        return
      }
      const cost = data.cost?.usd?.toFixed(4) ?? '?'
      const fields = data.translatedFields?.length ?? 0
      toast.success(
        `Translated ${fields} fields → FR ($${cost}). Review on the FR locale tab.`,
      )
      // Issue #84 (QA-014): tell the FR-translation warning to re-evaluate
      // its "is FR missing?" check against the live DB. Without this it
      // keeps rendering the orange flag even though the translate landed.
      emitFrTranslationCompleted({ collectionSlug: String(collectionSlug), docId: id })
      router.refresh()
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e)
      toast.error(`Translate to FR: ${msg}`)
    } finally {
      setBusy(false)
    }
  }, [id, collectionSlug, router])

  if (!id || !collectionSlug) return null

  // Only show on EN locale — clicking on FR locale doesn't make sense.
  // useLocale() returns the active locale.
  const localeCode = typeof locale === 'string' ? locale : (locale as { code?: string })?.code
  if (localeCode && localeCode !== 'en') return null

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      title="AI-translate this document to French (FR locale will be filled with a draft for review)"
      style={{
        padding: '6px 12px',
        fontSize: '13px',
        fontWeight: 500,
        background: busy ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-50)',
        color: 'var(--theme-text)',
        border: '1px solid var(--theme-elevation-150)',
        borderRadius: '4px',
        cursor: busy ? 'wait' : 'pointer',
        marginRight: '8px',
      }}
    >
      {busy ? 'Translating…' : 'Translate to FR'}
    </button>
  )
}

export default TranslateButton
