/**
 * @description
 * Client-side Media Library view for RAS Canada CMS admin (Epic 24).
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
import { MediaDetailPanel } from '../components/MediaDetailPanel'
import type { FolderNode, MediaItem, ViewMode } from './media/types'
import {
  ACCEPTED_EXTENSIONS,
  STORAGE_KEY_EXPANDED,
  STORAGE_KEY_VIEW,
  formatFileSize,
} from './media/helpers'
import { FileTypeIcon } from './media/icons'
import { FolderTreeItem } from './media/FolderTreeItem'
import { MediaGridItem, MediaListItem } from './media/MediaItems'
import { Breadcrumb } from './media/Breadcrumb'
import { BulkMoveDialog, BulkDeleteDialog } from './media/dialogs'
import { useMediaUpload } from '../hooks/useMediaUpload'

// --------------------------------------------------------------------------
// FolderTreeItem Component
// --------------------------------------------------------------------------

// FolderTreeItem extracted to ./media/FolderTreeItem.tsx

// --------------------------------------------------------------------------
// MediaGridItem Component (thumbnail card)
// --------------------------------------------------------------------------

// MediaGridItem, MediaListItem extracted to ./media/MediaItems.tsx
// Breadcrumb extracted to ./media/Breadcrumb.tsx

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

  // ----- Bulk select all / deselect all -----
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedItems(new Set(mediaItems.map((item) => item.id)))
    } else {
      setSelectedItems(new Set())
    }
  }, [mediaItems])

  // ----- Bulk move to folder -----
  const [showBulkMoveDialog, setShowBulkMoveDialog] = useState(false)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)

  const handleBulkMove = useCallback(async (targetFolderId: string | number | null) => {
    const ids = Array.from(selectedItems)
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/media/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ folder: targetFolderId }),
        }),
      ),
    )
    setSelectedItems(new Set())
    setShowBulkMoveDialog(false)
    await Promise.all([fetchMedia(), fetchFolders()])
  }, [selectedItems, fetchMedia, fetchFolders])

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedItems)
    await Promise.all(
      ids.map((id) => fetch(`/api/media/${id}`, { method: 'DELETE' })),
    )
    setSelectedItems(new Set())
    setShowBulkDeleteConfirm(false)
    await Promise.all([fetchMedia(), fetchFolders()])
  }, [selectedItems, fetchMedia, fetchFolders])

  const handleBulkDownload = useCallback(() => {
    // Download each selected item individually
    const items = mediaItems.filter((item) => selectedItems.has(item.id))
    items.forEach((item) => {
      const link = document.createElement('a')
      link.href = item.url
      link.download = item.filename
      link.click()
    })
  }, [mediaItems, selectedItems])

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
  // Upload state + handlers come from a shared hook.
  const { uploads, uploadFiles } = useMediaUpload({
    selectedFolderId,
    onUploadComplete: async () => {
      await Promise.all([fetchMedia(), fetchFolders()])
    },
  })

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

  // ----- Folder management state -----
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [renamingFolderId, setRenamingFolderId] = useState<string | number | null>(null)
  const [renameFolderName, setRenameFolderName] = useState('')
  const [folderContextMenu, setFolderContextMenu] = useState<{
    folderId: string | number
    folderName: string
    x: number
    y: number
    hasChildren: boolean
    mediaCount: number
  } | null>(null)

  // Create new folder
  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim()) return
    try {
      await fetch('/api/media-folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newFolderName.trim(),
          parent: selectedFolderId || undefined,
          sortOrder: 0,
        }),
      })
      setNewFolderName('')
      setIsCreatingFolder(false)
      await fetchFolders()
    } catch (err) {
      console.error('Failed to create folder:', err)
    }
  }, [newFolderName, selectedFolderId, fetchFolders])

  // Rename folder
  const handleRenameFolder = useCallback(async () => {
    if (!renamingFolderId || !renameFolderName.trim()) return
    try {
      await fetch(`/api/media-folders/${renamingFolderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: renameFolderName.trim() }),
      })
      setRenamingFolderId(null)
      setRenameFolderName('')
      await fetchFolders()
    } catch (err) {
      console.error('Failed to rename folder:', err)
    }
  }, [renamingFolderId, renameFolderName, fetchFolders])

  // Delete folder (only if empty — no media and no children)
  const handleDeleteFolder = useCallback(async (folderId: string | number) => {
    try {
      await fetch(`/api/media-folders/${folderId}`, { method: 'DELETE' })
      if (String(selectedFolderId) === String(folderId)) {
        setSelectedFolderId(null)
      }
      await fetchFolders()
    } catch (err) {
      console.error('Failed to delete folder:', err)
    }
  }, [selectedFolderId, fetchFolders])

  // Close context menu on click outside
  useEffect(() => {
    if (!folderContextMenu) return
    const handleClickOutside = () => setFolderContextMenu(null)
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [folderContextMenu])

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
          <button
            data-testid="new-folder-button"
            onClick={() => setIsCreatingFolder(true)}
            title="New Folder"
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              color: 'var(--theme-elevation-500)',
              padding: '2px 4px',
              lineHeight: 1,
            }}
          >
            +
          </button>
        </div>

        {/* New folder inline input */}
        {isCreatingFolder && (
          <div style={{ padding: '4px 8px', display: 'flex', gap: '4px' }}>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateFolder()
                if (e.key === 'Escape') { setIsCreatingFolder(false); setNewFolderName('') }
              }}
              placeholder="Folder name..."
              autoFocus
              style={{
                flex: 1,
                padding: '4px 6px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
            <button
              onClick={handleCreateFolder}
              style={{
                padding: '4px 8px',
                border: 'none',
                borderRadius: '4px',
                background: 'var(--theme-elevation-800)',
                color: 'var(--theme-elevation-0)',
                cursor: 'pointer',
                fontSize: '11px',
              }}
            >
              Add
            </button>
          </div>
        )}

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
              onContextMenu={(e, node) => {
                setFolderContextMenu({
                  folderId: node.id,
                  folderName: node.name,
                  x: e.clientX,
                  y: e.clientY,
                  hasChildren: node.hasChildren,
                  mediaCount: node.mediaCount,
                })
              }}
              depth={0}
            />
          ))}
        </div>

        {/* Folder context menu */}
        {folderContextMenu && (
          <div
            data-testid="folder-context-menu"
            style={{
              position: 'fixed',
              left: folderContextMenu.x,
              top: folderContextMenu.y,
              background: 'var(--theme-elevation-0)',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '6px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '4px 0',
              zIndex: 100,
              minWidth: '140px',
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                setRenamingFolderId(folderContextMenu.folderId)
                setRenameFolderName(folderContextMenu.folderName)
                setFolderContextMenu(null)
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '6px 12px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: 'pointer',
                fontSize: '13px',
                color: 'var(--theme-elevation-800)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--theme-elevation-50)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (folderContextMenu.hasChildren || folderContextMenu.mediaCount > 0) {
                  alert('Cannot delete a folder that contains items. Move or delete contents first.')
                } else {
                  handleDeleteFolder(folderContextMenu.folderId)
                }
                setFolderContextMenu(null)
              }}
              disabled={folderContextMenu.hasChildren || folderContextMenu.mediaCount > 0}
              style={{
                display: 'block',
                width: '100%',
                padding: '6px 12px',
                border: 'none',
                background: 'none',
                textAlign: 'left',
                cursor: folderContextMenu.hasChildren || folderContextMenu.mediaCount > 0 ? 'not-allowed' : 'pointer',
                fontSize: '13px',
                color: folderContextMenu.hasChildren || folderContextMenu.mediaCount > 0
                  ? 'var(--theme-elevation-300)'
                  : 'var(--theme-error-500)',
              }}
              onMouseEnter={(e) => {
                if (!(folderContextMenu.hasChildren || folderContextMenu.mediaCount > 0))
                  e.currentTarget.style.background = 'var(--theme-elevation-50)'
              }}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              Delete{(folderContextMenu.hasChildren || folderContextMenu.mediaCount > 0) ? ' (not empty)' : ''}
            </button>
          </div>
        )}

        {/* Rename folder dialog */}
        {renamingFolderId && (
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
              width: '300px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            }}>
              <div style={{ fontSize: '16px', fontWeight: 600, marginBottom: '12px' }}>
                Rename Folder
              </div>
              <input
                type="text"
                value={renameFolderName}
                onChange={(e) => setRenameFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameFolder()
                  if (e.key === 'Escape') { setRenamingFolderId(null); setRenameFolderName('') }
                }}
                autoFocus
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid var(--theme-elevation-200)',
                  borderRadius: '4px',
                  fontSize: '14px',
                  marginBottom: '12px',
                }}
              />
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setRenamingFolderId(null); setRenameFolderName('') }}
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
                  onClick={handleRenameFolder}
                  style={{
                    padding: '6px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    background: 'var(--theme-elevation-800)',
                    color: 'var(--theme-elevation-0)',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: 500,
                  }}
                >
                  Rename
                </button>
              </div>
            </div>
          </div>
        )}
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
          {/* Select All checkbox */}
          <input
            data-testid="select-all"
            type="checkbox"
            checked={mediaItems.length > 0 && selectedItems.size === mediaItems.length}
            onChange={(e) => handleSelectAll(e.target.checked)}
            title="Select all"
            style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
          />

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

        {/* Bulk actions bar */}
        {selectedItems.size > 0 && (
          <div
            data-testid="bulk-actions"
            style={{
              padding: '8px 16px',
              background: 'var(--theme-elevation-50)',
              borderBottom: '1px solid var(--theme-elevation-100)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
            }}
          >
            <span style={{ fontWeight: 500, color: 'var(--theme-elevation-700)' }}>
              {selectedItems.size} item{selectedItems.size !== 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => setShowBulkMoveDialog(true)}
              style={{
                padding: '4px 10px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '4px',
                background: 'var(--theme-elevation-0)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Move to...
            </button>
            <button
              onClick={handleBulkDownload}
              style={{
                padding: '4px 10px',
                border: '1px solid var(--theme-elevation-200)',
                borderRadius: '4px',
                background: 'var(--theme-elevation-0)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Download
            </button>
            <button
              onClick={() => setShowBulkDeleteConfirm(true)}
              style={{
                padding: '4px 10px',
                border: '1px solid var(--theme-error-500)',
                borderRadius: '4px',
                background: 'transparent',
                color: 'var(--theme-error-500)',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              Delete
            </button>
            <button
              onClick={() => setSelectedItems(new Set())}
              style={{
                padding: '4px 10px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '12px',
                color: 'var(--theme-elevation-500)',
                marginLeft: 'auto',
              }}
            >
              Deselect all
            </button>
          </div>
        )}

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

      {/* ==================== RIGHT DRAWER: Media Detail Panel ==================== */}
      {detailItem && (
        <MediaDetailPanel
          item={detailItem}
          onClose={() => setDetailItem(null)}
          onSave={() => {
            fetchMedia()
            setDetailItem(null)
          }}
          onDelete={() => {
            fetchMedia()
            fetchFolders()
            setDetailItem(null)
          }}
        />
      )}

      {/* ==================== Bulk Move Dialog ==================== */}
      {showBulkMoveDialog && (
        <BulkMoveDialog
          folders={folders}
          onMove={handleBulkMove}
          onCancel={() => setShowBulkMoveDialog(false)}
        />
      )}

      {showBulkDeleteConfirm && (
        <BulkDeleteDialog
          count={selectedItems.size}
          onConfirm={handleBulkDelete}
          onCancel={() => setShowBulkDeleteConfirm(false)}
        />
      )}
    </div>
  )
}

// flattenFolders + FlatFolder live in ./media/helpers.ts and ./media/types.ts
