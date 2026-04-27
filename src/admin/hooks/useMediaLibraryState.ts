/**
 * useMediaLibraryState — owns the complete state machine for the
 * Media Library admin view.
 *
 * Returns a flat object of state slices and action callbacks so the
 * orchestrator (`MediaLibraryClient`) can be a thin render shell.
 *
 * State slices:
 *  - folders + mediaItems + totalMedia      (server-loaded data)
 *  - loading + mediaLoading                  (loading flags)
 *  - selectedFolderId + expandedIds          (folder tree state)
 *  - viewMode                                (grid / list)
 *  - selectedItems                           (bulk-select set)
 *  - searchQuery + filterType                (filter inputs)
 *  - detailItem                              (currently-open detail panel)
 *  - isDragOver                              (canvas-wide drag indicator)
 *  - dialog flags: BulkMove / BulkDelete
 *  - folder CRUD state: isCreatingFolder, newFolderName, renamingFolderId,
 *    renameFolderName, folderContextMenu
 *
 * Persistence: expandedIds and viewMode are stored in localStorage.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'
import type { FolderNode, MediaItem, ViewMode } from '../views/media/types'
import { STORAGE_KEY_EXPANDED, STORAGE_KEY_VIEW } from '../views/media/helpers'

export interface FolderContextMenu {
  folderId: string | number
  folderName: string
  x: number
  y: number
  hasChildren: boolean
  mediaCount: number
}

export function useMediaLibraryState() {
  // --- Server-loaded data ---
  const [folders, setFolders] = useState<FolderNode[]>([])
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
  const [totalMedia, setTotalMedia] = useState(0)
  const [loading, setLoading] = useState(true)
  const [mediaLoading, setMediaLoading] = useState(false)

  // --- Folder tree + view state ---
  const [selectedFolderId, setSelectedFolderId] = useState<string | number | null>(null)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const saved = localStorage.getItem(STORAGE_KEY_EXPANDED)
      return saved ? new Set(JSON.parse(saved) as string[]) : new Set()
    } catch {
      return new Set()
    }
  })
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window === 'undefined') return 'grid'
    try {
      return ((localStorage.getItem(STORAGE_KEY_VIEW) as ViewMode) || 'grid')
    } catch {
      return 'grid'
    }
  })

  // --- Filter / search / detail ---
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [detailItem, setDetailItem] = useState<MediaItem | null>(null)

  // --- Bulk select + dialog flags ---
  const [selectedItems, setSelectedItems] = useState<Set<string | number>>(new Set())
  const [showBulkMoveDialog, setShowBulkMoveDialog] = useState(false)
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  // --- Folder CRUD state ---
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [renamingFolderId, setRenamingFolderId] = useState<string | number | null>(null)
  const [renameFolderName, setRenameFolderName] = useState('')
  const [folderContextMenu, setFolderContextMenu] = useState<FolderContextMenu | null>(null)

  // ---- Persist expanded state + view mode ----
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_EXPANDED, JSON.stringify([...expandedIds]))
    } catch {
      /* ignore */
    }
  }, [expandedIds])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_VIEW, viewMode)
    } catch {
      /* ignore */
    }
  }, [viewMode])

  // ---- Fetchers ----
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

  const fetchMedia = useCallback(async () => {
    setMediaLoading(true)
    try {
      const params = new URLSearchParams({ limit: '100', depth: '1', sort: '-createdAt' })
      if (selectedFolderId) {
        params.set('where[folder][equals]', String(selectedFolderId))
      }
      if (searchQuery.trim()) {
        params.set('where[or][0][filename][contains]', searchQuery.trim())
        params.set('where[or][1][alt][contains]', searchQuery.trim())
        params.set('where[or][2][title][contains]', searchQuery.trim())
      }
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

  // ---- Initial load + reactive media fetch ----
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      await fetchFolders()
      setLoading(false)
    }
    init()
  }, [fetchFolders])

  useEffect(() => {
    fetchMedia()
  }, [fetchMedia])

  // ---- Folder tree handlers ----
  const handleToggleExpand = useCallback((folderId: string | number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      const key = String(folderId)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

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

  const handleToggleView = useCallback(() => {
    setViewMode((prev) => (prev === 'grid' ? 'list' : 'grid'))
  }, [])

  const handleMediaClick = useCallback((item: MediaItem) => {
    setDetailItem(item)
  }, [])

  // ---- Bulk select handlers ----
  const handleSelectAll = useCallback(
    (checked: boolean) => {
      setSelectedItems(checked ? new Set(mediaItems.map((i) => i.id)) : new Set())
    },
    [mediaItems],
  )

  const handleItemSelect = useCallback((id: string | number, checked: boolean) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (checked) next.add(id)
      else next.delete(id)
      return next
    })
  }, [])

  const handleBulkMove = useCallback(
    async (targetFolderId: string | number | null) => {
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
    },
    [selectedItems, fetchMedia, fetchFolders],
  )

  const handleBulkDelete = useCallback(async () => {
    const ids = Array.from(selectedItems)
    await Promise.all(ids.map((id) => fetch(`/api/media/${id}`, { method: 'DELETE' })))
    setSelectedItems(new Set())
    setShowBulkDeleteConfirm(false)
    await Promise.all([fetchMedia(), fetchFolders()])
  }, [selectedItems, fetchMedia, fetchFolders])

  const handleBulkDownload = useCallback(() => {
    const items = mediaItems.filter((item) => selectedItems.has(item.id))
    items.forEach((item) => {
      const link = document.createElement('a')
      link.href = item.url
      link.download = item.filename
      link.click()
    })
  }, [mediaItems, selectedItems])

  // ---- Folder CRUD handlers ----
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

  const handleDeleteFolder = useCallback(
    async (folderId: string | number) => {
      try {
        await fetch(`/api/media-folders/${folderId}`, { method: 'DELETE' })
        if (String(selectedFolderId) === String(folderId)) {
          setSelectedFolderId(null)
        }
        await fetchFolders()
      } catch (err) {
        console.error('Failed to delete folder:', err)
      }
    },
    [selectedFolderId, fetchFolders],
  )

  // Close folder context menu on outside click.
  useEffect(() => {
    if (!folderContextMenu) return
    const handler = () => setFolderContextMenu(null)
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [folderContextMenu])

  return {
    // data
    folders,
    mediaItems,
    totalMedia,
    loading,
    mediaLoading,

    // tree + view
    selectedFolderId,
    expandedIds,
    viewMode,
    setViewMode,

    // filters
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    detailItem,
    setDetailItem,

    // bulk
    selectedItems,
    setSelectedItems,
    showBulkMoveDialog,
    setShowBulkMoveDialog,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    isDragOver,
    setIsDragOver,

    // folder CRUD
    isCreatingFolder,
    setIsCreatingFolder,
    newFolderName,
    setNewFolderName,
    renamingFolderId,
    setRenamingFolderId,
    renameFolderName,
    setRenameFolderName,
    folderContextMenu,
    setFolderContextMenu,

    // actions
    fetchFolders,
    fetchMedia,
    handleToggleExpand,
    handleSelectFolder,
    handleToggleView,
    handleMediaClick,
    handleSelectAll,
    handleItemSelect,
    handleBulkMove,
    handleBulkDelete,
    handleBulkDownload,
    handleCreateFolder,
    handleRenameFolder,
    handleDeleteFolder,
  }
}
