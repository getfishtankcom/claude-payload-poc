/**
 * Version diff modal — compare two versions of a Payload doc side-by-side.
 *
 * Loads the version list from
 * `/api/{collection}/versions?where[parent][equals]={id}`, then on compare
 * loads each version's payload from `/api/{collection}/versions/{versionId}`
 * and walks the field map highlighting changes. (Payload's REST surface puts
 * `versions` at the collection root, not under the doc — issue #95.)
 */
'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { ModalOverlay, ModalButton } from './ui/Modal'

/**
 * Builds the Payload REST URL for listing versions of a single doc.
 * Exported so the unit test can lock in the contract.
 */
export function buildVersionsListUrl(
  collection: string,
  docId: string | number,
  limit = 20,
): string {
  const params = new URLSearchParams({
    'where[parent][equals]': String(docId),
    limit: String(limit),
    depth: '0',
    sort: '-updatedAt',
  })
  return `/api/${collection}/versions?${params.toString()}`
}

interface VersionMeta {
  id: string
  createdAt: string
  updatedAt: string
  version: Record<string, unknown>
}

interface VersionDiffModalProps {
  collection: string
  docId: string | number
  onClose: () => void
}

const SKIP_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  '_status',
  'meilisearch',
  'lockedBy',
  'lockedAt',
  'workflowHistory',
])

function flattenFields(
  obj: Record<string, unknown>,
  prefix = '',
): Array<{ path: string; value: unknown }> {
  const out: Array<{ path: string; value: unknown }> = []
  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_FIELDS.has(key)) continue
    const path = prefix ? `${prefix}.${key}` : key
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out.push(...flattenFields(value as Record<string, unknown>, path))
    } else {
      out.push({ path, value })
    }
  }
  return out
}

function valueLabel(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'string') return value.length > 200 ? value.slice(0, 200) + '…' : value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return `[${value.length} items]`
  if (typeof value === 'object') {
    const v = value as Record<string, unknown>
    if (typeof v.label === 'string') return v.label
    if (typeof v.title === 'string') return v.title
    if (typeof v.id === 'string' || typeof v.id === 'number') return `#${v.id}`
    return JSON.stringify(v).slice(0, 200)
  }
  return String(value)
}

export function VersionDiffModal({ collection, docId, onClose }: VersionDiffModalProps) {
  const [versions, setVersions] = useState<VersionMeta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aId, setAId] = useState<string | null>(null)
  const [bId, setBId] = useState<string | null>(null)

  useEffect(() => {
    const ac = new AbortController()
    ;(async () => {
      try {
        const res = await fetch(buildVersionsListUrl(collection, docId), {
          signal: ac.signal,
        })
        if (!res.ok) throw new Error(`Versions fetch failed: ${res.status}`)
        const data = (await res.json()) as { docs?: VersionMeta[] }
        const docs = data.docs ?? []
        setVersions(docs)
        if (docs.length >= 2) {
          setAId(docs[1].id)
          setBId(docs[0].id)
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'Failed to load versions')
        }
      } finally {
        setLoading(false)
      }
    })()
    return () => ac.abort()
  }, [collection, docId])

  const versionA = useMemo(() => versions.find((v) => v.id === aId), [versions, aId])
  const versionB = useMemo(() => versions.find((v) => v.id === bId), [versions, bId])

  const diffRows = useMemo(() => {
    if (!versionA || !versionB) return []
    const fieldsA = flattenFields(versionA.version || {})
    const fieldsB = flattenFields(versionB.version || {})
    const allPaths = new Set<string>([
      ...fieldsA.map((f) => f.path),
      ...fieldsB.map((f) => f.path),
    ])
    const aMap = new Map(fieldsA.map((f) => [f.path, f.value]))
    const bMap = new Map(fieldsB.map((f) => [f.path, f.value]))
    return Array.from(allPaths)
      .sort()
      .map((path) => {
        const a = aMap.get(path)
        const b = bMap.get(path)
        const changed = JSON.stringify(a) !== JSON.stringify(b)
        return { path, a, b, changed }
      })
  }, [versionA, versionB])

  return (
    <ModalOverlay onClose={onClose} ariaLabel="Compare versions">
      <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 12px' }}>Compare Versions</h2>
      {loading && <p style={{ fontSize: '13px' }}>Loading version history…</p>}
      {error && <p style={{ fontSize: '13px', color: '#b91c1c' }}>{error}</p>}

      {!loading && !error && versions.length < 2 && (
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)' }}>
          Not enough versions to compare yet.
        </p>
      )}

      {versions.length >= 2 && (
        <>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <label style={{ flex: 1, fontSize: '12px' }}>
              Version A (older):
              <select
                value={aId ?? ''}
                onChange={(e) => setAId(e.target.value)}
                style={{ width: '100%', marginTop: '4px', padding: '4px', fontSize: '12px' }}
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {new Date(v.updatedAt).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
            <label style={{ flex: 1, fontSize: '12px' }}>
              Version B (newer):
              <select
                value={bId ?? ''}
                onChange={(e) => setBId(e.target.value)}
                style={{ width: '100%', marginTop: '4px', padding: '4px', fontSize: '12px' }}
              >
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {new Date(v.updatedAt).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ maxHeight: '50vh', overflow: 'auto', border: '1px solid var(--theme-elevation-150)', borderRadius: '4px' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'var(--theme-elevation-50)' }}>
                <tr>
                  <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--theme-elevation-200)' }}>Field</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--theme-elevation-200)' }}>Version A</th>
                  <th style={{ textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid var(--theme-elevation-200)' }}>Version B</th>
                </tr>
              </thead>
              <tbody>
                {diffRows.map((row) => (
                  <tr
                    key={row.path}
                    style={{
                      background: row.changed ? '#fef3c7' : undefined,
                    }}
                  >
                    <td style={{ padding: '6px 8px', verticalAlign: 'top', color: 'var(--theme-elevation-700)', fontFamily: 'monospace' }}>
                      {row.path}
                    </td>
                    <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>{valueLabel(row.a)}</td>
                    <td style={{ padding: '6px 8px', verticalAlign: 'top' }}>{valueLabel(row.b)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px', alignItems: 'center' }}>
        {versionA && (
          <RestoreButton
            collection={collection}
            docId={docId}
            versionId={versionA.id}
            onRestored={onClose}
          />
        )}
        <ModalButton label="Close" variant="ghost" onClick={onClose} />
      </div>
    </ModalOverlay>
  )
}

function RestoreButton({
  collection,
  docId,
  versionId,
  onRestored,
}: {
  collection: string
  docId: string | number
  versionId: string
  onRestored: () => void
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const restore = async () => {
    if (!window.confirm('Restore this version? The current draft will be replaced.')) return
    setBusy(true)
    setError(null)
    try {
      // Payload restore endpoint: POST /api/{collection}/versions/{versionId}
      const res = await fetch(`/api/${collection}/versions/${versionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) {
        // Fall back: read the version, PATCH the doc with its data.
        const versionRes = await fetch(`/api/${collection}/versions/${versionId}?depth=0`)
        if (!versionRes.ok) throw new Error(`Restore failed (${res.status})`)
        const vData = (await versionRes.json()) as { version?: Record<string, unknown> }
        const restoredFields = vData.version ?? {}
        const patchRes = await fetch(`/api/${collection}/${docId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...restoredFields, workflowState: 'draft' }),
        })
        if (!patchRes.ok) throw new Error(`Restore PATCH failed (${patchRes.status})`)
      }
      onRestored()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Restore failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      {error && <span style={{ fontSize: '11px', color: '#b91c1c', marginRight: '8px' }}>{error}</span>}
      <ModalButton
        label={busy ? 'Restoring…' : 'Restore Version A'}
        variant="warning"
        disabled={busy}
        onClick={restore}
      />
    </>
  )
}
