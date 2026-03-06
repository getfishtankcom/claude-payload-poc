/**
 * @description
 * Client-side Media Library view for FRAS Canada CMS admin (Epic 24).
 * Folder-based media browser with Sitecore-style folder tree + thumbnail grid.
 *
 * Key features:
 * - Left panel: folder tree hierarchy with expand/collapse
 * - Right panel: media grid showing items in selected folder
 * - Breadcrumb navigation showing current folder path
 * - Click folder in tree to filter media grid
 * - Grid/list view toggle with localStorage persistence (24.3)
 * - Upload via button and drag-and-drop (24.4)
 * - Search and filters (24.5)
 * - Media detail panel (24.6)
 * - Bulk operations (24.8)
 * - Folder management context menu (24.9)
 *
 * @dependencies
 * - /api/media-folders/tree: Folder hierarchy API
 * - /api/media: Payload media collection API
 *
 * @notes
 * - Registered via MediaLibrary.tsx server wrapper at /admin/media
 * - data-testid="page-media-library" on container
 * - data-testid="sidebar-nav" on folder tree panel
 * - data-testid="main-content" on media grid panel
 */
'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from 'react'

// --------------------------------------------------------------------------
// Types
// --------------------------------------------------------------------------

/** Folder node shape from /api/media-folders/tree */
interface FolderNode {
  id: string | number
  name: string
  hasChildren: boolean
  sortOrder: number
  parent: string | number | null
  mediaCount: number
  children?: FolderNode[]
}

/** Media item shape from Payload's /api/media endpoint */
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

/** View mode for the media grid */
type ViewMode = 'grid' | 'list'

/** Upload progress tracking for individual files */
interface UploadProgress {
  id: string
  filename: string
  progress: number // 0-100
  status: 'uploading' | 'complete' | 'error'
  error?: string
}

/** Accepted MIME types for upload validation */
const ACCEPTED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'video/mp4', 'video/webm',
]

/** File extensions for the file input accept attribute */
const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png,.webp,.svg,.gif,.pdf,.docx,.xlsx,.pptx,.mp4,.webm'

// --------------------------------------------------------------------------
// Constants
// --------------------------------------------------------------------------

const STORAGE_KEY_EXPANDED = 'fras-media-folders-expanded'
const STORAGE_KEY_VIEW = 'fras-media-view-mode'

// --------------------------------------------------------------------------
// Folder Tree Icons
// --------------------------------------------------------------------------

/** Folder icon (open or closed) */
function FolderIcon({ open }: { open?: boolean }) {
  const color = 'var(--theme-elevation-500)'
  if (open) {
    return (
      <svg width={16} height={16} viewBox="0 0 20 20" fill={color}>
        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v1H8l-4 8H4a2 2 0 01-2-2V6z" />
        <path d="M6 12a2 2 0 012-2h10l-4 8H4l2-6z" fillOpacity={0.7} />
      </svg>
    )
  }
  return (
    <svg width={16} height={16} viewBox="0 0 20 20" fill={color}>
      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
    </svg>
  )
}

/** Chevron icon for expand/collapse */
function ChevronIcon({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width={12}
      height={12}
      viewBox="0 0 20 20"
      fill="var(--theme-elevation-400)"
      style={{
        transition: 'transform 150ms ease',
        transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
      }}
    >
      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
    </svg>
  )
}

// --------------------------------------------------------------------------
// File Type Helpers
// --------------------------------------------------------------------------

/** Get a human-friendly file type category from mimeType */
function getFileCategory(mimeType: string): 'image' | 'document' | 'video' | 'audio' | 'other' {
  if (mimeType.startsWith('image/')) return 'image'
  if (mimeType.startsWith('video/')) return 'video'
  if (mimeType.startsWith('audio/')) return 'audio'
  if (
    mimeType === 'application/pdf' ||
    mimeType.includes('wordprocessingml') ||
    mimeType.includes('spreadsheetml') ||
    mimeType.includes('presentationml')
  ) return 'document'
  return 'other'
}

/** File type icon for non-image files */
function FileTypeIcon({ mimeType }: { mimeType: string }) {
  const category = getFileCategory(mimeType)
  const size = 48
  const color = 'var(--theme-elevation-400)'

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
    case 'audio':
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5}>
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
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

/** Format file size to human-readable string */
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// --------------------------------------------------------------------------
// FolderTreeItem Component
// --------------------------------------------------------------------------

interface FolderTreeItemProps {
  node: FolderNode
  selectedFolderId: string | number | null
  expandedIds: Set<string>
  onSelect: (folderId: string | number | null) => void
  onToggleExpand: (folderId: string | number) => void
  depth: number
}

function FolderTreeItem({
  node,
  selectedFolderId,
  expandedIds,
  onSelect,
  onToggleExpand,
  depth,
}: FolderTreeItemProps) {
  const isExpanded = expandedIds.has(String(node.id))
  const isSelected = selectedFolderId !== null && String(selectedFolderId) === String(node.id)

  return (
    <div>
      <div
        data-testid={`folder-tree-item-${node.id}`}
        onClick={() => onSelect(node.id)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          paddingLeft: `${depth * 16 + 8}px`,
          cursor: 'pointer',
          borderRadius: '4px',
          background: isSelected ? 'var(--theme-elevation-100)' : 'transparent',
          fontWeight: isSelected ? 600 : 400,
          fontSize: '13px',
          color: 'var(--theme-elevation-800)',
          transition: 'background 100ms ease',
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = 'var(--theme-elevation-50)'
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = 'transparent'
        }}
      >
        {/* Expand/collapse toggle */}
        <span
          onClick={(e) => {
            e.stopPropagation()
            if (node.hasChildren) onToggleExpand(node.id)
          }}
          style={{
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            visibility: node.hasChildren ? 'visible' : 'hidden',
          }}
        >
          <ChevronIcon expanded={isExpanded} />
        </span>

        {/* Folder icon */}
        <FolderIcon open={isExpanded} />

        {/* Folder name */}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {node.name}
        </span>

        {/* Media count badge */}
        {node.mediaCount > 0 && (
          <span style={{
            fontSize: '11px',
            color: 'var(--theme-elevation-400)',
            flexShrink: 0,
          }}>
            {node.mediaCount}
          </span>
        )}
      </div>

      {/* Children */}
      {isExpanded && node.children && node.children.map((child) => (
        <FolderTreeItem
          key={String(child.id)}
          node={child}
          selectedFolderId={selectedFolderId}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// MediaGridItem Component (thumbnail card)
// --------------------------------------------------------------------------

interface MediaGridItemProps {
  item: MediaItem
  onClick: (item: MediaItem) => void
  isSelected?: boolean
  onSelect?: (id: string | number, checked: boolean) => void
}

function MediaGridItem({ item, onClick, isSelected, onSelect }: MediaGridItemProps) {
  const isImage = item.mimeType?.startsWith('image/')
  const thumbnailUrl = item.sizes?.thumbnail?.url || (isImage ? item.url : null)

  return (
    <div
      data-testid={`media-item-${item.id}`}
      onClick={() => onClick(item)}
      style={{
        border: `2px solid ${isSelected ? 'var(--theme-success-500)' : 'var(--theme-elevation-150)'}`,
        borderRadius: '8px',
        overflow: 'hidden',
        cursor: 'pointer',
        background: 'var(--theme-elevation-0)',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--theme-elevation-300)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={(e) => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--theme-elevation-150)'
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      {/* Thumbnail area */}
      <div style={{
        width: '100%',
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--theme-elevation-50)',
        position: 'relative',
      }}>
        {/* Checkbox for bulk select (24.8) */}
        {onSelect && (
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              e.stopPropagation()
              onSelect(item.id, e.target.checked)
            }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '16px',
              height: '16px',
              cursor: 'pointer',
              zIndex: 1,
            }}
          />
        )}

        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.alt || item.filename}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            loading="lazy"
          />
        ) : (
          <FileTypeIcon mimeType={item.mimeType || 'application/octet-stream'} />
        )}
      </div>

      {/* Info area */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--theme-elevation-100)' }}>
        <div style={{
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--theme-elevation-800)',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {item.filename}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400)', marginTop: '2px' }}>
          {formatFileSize(item.filesize || 0)}
        </div>
      </div>
    </div>
  )
}

// --------------------------------------------------------------------------
// MediaListItem Component (table row)
// --------------------------------------------------------------------------

function MediaListItem({ item, onClick, isSelected, onSelect }: MediaGridItemProps) {
  const isImage = item.mimeType?.startsWith('image/')
  const thumbnailUrl = item.sizes?.thumbnail?.url || (isImage ? item.url : null)

  return (
    <tr
      data-testid={`media-item-${item.id}`}
      onClick={() => onClick(item)}
      style={{
        cursor: 'pointer',
        background: isSelected ? 'var(--theme-elevation-50)' : 'transparent',
        borderBottom: '1px solid var(--theme-elevation-100)',
      }}
    >
      {/* Checkbox */}
      {onSelect && (
        <td style={{ padding: '8px', width: '32px' }}>
          <input
            type="checkbox"
            checked={isSelected || false}
            onChange={(e) => {
              e.stopPropagation()
              onSelect(item.id, e.target.checked)
            }}
            onClick={(e) => e.stopPropagation()}
          />
        </td>
      )}
      {/* Thumbnail */}
      <td style={{ padding: '8px', width: '48px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--theme-elevation-50)',
          borderRadius: '4px',
          overflow: 'hidden',
        }}>
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={item.alt || item.filename}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }}
              loading="lazy"
            />
          ) : (
            <FileTypeIcon mimeType={item.mimeType || 'application/octet-stream'} />
          )}
        </div>
      </td>
      <td style={{ padding: '8px', fontSize: '13px', fontWeight: 500 }}>{item.filename}</td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {item.mimeType?.split('/')[1]?.toUpperCase() || 'Unknown'}
      </td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {formatFileSize(item.filesize || 0)}
      </td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {item.width && item.height ? `${item.width}×${item.height}` : '—'}
      </td>
      <td style={{ padding: '8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—'}
      </td>
    </tr>
  )
}

// --------------------------------------------------------------------------
// Breadcrumb Component
// --------------------------------------------------------------------------

interface BreadcrumbProps {
  folders: FolderNode[]
  selectedFolderId: string | number | null
  onNavigate: (folderId: string | number | null) => void
}

function Breadcrumb({ folders, selectedFolderId, onNavigate }: BreadcrumbProps) {
  // Build path from root to selected folder
  const path = useMemo(() => {
    if (!selectedFolderId) return []
    const result: FolderNode[] = []
    const findPath = (nodes: FolderNode[], targetId: string | number): boolean => {
      for (const node of nodes) {
        if (String(node.id) === String(targetId)) {
          result.push(node)
          return true
        }
        if (node.children) {
          if (findPath(node.children, targetId)) {
            result.unshift(node)
            return true
          }
        }
      }
      return false
    }
    findPath(folders, selectedFolderId)
    return result
  }, [folders, selectedFolderId])

  return (
    <div data-testid="breadcrumb" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '4px',
      fontSize: '13px',
      color: 'var(--theme-elevation-500)',
      padding: '0 0 8px',
    }}>
      <span
        onClick={() => onNavigate(null)}
        style={{
          cursor: 'pointer',
          color: selectedFolderId ? 'var(--theme-elevation-600)' : 'var(--theme-elevation-800)',
          fontWeight: selectedFolderId ? 400 : 600,
        }}
      >
        Media Library
      </span>
      {path.map((folder) => (
        <React.Fragment key={String(folder.id)}>
          <span style={{ color: 'var(--theme-elevation-300)' }}>/</span>
          <span
            onClick={() => onNavigate(folder.id)}
            style={{
              cursor: 'pointer',
              color: String(folder.id) === String(selectedFolderId)
                ? 'var(--theme-elevation-800)'
                : 'var(--theme-elevation-600)',
              fontWeight: String(folder.id) === String(selectedFolderId) ? 600 : 400,
            }}
          >
            {folder.name}
          </span>
        </React.Fragment>
      ))}
    </div>
  )
}

// --------------------------------------------------------------------------
// Main MediaLibraryClient Component
// --------------------------------------------------------------------------

export function MediaLibraryClient() {
  // ----- State -----
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPANDED)
      return saved ? new Set(JSON.parse(saved)) : new Set()
    } catch {
      return new Set()
    }
  })
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'grid'
    try {
      return (localStorage.getItem(STORAGE_KEY_VIEW) as ViewMode) || 'grid'
    } catch {
      return 'grid'
    }
  })
  const [loading, setLoading] = useState(true)
  const [mediaLoading, setMediaLoading] = useState(false)
  const [totalMedia, setTotalMedia] = useState(0)
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null)
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ----- Persist expanded state -----
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify([...expandedIds]))
    } catch { /* ignore */ }
  }, [expandedIds])

  // ----- Persist view mode -----
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIEW, viewMode)
    } catch { /* ignore */ }
  }, [viewMode])

  // ----- Fetch folders -----
  const fetchFolders = useCallback(async () => {
    try {
      const res = await fetch('/api/media-folders/tree')
      if (res.ok) {
        const data = await res.json()
        setFolders(data.nodes || [])
      }
    } catch (err) {
      console.error('Failed to fetch media folders:', err)
    }
  }, [])

  // ----- Fetch media items -----
  const fetchMedia = useCallback(async () => {
    setMediaLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100', depth: '1', sort: '-createdAt' })

      // Folder filter
      if (selectedFolderId) {
        params.set('where[folder][equals]', String(selectedFolderId))
      }

      // Search filter
      if (searchQuery.trim()) {
        params.set('where[or][0][filename][contains]', searchQuery.trim())
        params.set('where[or][1][alt][contains]', searchQuery.trim())
        params.set('where[or][2][title][contains]', searchQuery.trim())
      }

      // Type filter
      if (filterType !== 'all') {
        const mimePrefix = filterType === 'document' ? 'application/' : `${filterType}/`
        params.set('where[mimeType][contains]', mimePrefix)
      }

      const res = await fetch(`/api/media?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setMediaItems(data.docs || [])
        setTotalMedia(data.totalDocs || 0)
      }
    } catch (err) {
      console.error('Failed to fetch media:', err)
    } finally {
      setMediaLoading(false)
    }
  }, [selectedFolderId, searchQuery, filterType])

  // ----- Initial load -----
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchFolders()
      setLoading(false)
    }
    init()
  }, [fetchFolders])

  // ----- Fetch media on folder/search/filter change -----
  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // ----- Toggle folder expand/collapse -----
  const handleToggleExpand = useCallback((folderId: string | number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      const key = String(folderId)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }, [])

  // ----- Select folder (also auto-expand) -----
  const handleSelectFolder = useCallback((folderId: string | number | null) => {
    setSelectedFolderId(folderId)
    setSelectedItems(new Set())
    if (folderId) {
      setExpandedIds((prev) => {
        const next = new Set(prev)
        next.add(String(folderId))
        return next
      })
    }
  }, [])

  // ----- Toggle view mode -----
  const handleToggleView = useCallback(() => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))
  }, [])

  // ----- Media item click (open detail) -----
  const handleMediaClick = useCallback((item: MediaItem) => {
    setDetailItem(item)
  }, [])

  // ----- Bulk select toggle -----
  const handleItemSelect = useCallback((id: string | number, checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  // ----- Upload a single file via XMLHttpRequest (for progress tracking) -----
  const uploadFile = useCallback(async (file: File) => {
    const uploadId = `upload-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

    // Validate mime type
    if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
      setUploads((prev) => [...prev, {
        id: uploadId,
        filename: file.name,
        progress: 0,
        status: 'error',
        error: `Unsupported file type: ${file.type}`,
      }])
      return
    }

    // Add to upload list
    setUploads((prev) => [...prev, {
      id: uploadId,
      filename: file.name,
      progress: 0,
      status: 'uploading',
    }])

    return new Promise<void>((resolve) => {
      const xhr = new XMLHttpRequest()
      const formData = new FormData()

      formData.append('file', file)
      formData.append('alt', file.name.replace(/\.[^.]+$/, ''))
      if (selectedFolderId) {
        formData.append('folder', String(selectedFolderId))
      }

      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const pct = Math.round((e.loaded / e.total) * 100)
          setUploads((prev) =>
            prev.map((u) => u.id === uploadId ? { ...u, progress: pct } : u),
          )
        }
      })

      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploads((prev) =>
            prev.map((u) => u.id === uploadId ? { ...u, progress: 100, status: 'complete' } : u),
          )
          // Auto-clear completed uploads after 3 seconds
          setTimeout(() => {
            setUploads((prev) => prev.filter((u) => u.id !== uploadId))
          }, 3000)
        } else {
          setUploads((prev) =>
            prev.map((u) => u.id === uploadId ? { ...u, status: 'error', error: `Upload failed (${xhr.status})` } : u),
          )
        }
        resolve()
      })

      xhr.addEventListener('error', () => {
        setUploads((prev) =>
          prev.map((u) => u.id === uploadId ? { ...u, status: 'error', error: 'Network error' } : u),
        )
        resolve()
      })

      xhr.open('POST', '/api/media')
      xhr.send(formData)
    })
  }, [selectedFolderId])

  // ----- Upload multiple files -----
  const uploadFiles = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files)
    // Upload all files concurrently
    await Promise.all(fileArray.map((file) => uploadFile(file)))
    // Refresh media list and folder counts
    await Promise.all([fetchMedia(), fetchFolders()])
  }, [uploadFile, fetchMedia, fetchFolders])

  // ----- Handle file input change -----
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
      // Reset input so same file can be re-uploaded
      e.target.value = ''
    }
  }, [uploadFiles])

  // ----- Drag-and-drop handlers -----
  const handleDragOver = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    // Only set false if leaving the container (not entering a child)
    if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false)
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }, [uploadFiles])

  // ----- Loading state -----
  if (loading) {
    return (
      <div data-testid="page-media-library" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        color: 'var(--theme-elevation-500)',
        fontSize: '14px',
      }}>
        Loading media library...
      </div>
    )
  }

  // ----- Render -----
  return (
    <div
      data-testid="page-media-library"
      style={{
        display: 'flex',
        height: '100%',
        overflow: 'hidden',
        background: 'var(--theme-elevation-0)',
      }}
    >
      {/* ==================== LEFT PANEL: Folder Tree ==================== */}
      <div
        data-testid="sidebar-nav"
        style={{
          width: '260px',
          minWidth: '260px',
          borderRight: '1px solid var(--theme-elevation-150)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Folder panel header */}
        <div style={{
          padding: '12px 12px 8px',
          borderBottom: '1px solid var(--theme-elevation-100)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--theme-elevation-700)' }}>
            Folders
          </span>
        </div>

        {/* Folder tree */}
        <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
          {/* "All Media" root option */}
          <div
            data-testid="folder-tree-item-root"
            onClick={() => handleSelectFolder(null)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              paddingLeft: '8px',
              cursor: 'pointer',
              borderRadius: '4px',
              background: selectedFolderId === null ? 'var(--theme-elevation-100)' : 'transparent',
              fontWeight: selectedFolderId === null ? 600 : 400,
              fontSize: '13px',
              color: 'var(--theme-elevation-800)',
            }}
          >
            <span style={{ width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width={14} height={14} viewBox="0 0 20 20" fill="var(--theme-elevation-500)">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </span>
            <span style={{ flex: 1 }}>All Media</span>
          </div>

          {/* Folder tree nodes */}
          {folders.map((folder) => (
            <FolderTreeItem
              key={String(folder.id)}
              node={folder}
              selectedFolderId={selectedFolderId}
              expandedIds={expandedIds}
              onSelect={handleSelectFolder}
              onToggleExpand={handleToggleExpand}
              depth={0}
            />
          ))}
        </div>
      </div>

      {/* ==================== RIGHT PANEL: Media Grid ==================== */}
      <div
        data-testid="main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toolbar */}
        <div style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--theme-elevation-100)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap',
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: '1 1 200px', maxWidth: '300px' }}>
            <input
              data-testid="media-search"
              type="text"
              placeholder="Search media..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '6px 32px 6px 12px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '6px',
                fontSize: '13px',
                background: 'var(--theme-elevation-0)',
                color: 'var(--theme-elevation-800)',
                outline: 'none',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: 'var(--theme-elevation-400)',
                  padding: '2px',
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Filter */}
          <select
            data-testid="media-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{
              padding: '6px 8px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              fontSize: '13px',
              background: 'var(--theme-elevation-0)',
              color: 'var(--theme-elevation-800)',
            }}
          >
            <option value="all">All Types</option>
            <option value="image">Images</option>
            <option value="document">Documents</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>

          {/* View toggle */}
          <button
            data-testid="view-toggle"
            onClick={handleToggleView}
            title={viewMode === 'grid' ? 'Switch to list view' : 'Switch to grid view'}
            style={{
              padding: '6px 8px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              background: 'var(--theme-elevation-0)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {viewMode === 'grid' ? (
              <svg width={16} height={16} viewBox="0 0 20 20" fill="var(--theme-elevation-600)">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg width={16} height={16} viewBox="0 0 20 20" fill="var(--theme-elevation-600)">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            )}
          </button>

          {/* Upload button */}
          <button
            data-testid="upload-button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '6px 12px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              background: 'var(--theme-elevation-800)',
              color: 'var(--theme-elevation-0)',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_EXTENSIONS}
            multiple
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />

          {/* Item count */}
          <span style={{ fontSize: '12px', color: 'var(--theme-elevation-400)', marginLeft: 'auto' }}>
            {totalMedia} item{totalMedia !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Breadcrumb */}
        <div style={{ padding: '8px 16px 0' }}>
          <Breadcrumb
            folders={folders}
            selectedFolderId={selectedFolderId}
            onNavigate={handleSelectFolder}
          />
        </div>

        {/* Upload progress indicators */}
        {uploads.length > 0 && (
          <div style={{ padding: '8px 16px 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {uploads.map((upload) => (
              <div key={upload.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '4px 8px',
                background: upload.status === 'error' ? 'var(--theme-error-50)' : 'var(--theme-elevation-50)',
                borderRadius: '4px',
                fontSize: '12px',
              }}>
                <span style={{
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: upload.status === 'error' ? 'var(--theme-error-500)' : 'var(--theme-elevation-700)',
                }}>
                  {upload.filename}
                  {upload.error && ` — ${upload.error}`}
                </span>
                {upload.status === 'uploading' && (
                  <div style={{
                    width: '80px',
                    height: '4px',
                    background: 'var(--theme-elevation-200)',
                    borderRadius: '2px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${upload.progress}%`,
                      height: '100%',
                      background: 'var(--theme-success-500)',
                      transition: 'width 200ms ease',
                    }} />
                  </div>
                )}
                {upload.status === 'complete' && (
                  <span style={{ color: 'var(--theme-success-500)', fontSize: '11px' }}>✓</span>
                )}
                {upload.status === 'uploading' && (
                  <span style={{ color: 'var(--theme-elevation-400)', fontSize: '11px' }}>
                    {upload.progress}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Media content area with drag-and-drop */}
        <div
          data-testid="drop-zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            flex: 1,
            overflow: 'auto',
            padding: '8px 16px 16px',
            position: 'relative',
            border: isDragOver ? '2px dashed var(--theme-success-500)' : '2px dashed transparent',
            transition: 'border-color 200ms ease',
          }}
        >
          {/* Drag overlay */}
          {isDragOver && (
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(34, 197, 94, 0.05)',
              zIndex: 10,
              borderRadius: '4px',
              pointerEvents: 'none',
            }}>
              <div style={{
                padding: '16px 24px',
                background: 'var(--theme-elevation-0)',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--theme-success-600)',
              }}>
                Drop files here to upload
              </div>
            </div>
          )}
          {mediaLoading ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              color: 'var(--theme-elevation-400)',
              fontSize: '13px',
            }}>
              Loading...
            </div>
          ) : mediaItems.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
              color: 'var(--theme-elevation-400)',
              fontSize: '13px',
              gap: '8px',
            }}>
              <svg width={48} height={48} viewBox="0 0 24 24" fill="none" stroke="var(--theme-elevation-300)" strokeWidth={1}>
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span>
                {searchQuery || filterType !== 'all'
                  ? 'No media items match your search'
                  : 'No media items in this folder'}
              </span>
            </div>
          ) : viewMode === 'grid' ? (
            <div
              data-testid="media-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '12px',
              }}
            >
              {mediaItems.map((item) => (
                <MediaGridItem
                  key={String(item.id)}
                  item={item}
                  onClick={handleMediaClick}
                  isSelected={selectedItems.has(item.id)}
                  onSelect={handleItemSelect}
                />
              ))}
            </div>
          ) : (
            <div data-testid="media-list" style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--theme-elevation-150)', textAlign: 'left' }}>
                    <th style={{ padding: '8px', width: '32px' }} />
                    <th style={{ padding: '8px', width: '48px' }} />
                    <th style={{ padding: '8px' }}>Filename</th>
                    <th style={{ padding: '8px' }}>Type</th>
                    <th style={{ padding: '8px' }}>Size</th>
                    <th style={{ padding: '8px' }}>Dimensions</th>
                    <th style={{ padding: '8px' }}>Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.map((item) => (
                    <MediaListItem
                      key={String(item.id)}
                      item={item}
                      onClick={handleMediaClick}
                      isSelected={selectedItems.has(item.id)}
                      onSelect={handleItemSelect}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
