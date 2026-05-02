/**
 * @description
 * Slide-out detail drawer for media items in the admin media library (Epic 24).
 * Shows full preview, editable metadata (alt, title, description — localized EN/FR),
 * read-only metadata, usage list, and save/delete actions.
 *
 * Key features:
 * - Full image preview or file type icon for non-images
 * - EN/FR language switcher for localized fields (alt, title, description)
 * - Usage list: which pages/components reference this media item
 * - Save button persists metadata edits via Payload API
 * - Delete button with usage-aware confirmation dialog
 *
 * @dependencies
 * - Payload REST API (/api/media/:id)
 *
 * @notes
 * - Used inside MediaLibraryClient as a slide-out drawer from the right
 * - data-testid="media-detail-panel" on outer container
 * - Locale metadata stored on the same Payload media document (field-level localization)
 */
'use client'

import React, { useCallback, useEffect, useState } from 'react'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface MediaItem {
  id: string | number
  filename: string
  alt: string
  title?: string
  description?: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  folder?: string | number | { id: string | number } | null
  createdAt: string
  updatedAt: string
  createdBy?: { id: string; email?: string; firstName?: string; lastName?: string } | null
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
  }
}

interface UsageItem {
  id: string | number
  title: string
  slug: string
  collection: string
}

interface MediaDetailPanelProps {
  item: MediaItem
  onClose: () => void
  onSave: () => void
  onDelete: () => void
}

type Locale = 'en' | 'fr'

// --------------------------------------------------------------------------
// File Type Helpers
// --------------------------------------------------------------------------

function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const size = 64
  const color = 'var(--theme-elevation-400)'
  const category = mimeType.startsWith('video/') ? 'video'
    : mimeType.startsWith('audio/') ? 'audio'
    : (mimeType === 'application/pdf' || mimeType.includes('officedocument')) ? 'document'
    : 'other'

  switch (category) {
    case 'document':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
          <path d="M14 4v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      )
    case 'video':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M10 9l5 3-5 3V9z" fill={color} />
        </svg>
      )
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
          <path d="M14 4v5h5" />
        </svg>
      )
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// --------------------------------------------------------------------------
// MediaDetailPanel Component
// --------------------------------------------------------------------------

export function MediaDetailPanel({ item, onClose, onSave, onDelete }: MediaDetailPanelProps) {
  const [locale, setLocale] = useState<Locale>('en')
  const [altText, setAltText] = useState<Record<Locale, string>>({ en: '', fr: '' })
  const [titleText, setTitleText] = useState<Record<Locale, string>>({ en: '', fr: '' })
  const [descText, setDescText] = useState<Record<Locale, string>>({ en: '', fr: '' })
  const [usageList, setUsageList] = useState<UsageItem[]>([])
  const [usageLoading, setUsageLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isImage = item.mimeType?.startsWith('image/')
  const previewUrl = item.sizes?.card?.url || (isImage ? item.url : null)

  // ----- Load item data for both locales -----
  useEffect(() => {
    const loadLocaleData = async () => {
      // Fetch EN data
      try {
        const enRes = await fetch(`/api/media/${item.id}?locale=en&depth=0`)
        if (enRes.ok) {
          const enData = await enRes.json()
          setAltText((prev) => ({ ...prev, en: enData.alt || '' }))
          setTitleText((prev) => ({ ...prev, en: enData.title || '' }))
          setDescText((prev) => ({ ...prev, en: enData.description || '' }))
        }
      } catch { /* use defaults */ }

      // Fetch FR data
      try {
        const frRes = await fetch(`/api/media/${item.id}?locale=fr&depth=0`)
        if (frRes.ok) {
          const frData = await frRes.json()
          setAltText((prev) => ({ ...prev, fr: frData.alt || '' }))
          setTitleText((prev) => ({ ...prev, fr: frData.title || '' }))
          setDescText((prev) => ({ ...prev, fr: frData.description || '' }))
        }
      } catch { /* use defaults */ }
    }

    loadLocaleData()
  }, [item.id])

  // ----- Load usage list -----
  useEffect(() => {
    const loadUsage = async () => {
      setUsageLoading(true)
      try {
        // Query pages that reference this media item (via og_image or hero)
        const res = await fetch(`/api/pages?where[or][0][meta.og_image][equals]=${item.id}&where[or][1][hero.media][equals]=${item.id}&limit=20&depth=0`)
        if (res.ok) {
          const data = await res.json()
          setUsageList(
            (data.docs || []).map((doc: { id: string | number; title: string; slug: string }) => ({
              id: doc.id,
              title: doc.title || 'Untitled',
              slug: doc.slug || '',
              collection: 'pages',
            })),
          )
        }
      } catch {
        // Usage list is best-effort
      } finally {
        setUsageLoading(false)
      }
    }

    loadUsage()
  }, [item.id])

  // ----- Save metadata -----
  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      // Save EN locale
      await fetch(`/api/media/${item.id}?locale=en`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: altText.en,
          title: titleText.en,
          description: descText.en,
        }),
      })

      // Save FR locale
      await fetch(`/api/media/${item.id}?locale=fr`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: altText.fr,
          title: titleText.fr,
          description: descText.fr,
        }),
      })

      onSave()
    } catch (err) {
      console.error('Failed to save media metadata:', err)
    } finally {
      setSaving(false)
    }
  }, [item.id, altText, titleText, descText, onSave])

  // ----- Delete media -----
  const handleDelete = useCallback(async () => {
    setDeleting(true)
    try {
      await fetch(`/api/media/${item.id}`, { method: 'DELETE' })
      onDelete()
    } catch (err) {
      console.error('Failed to delete media:', err)
    } finally {
      setDeleting(false)
      setShowDeleteConfirm(false)
    }
  }, [item.id, onDelete])

  return (
    <div
      data-testid="media-detail-panel"
      style={{
        width: '380px',
        minWidth: '380px',
        borderLeft: '1px solid var(--theme-elevation-150)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'var(--theme-elevation-0)',
      }}
    >
      {/* Header */}
      <div style={{
        padding: '12px 16px',
        borderBottom: '1px solid var(--theme-elevation-100)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--theme-elevation-800)' }}>
          Media Details
        </span>
        <button
          onClick={onClose}
          style={{
            border: 'none',
            background: 'none',
            cursor: 'pointer',
            fontSize: '18px',
            color: 'var(--theme-elevation-400)',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Preview */}
        <div style={{
          width: '100%',
          height: '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--theme-elevation-50)',
          borderRadius: '8px',
          marginBottom: '16px',
          overflow: 'hidden',
        }}>
          {previewUrl ? (
            <img
              src={previewUrl}
              alt={item.alt || item.filename}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          ) : (
            <FileTypeIcon mimeType={item.mimeType || 'application/octet-stream'} />
          )}
        </div>

        {/* Read-only metadata */}
        <div style={{ marginBottom: '16px' }}>
          <MetadataRow label="Filename" value={item.filename} />
          <MetadataRow label="Type" value={item.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'} />
          {item.width && item.height && (
            <MetadataRow label="Dimensions" value={`${item.width} × ${item.height} px`} />
          )}
          <MetadataRow label="File Size" value={formatFileSize(item.filesize || 0)} />
          <MetadataRow
            label="Uploaded By"
            value={item.createdBy?.firstName || item.createdBy?.email || 'Unknown'}
          />
          <MetadataRow
            label="Upload Date"
            value={item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown'}
          />
        </div>

        {/* Language switcher */}
        <div style={{
          display: 'flex',
          gap: '4px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--theme-elevation-100)',
          paddingBottom: '8px',
        }}>
          {(['en', 'fr'] as Locale[]).map((loc) => (
            <button
              key={loc}
              onClick={() => setLocale(loc)}
              style={{
                padding: '4px 12px',
                border: 'none',
                borderBottom: locale === loc ? '2px solid var(--theme-elevation-800)' : '2px solid transparent',
                background: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: locale === loc ? 600 : 400,
                color: locale === loc ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-500)',
                textTransform: 'uppercase',
              }}
            >
              {loc}
            </button>
          ))}
        </div>

        {/* Editable fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
          <EditableField
            label="Alt Text"
            value={altText[locale]}
            onChange={(v) => setAltText((prev) => ({ ...prev, [locale]: v }))}
            required
          />
          <EditableField
            label="Title"
            value={titleText[locale]}
            onChange={(v) => setTitleText((prev) => ({ ...prev, [locale]: v }))}
          />
          <EditableField
            label="Description"
            value={descText[locale]}
            onChange={(v) => setDescText((prev) => ({ ...prev, [locale]: v }))}
            multiline
          />
        </div>

        {/* Usage list */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--theme-elevation-600)',
            marginBottom: '8px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            Used By
          </div>
          {usageLoading ? (
            <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)' }}>Loading...</div>
          ) : usageList.length === 0 ? (
            <div style={{ fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
              Not used by any pages
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {usageList.map((usage) => (
                <a
                  key={String(usage.id)}
                  href={`/admin/collections/${usage.collection}/${usage.id}`}
                  style={{
                    fontSize: '12px',
                    color: 'var(--theme-elevation-600)',
                    textDecoration: 'none',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    background: 'var(--theme-elevation-50)',
                  }}
                >
                  {usage.title}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--theme-elevation-100)',
        display: 'flex',
        gap: '8px',
      }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{
            flex: 1,
            padding: '8px',
            border: 'none',
            borderRadius: '6px',
            background: 'var(--theme-elevation-800)',
            color: 'var(--theme-elevation-0)',
            cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saving ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          style={{
            padding: '8px 12px',
            border: '1px solid var(--theme-error-500)',
            borderRadius: '6px',
            background: 'transparent',
            color: 'var(--theme-error-500)',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          Delete
        </button>
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
        }}>
          <div style={{
            background: 'var(--theme-elevation-0)',
            borderRadius: '8px',
            padding: '24px',
            maxWidth: '400px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}>
            <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              Delete Media
            </div>
            <div style={{ fontSize: '13px', color: 'var(--theme-elevation-600)', marginBottom: '16px' }}>
              {usageList.length > 0
                ? `This media is used by ${usageList.length} page${usageList.length > 1 ? 's' : ''}. Delete anyway?`
                : `Are you sure you want to delete "${item.filename}"?`}
            </div>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  padding: '6px 16px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '6px',
                  background: 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '6px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  background: 'var(--theme-error-500)',
                  color: '#fff',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  opacity: deleting ? 0.6 : 1,
                }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// Helper Sub-Components
// --------------------------------------------------------------------------

/** Read-only metadata row */
function MetadataRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '4px 0',
      borderBottom: '1px solid var(--theme-elevation-50)',
    }}>
      <span style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>{label}</span>
      <span style={{ fontSize: '12px', color: 'var(--theme-elevation-800)', fontWeight: 500 }}>{value}</span>
    </div>
  )
}

/** Editable field with label */
function EditableField({
  label,
  value,
  onChange,
  required,
  multiline,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  multiline?: boolean
}) {
  return (
    <div>
      <label style={{
        fontSize: '12px',
        fontWeight: 500,
        color: 'var(--theme-elevation-600)',
        display: 'block',
        marginBottom: '4px',
      }}>
        {label} {required && <span style={{ color: 'var(--theme-error-500)' }}>*</span>}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '4px',
            fontSize: '13px',
            background: 'var(--theme-elevation-0)',
            color: 'var(--theme-elevation-800)',
            resize: 'vertical',
            fontFamily: 'inherit',
          }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            width: '100%',
            padding: '6px 8px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '4px',
            fontSize: '13px',
            background: 'var(--theme-elevation-0)',
            color: 'var(--theme-elevation-800)',
          }}
        />
      )}
    </div>
  )
}
