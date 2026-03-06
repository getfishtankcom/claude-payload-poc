/**
 * @description
 * Reusable media picker modal for field/component media selection (Epic 24).
 * Opens the media library as a modal overlay with folder tree, grid, search,
 * filters, and upload capability. Returns selected media reference.
 *
 * Key features:
 * - Compact version of the full media library view
 * - Folder tree (left) + media grid (right) layout
 * - Search bar and type filter
 * - Upload button for adding new media on the fly
 * - "Select" button confirms choice and returns media reference
 * - Can be imported by page builder, field editor, or any component
 *
 * @dependencies
 * - /api/media-folders/tree: Folder hierarchy API
 * - /api/media: Payload media collection API
 *
 * @notes
 * - data-testid="media-picker-modal" on outer container
 * - Close via backdrop click, Escape key, or X button
 * - Selection returns the full media item object
 */
'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

interface FolderNode {
  id: string | number
  name: string
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  mediaCount: number
  children?: FolderNode[]
}

interface MediaItem {
  id: string | number
  filename: string
  alt: string
  title?: string
  mimeType: string
  filesize: number
  width?: number
  height?: number
  url: string
  folder?: string | number | { id: string | number } | null
  createdAt: string
  updatedAt: string
  sizes?: {
    thumbnail?: { url: string; width: number; height: number }
    card?: { url: string; width: number; height: number }
  }
}

export interface MediaPickerModalProps {
  /** Whether the modal is open */
  isOpen: boolean
  /** Called when user closes the modal */
  onClose: () => void
  /** Called with the selected media item when user confirms selection */
  onSelect: (item: MediaItem) => void
  /** Optional filter by mime type prefix (e.g., 'image/' to only show images) */
  mimeTypeFilter?: string
}

// --------------------------------------------------------------------------
// Compact Folder Tree Item
// --------------------------------------------------------------------------

function PickerFolderItem({
  node,
  selectedId,
  expandedIds,
  onSelect,
  onToggle,
  depth,
}: {
  node: FolderNode
  selectedId: string | number | null
  expandedIds: Set<string>
  onSelect: (id: string | number | null) => void
  onToggle: (id: string | number) => void
  depth: number
}) {
  const isExpanded = expandedIds.has(String(node.id))
  const isSelected = selectedId !== null && String(selectedId) === String(node.id)

  return (
    <div>
      <div
        onClick={() => onSelect(node.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '3px 6px',
          paddingLeft: `${depth * 14 + 6}px`,
          cursor: 'pointer',
          borderRadius: '3px',
          background: isSelected ? 'var(--theme-elevation-100)' : 'transparent',
          fontWeight: isSelected ? 600 : 400,
          fontSize: '12px',
          color: 'var(--theme-elevation-800)',
        }}
      >
        <span
          onClick={(e) => {
            e.stopPropagation()
            if (node.hasChildren) onToggle(node.id)
          }}
          style={{
            width: '12px',
            fontSize: '10px',
            color: 'var(--theme-elevation-400)',
            visibility: node.hasChildren ? 'visible' : 'hidden',
          }}
        >
          {isExpanded ? '▾' : '▸'}
        </span>
        <svg width={12} height={12} viewBox="0 0 20 20" fill="var(--theme-elevation-500)">
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>
      </div>
      {isExpanded && node.children?.map((child) => (
        <PickerFolderItem
          key={String(child.id)}
          node={child}
          selectedId={selectedId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggle={onToggle}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// File Type Icon (compact)
// --------------------------------------------------------------------------

function SmallFileIcon({ mimeType }: { mimeType: string }) {
  const color = 'var(--theme-elevation-400)'
  if (mimeType.startsWith('video/')) {
    return (
      <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M10 9l5 3-5 3V9z" fill={color} />
      </svg>
    )
  }
  return (
    <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
      <path d="M7 21h10a2 2 0 002-2V9l-5-5H7a2 2 0 00-2 2v13a2 2 0 002 2z" />
      <path d="M14 4v5h5" />
    </svg>
  )
}

// --------------------------------------------------------------------------
// MediaPickerModal Component
// --------------------------------------------------------------------------

export function MediaPickerModal({ isOpen, onClose, onSelect, mimeTypeFilter }: MediaPickerModalProps) {
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>(mimeTypeFilter ? '' : 'all')
  const [loading, setLoading] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Fetch folders
  useEffect(() => {
    if (!isOpen) return
    const fetchFolders = async () => {
      try {
        const res = await fetch('/api/media-folders/tree')
        if (res.ok) {
          const data = await res.json()
          setFolders(data.nodes || [])
        }
      } catch { /* ignore */ }
    }
    fetchFolders()
  }, [isOpen])

  // Fetch media
  useEffect(() => {
    if (!isOpen) return
    const fetchMedia = async () => {
      setLoading(true)
      try {
        const params = new URLSearchParams({ limit: '60', depth: '0', sort: '-createdAt' })

        if (selectedFolderId) {
          params.set('where[folder][equals]', String(selectedFolderId))
        }

        if (searchQuery.trim()) {
          params.set('where[or][0][filename][contains]', searchQuery.trim())
          params.set('where[or][1][alt][contains]', searchQuery.trim())
        }

        if (mimeTypeFilter) {
          params.set('where[mimeType][contains]', mimeTypeFilter)
        } else if (filterType !== 'all') {
          const prefix = filterType === 'document' ? 'application/' : `${filterType}/`
          params.set('where[mimeType][contains]', prefix)
        }

        const res = await fetch(`/api/media?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setMediaItems(data.docs || [])
        }
      } catch { /* ignore */ }
      finally { setLoading(false) }
    }
    fetchMedia()
  }, [isOpen, selectedFolderId, searchQuery, filterType, mimeTypeFilter, uploading])

  // Upload handler
  const handleUpload = useCallback(async (files: FileList) => {
    setUploading(true)
    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('alt', file.name.replace(/\.[^.]+$/, ''))
      if (selectedFolderId) formData.append('folder', String(selectedFolderId))
      try {
        await fetch('/api/media', { method: 'POST', body: formData })
      } catch { /* ignore */ }
    }
    setUploading(false)
  }, [selectedFolderId])

  // Toggle expand
  const toggleExpand = useCallback((id: string | number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      const key = String(id)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  // Confirm selection
  const handleConfirmSelect = useCallback(() => {
    if (selectedItem) {
      onSelect(selectedItem)
    }
  }, [selectedItem, onSelect])

  if (!isOpen) return null

  return (
    <div
      data-testid="media-picker-modal"
      style={{
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div style={{
        width: '900px',
        maxWidth: '95vw',
        height: '600px',
        maxHeight: '85vh',
        background: 'var(--theme-elevation-0)',
        borderRadius: '12px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--theme-elevation-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '14px', fontWeight: 600 }}>Select Media</span>
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

        {/* Body */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Folder tree */}
          <div style={{
            width: '200px',
            minWidth: '200px',
            borderRight: '1px solid var(--theme-elevation-100)',
            overflow: 'auto',
            padding: '8px 0',
          }}>
            <div
              onClick={() => setSelectedFolderId(null)}
              style={{
                padding: '3px 6px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: selectedFolderId === null ? 600 : 400,
                background: selectedFolderId === null ? 'var(--theme-elevation-100)' : 'transparent',
                borderRadius: '3px',
              }}
            >
              All Media
            </div>
            {folders.map((folder) => (
              <PickerFolderItem
                key={String(folder.id)}
                node={folder}
                selectedId={selectedFolderId}
                expandedIds={expandedIds}
                onSelect={(id) => setSelectedFolderId(id)}
                onToggle={toggleExpand}
                depth={0}
              />
            ))}
          </div>

          {/* Media grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Toolbar */}
            <div style={{
              padding: '8px 12px',
              borderBottom: '1px solid var(--theme-elevation-50)',
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
            }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1,
                  padding: '5px 8px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '4px',
                  fontSize: '12px',
                }}
              />
              {!mimeTypeFilter && (
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  style={{
                    padding: '5px 6px',
                    border: '1px solid var(--theme-elevation-200)',
                    borderRadius: '4px',
                    fontSize: '12px',
                  }}
                >
                  <option value="all">All</option>
                  <option value="image">Images</option>
                  <option value="document">Docs</option>
                  <option value="video">Video</option>
                </select>
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  padding: '5px 10px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '4px',
                  background: 'var(--theme-elevation-800)',
                  color: 'var(--theme-elevation-0)',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.svg,.gif,.pdf,.docx,.xlsx,.pptx,.mp4,.webm"
                multiple
                style={{ display: 'none' }}
                onChange={(e) => {
                  if (e.target.files) handleUpload(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>

            {/* Grid */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
              {loading ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
                  Loading...
                </div>
              ) : mediaItems.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--theme-elevation-400)' }}>
                  No media found
                </div>
              ) : (
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '8px',
                }}>
                  {mediaItems.map((item) => {
                    const isImage = item.mimeType?.startsWith('image/')
                    const thumbUrl = item.sizes?.thumbnail?.url || (isImage ? item.url : null)
                    const isItemSelected = selectedItem && String(selectedItem.id) === String(item.id)

                    return (
                      <div
                        key={String(item.id)}
                        onClick={() => setSelectedItem(item)}
                        style={{
                          border: `2px solid ${isItemSelected ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
                          borderRadius: '6px',
                          overflow: 'hidden',
                          cursor: 'pointer',
                          background: isItemSelected ? 'var(--theme-elevation-50)' : 'var(--theme-elevation-0)',
                        }}
                      >
                        <div style={{
                          width: '100%',
                          height: '80px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--theme-elevation-50)',
                        }}>
                          {thumbUrl ? (
                            <img
                              src={thumbUrl}
                              alt={item.alt || item.filename}
                              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                              loading="lazy"
                            />
                          ) : (
                            <SmallFileIcon mimeType={item.mimeType || ''} />
                          )}
                        </div>
                        <div style={{
                          padding: '4px 6px',
                          fontSize: '11px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          color: 'var(--theme-elevation-700)',
                        }}>
                          {item.filename}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--theme-elevation-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
            {selectedItem ? `Selected: ${selectedItem.filename}` : 'No item selected'}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={onClose}
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
              onClick={handleConfirmSelect}
              disabled={!selectedItem}
              style={{
                padding: '6px 16px',
                border: 'none',
                borderRadius: '6px',
                background: selectedItem ? 'var(--theme-elevation-800)' : 'var(--theme-elevation-300)',
                color: 'var(--theme-elevation-0)',
                cursor: selectedItem ? 'pointer' : 'not-allowed',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
