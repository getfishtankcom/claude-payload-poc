/**
 * @description
 * Client-side Page Builder view (Puck-based) for the RAS Canada CMS admin.
 * Replaces the previous @dnd-kit-based builder which had drag-drop reliability
 * issues (the Layer 0 spike findings — see spike-admin-platform-layer-0.md
 * §13 G2 + G10).
 *
 * Architecture (per spike §7.3 revised 2026-05-01 once verified Puck has
 * no external-URL iframe API):
 * - LEFT/CENTER: Puck inline (`iframe.enabled: false`) — drag/drop, drop
 *   zones, prop drawer. Uses real `@/components/ui` primitives so editor
 *   surface matches FRAS branding.
 * - RIGHT (drawer): a Live Preview iframe loading the existing
 *   `/api/preview` route. Saves propagate via `postMessage` (the existing
 *   feat preview-route stub) → Live Preview re-renders.
 *
 * Data model:
 * - Reads from / writes to `pages.builderLayout` (Payload JSON field).
 *   This matches feat's existing collection schema; do NOT use `layout`.
 * - Page id is parsed from `window.location.pathname` (`/admin/builder/:id`)
 *   matching feat's existing PageBuilderClient pattern.
 *
 * Note: storybook stories for the Puck components (PuckComponents.stories.tsx)
 * were left out of this swap because feat is on Storybook 8 and the
 * worktree authored them against Storybook 10. Bring them in once the
 * Storybook major bump is on the table.
 */
'use client'

import * as React from 'react'
import { Puck, type Data } from '@measured/puck'
import '@measured/puck/puck.css'

import { buildPuckConfig } from '../builder/puckConfig'
import { FRASActionBar } from '../builder/FRASActionBar'

const AUTOSAVE_DEBOUNCE_MS = 5_000

type PageData = {
  id: string | number
  title: string
  slug: string
  builderLayout?: Data | null
}

function getPageIdFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  const match = window.location.pathname.match(/\/admin\/builder\/([^/]+)/)
  return match ? match[1] : null
}

export function PageBuilderClient() {
  const [pageData, setPageData] = React.useState<PageData | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  const [locale, setLocale] = React.useState<'en' | 'fr'>('en')
  const [saving, setSaving] = React.useState(false)
  const [lastSavedAt, setLastSavedAt] = React.useState<number | null>(null)
  const debounceTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const config = React.useMemo(() => buildPuckConfig(locale), [locale])

  // Load page on mount.
  React.useEffect(() => {
    const id = getPageIdFromUrl()
    if (!id) {
      setError('No page id in URL.')
      setLoading(false)
      return
    }
    fetch(`/api/pages/${id}?draft=true`, { credentials: 'same-origin' })
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load page (${r.status})`)
        return r.json()
      })
      .then((data: PageData) => setPageData(data))
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false))
  }, [])

  const data: Data =
    (pageData?.builderLayout as Data | null | undefined) ??
    ({ content: [], root: { props: {} } } as unknown as Data)

  const persistDraft = React.useCallback(
    (newData: Data) => {
      const id = pageData?.id
      if (!id) return
      setSaving(true)
      fetch(`/api/pages/${id}?draft=true&autosave=true`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ builderLayout: newData, _status: 'draft' }),
      })
        .then(() => setLastSavedAt(Date.now()))
        .finally(() => setSaving(false))
    },
    [pageData?.id]
  )

  const handleChange = React.useCallback(
    (newData: Data) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      debounceTimer.current = setTimeout(
        () => persistDraft(newData),
        AUTOSAVE_DEBOUNCE_MS
      )
    },
    [persistDraft]
  )

  const previewSecret = process.env.NEXT_PUBLIC_PREVIEW_SECRET ?? ''
  const previewUrl =
    pageData?.id && previewSecret
      ? `/api/preview?id=${pageData.id}&secret=${previewSecret}`
      : null

  if (loading) {
    return <div style={{ padding: 24 }}>Loading page…</div>
  }
  if (error) {
    return (
      <div style={{ padding: 24, color: '#a8071a' }}>
        Failed to load page: {error}
      </div>
    )
  }
  if (!pageData) {
    return <div style={{ padding: 24 }}>No page data.</div>
  }

  return (
    <div
      data-testid="page-builder"
      style={{
        display: 'grid',
        gridTemplateColumns: previewUrl ? 'minmax(0, 1fr) 480px' : 'minmax(0, 1fr)',
        height: 'calc(100vh - 60px)',
      }}
    >
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <FRASActionBar
          saving={saving}
          lastSavedAt={lastSavedAt}
          readOnly={false}
          onSubmitForReview={() => {
            // Wired by Epic 22 (workflow transitions).
            // eslint-disable-next-line no-console
            console.log('[FRAS] Submit for Review (stub)')
          }}
          onPublish={() => {
            // eslint-disable-next-line no-console
            console.log('[FRAS] Publish (stub)')
          }}
          onPreview={() => {
            if (previewUrl)
              window.open(previewUrl, '_blank', 'noopener,noreferrer')
          }}
          onLocaleChange={setLocale}
          locale={locale}
          lockedByOther={false}
        />
        <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
          <Puck
            config={config}
            data={data}
            iframe={{ enabled: false }}
            onChange={handleChange}
            permissions={{
              delete: true,
              drag: true,
              duplicate: true,
              edit: true,
              insert: true,
            }}
            overrides={{
              header: () => <></>,
              headerActions: () => <></>,
            }}
          />
        </div>
      </div>

      {previewUrl ? (
        <aside
          style={{
            borderLeft: '1px solid var(--theme-elevation-100, #ddd)',
            display: 'flex',
            flexDirection: 'column',
            background: '#fff',
          }}
        >
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid var(--theme-elevation-100, #ddd)',
              fontSize: 12,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <span>Live Preview</span>
            <span style={{ color: '#666', fontWeight: 400, fontSize: 11 }}>
              /{locale}/{pageData.slug}
            </span>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 10, color: '#999' }}>
              Refreshes on save · {pageData.title}
            </span>
          </div>
          <iframe
            key={`${locale}-${pageData.slug}`}
            src={previewUrl}
            title="Live Preview"
            style={{ flex: 1, width: '100%', border: 'none' }}
          />
        </aside>
      ) : null}
    </div>
  )
}

export default PageBuilderClient
