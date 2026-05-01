/**
 * Language Audit — table of content items with FR translation status.
 *
 * Filters: collection, board, status. Summary cards show translated/total
 * counts per collection. Click "Open in FR" to jump straight into the
 * French edit view.
 */
'use client'

import React, { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'

type FrStatus = 'translated' | 'partial' | 'missing' | 'all'
type TranslationReviewStatus =
  | 'untranslated'
  | 'pending_review'
  | 'changes_requested'
  | 'approved'
type ReviewFilter = TranslationReviewStatus | 'all'

interface AuditItem {
  id: string | number
  title: string
  collection: 'pages' | 'news' | 'projects'
  board?: { title?: string; slug?: string } | null
  frStatus: 'translated' | 'partial' | 'missing'
  translationStatus: TranslationReviewStatus
  updatedAt?: string
}

interface AuditResponse {
  items: AuditItem[]
  summary: Record<
    string,
    {
      total: number
      translated: number
      partial: number
      missing: number
      translationStatus: Record<TranslationReviewStatus, number>
    }
  >
  total: number
}

const STATUS_COLORS: Record<AuditItem['frStatus'], string> = {
  translated: '#16a34a',
  partial: '#ca8a04',
  missing: '#dc2626',
}

const REVIEW_COLORS: Record<TranslationReviewStatus, string> = {
  untranslated: '#6b7280',
  pending_review: '#2563eb',
  changes_requested: '#ca8a04',
  approved: '#16a34a',
}

const REVIEW_LABELS: Record<TranslationReviewStatus, string> = {
  untranslated: 'Untranslated',
  pending_review: 'Pending Review',
  changes_requested: 'Changes Requested',
  approved: 'Approved',
}

export function LanguageAuditViewClient() {
  const [collection, setCollection] = useState<'all' | AuditItem['collection']>('all')
  const [status, setStatus] = useState<FrStatus>('all')
  const [translationStatus, setTranslationStatus] = useState<ReviewFilter>('all')
  const [board, setBoard] = useState<string>('')

  const params = useMemo(() => {
    const usp = new URLSearchParams()
    if (collection !== 'all') usp.set('collection', collection)
    if (status !== 'all') usp.set('status', status)
    if (translationStatus !== 'all') usp.set('translationStatus', translationStatus)
    if (board) usp.set('board', board)
    return usp.toString()
  }, [collection, status, translationStatus, board])

  const query = useQuery<AuditResponse>({
    queryKey: ['language-audit', params],
    queryFn: async () => {
      const res = await fetch(`/api/admin/language-audit${params ? `?${params}` : ''}`)
      if (!res.ok) throw new Error(`Audit fetch failed: ${res.status}`)
      return res.json()
    },
  })

  const summary = query.data?.summary ?? {}
  const items = query.data?.items ?? []

  return (
    <div data-testid="page-language-audit" style={{ padding: '24px', maxWidth: '1100px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 600, margin: 0 }}>Language Audit</h1>
      <p style={{ color: 'var(--theme-elevation-500)', fontSize: '13px', margin: '4px 0 16px' }}>
        Translation completeness across pages, news, and projects.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {(['pages', 'news', 'projects'] as const).map((c) => {
          const s = summary[c] ?? { total: 0, translated: 0 }
          const pct = s.total > 0 ? Math.round((s.translated / s.total) * 100) : 0
          return (
            <div
              key={c}
              style={{
                padding: '12px 16px',
                background: 'var(--theme-elevation-50)',
                borderRadius: '6px',
                border: '1px solid var(--theme-elevation-150)',
              }}
            >
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--theme-elevation-500)' }}>{c}</div>
              <div style={{ fontSize: '20px', fontWeight: 600, marginTop: '4px' }}>
                {s.translated} / {s.total}
              </div>
              <div style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>{pct}% translated</div>
            </div>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <label style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Collection:</label>
        <select
          value={collection}
          onChange={(e) => setCollection(e.target.value as 'all' | AuditItem['collection'])}
          style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '3px', border: '1px solid var(--theme-elevation-200)' }}
        >
          <option value="all">All</option>
          <option value="pages">Pages</option>
          <option value="news">News</option>
          <option value="projects">Projects</option>
        </select>
        <label style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>FR Status:</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as FrStatus)}
          style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '3px', border: '1px solid var(--theme-elevation-200)' }}
        >
          <option value="all">All</option>
          <option value="translated">Translated</option>
          <option value="partial">Partial</option>
          <option value="missing">Missing</option>
        </select>
        <label style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Review:</label>
        <select
          value={translationStatus}
          onChange={(e) => setTranslationStatus(e.target.value as ReviewFilter)}
          style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '3px', border: '1px solid var(--theme-elevation-200)' }}
        >
          <option value="all">All</option>
          <option value="untranslated">Untranslated</option>
          <option value="pending_review">Pending Review</option>
          <option value="changes_requested">Changes Requested</option>
          <option value="approved">Approved</option>
        </select>
        <label style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>Board ID:</label>
        <input
          value={board}
          onChange={(e) => setBoard(e.target.value)}
          placeholder="(any)"
          style={{ fontSize: '12px', padding: '4px 8px', borderRadius: '3px', border: '1px solid var(--theme-elevation-200)', width: '140px' }}
        />
      </div>

      {query.isLoading && <p style={{ fontSize: '13px' }}>Loading…</p>}
      {query.isError && (
        <p style={{ color: '#b91c1c', fontSize: '13px' }}>
          Failed: {(query.error as Error)?.message}
        </p>
      )}

      {!query.isLoading && items.length === 0 && (
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)' }}>No items match the current filters.</p>
      )}

      {items.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--theme-elevation-200)' }}>
              <th style={{ textAlign: 'left', padding: '8px' }}>Title (EN)</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>FR Status</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Review</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Collection</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Board</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Updated</th>
              <th style={{ textAlign: 'left', padding: '8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={`${item.collection}:${item.id}`}
                style={{ borderBottom: '1px solid var(--theme-elevation-100)' }}
              >
                <td style={{ padding: '8px' }}>{item.title}</td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: STATUS_COLORS[item.frStatus] + '22',
                      color: STATUS_COLORS[item.frStatus],
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                    }}
                  >
                    {item.frStatus}
                  </span>
                </td>
                <td style={{ padding: '8px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: REVIEW_COLORS[item.translationStatus] + '22',
                      color: REVIEW_COLORS[item.translationStatus],
                      fontSize: '11px',
                      fontWeight: 600,
                    }}
                  >
                    {REVIEW_LABELS[item.translationStatus]}
                  </span>
                </td>
                <td style={{ padding: '8px', color: 'var(--theme-elevation-600)' }}>{item.collection}</td>
                <td style={{ padding: '8px', color: 'var(--theme-elevation-600)' }}>
                  {item.board?.title ?? item.board?.slug ?? '—'}
                </td>
                <td style={{ padding: '8px', color: 'var(--theme-elevation-500)', fontSize: '12px' }}>
                  {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '—'}
                </td>
                <td style={{ padding: '8px' }}>
                  <a
                    href={`/admin/collections/${item.collection}/${item.id}?locale=fr`}
                    style={{ fontSize: '12px', color: '#601F5B' }}
                  >
                    Open in FR →
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default LanguageAuditViewClient
