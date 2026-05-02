/**
 * Redirects bulk-import button.
 *
 * Sits in the redirects collection list view (admin.components.beforeListTable).
 * Lets editors drop in a CSV (`from,to,type` or `from,to`) and bulk-creates
 * the rows. Skips rows whose `from` already exists.
 */
'use client'

import React, { useRef, useState } from 'react'

interface ParsedRow {
  from: string
  to: string
  type: '301' | '302'
}

function parseCsv(text: string): ParsedRow[] {
  const rows: ParsedRow[] = []
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0)
  // Skip the header row if it looks like one.
  let start = 0
  if (lines[0] && /from\s*,\s*to/i.test(lines[0])) start = 1
  for (let i = start; i < lines.length; i++) {
    const cols = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
    if (cols.length < 2) continue
    const [from, to, type] = cols
    if (!from || !to) continue
    rows.push({
      from,
      to,
      type: type === '302' ? '302' : '301',
    })
  }
  return rows
}

export function RedirectsImportButton() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const onFile = async (file: File) => {
    setBusy(true)
    setStatus(null)
    try {
      const text = await file.text()
      const rows = parseCsv(text)
      if (rows.length === 0) {
        setStatus('No valid rows found in CSV.')
        return
      }

      let created = 0
      let skipped = 0
      let failed = 0

      for (const row of rows) {
        // Skip duplicates: query existing.
        const existing = await fetch(
          `/api/redirects?where[from][equals]=${encodeURIComponent(row.from)}&limit=1&depth=0`,
        )
        if (existing.ok) {
          const data = (await existing.json()) as { totalDocs?: number }
          if ((data.totalDocs ?? 0) > 0) {
            skipped++
            continue
          }
        }

        const res = await fetch('/api/redirects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...row, active: true }),
        })
        if (res.ok) created++
        else failed++
      }

      setStatus(`Imported ${created} · skipped ${skipped} duplicate · ${failed} failed.`)
      if (created > 0) {
        // Reload after a short delay so editors see the new rows in the list.
        setTimeout(() => window.location.reload(), 1500)
      }
    } catch (err) {
      setStatus(`Import failed: ${(err as Error).message ?? 'unknown error'}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 0 12px' }}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        style={{
          padding: '4px 10px',
          fontSize: '12px',
          fontWeight: 500,
          borderRadius: '4px',
          border: '1px solid var(--theme-elevation-200)',
          background: busy ? 'var(--theme-elevation-100)' : 'var(--theme-elevation-0)',
          color: 'var(--theme-elevation-700)',
          cursor: busy ? 'wait' : 'pointer',
        }}
      >
        {busy ? 'Importing…' : 'Import CSV'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".csv,text/csv"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFile(file)
          e.target.value = ''
        }}
      />
      {status && (
        <span style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>{status}</span>
      )}
      <span style={{ fontSize: '11px', color: 'var(--theme-elevation-400)' }}>
        Format: <code>from,to,type</code> (header row optional)
      </span>
    </div>
  )
}

export default RedirectsImportButton
