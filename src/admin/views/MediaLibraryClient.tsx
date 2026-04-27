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

import React, { useCallback, useRef, type DragEvent } from 'react'
import { MediaDetailPanel } from '../components/MediaDetailPanel'
import type { MediaItem } from './media/types'
import { ACCEPTED_EXTENSIONS, formatFileSize } from './media/helpers'
import { FileTypeIcon } from './media/icons'
import { FolderTreeItem } from './media/FolderTreeItem'
import { MediaGridItem, MediaListItem } from './media/MediaItems'
import { Breadcrumb } from './media/Breadcrumb'
import { BulkMoveDialog, BulkDeleteDialog } from './media/dialogs'
import { useMediaUpload } from '../hooks/useMediaUpload'
import { useMediaLibraryState } from '../hooks/useMediaLibraryState'

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
  // All state + handlers live in useMediaLibraryState. This component
  // is now a render shell.
  const state = useMediaLibraryState()
  const {
    folders,
    mediaItems,
    totalMedia,
    loading,
    mediaLoading,
    selectedFolderId,
    expandedIds,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    detailItem,
    setDetailItem,
    selectedItems,
    setSelectedItems,
    showBulkMoveDialog,
    setShowBulkMoveDialog,
    showBulkDeleteConfirm,
    setShowBulkDeleteConfirm,
    isDragOver,
    setIsDragOver,
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
  } = state

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Upload state + handlers come from a shared hook.
  const { uploads, uploadFiles } = useMediaUpload({
    selectedFolderId,
    onUploadComplete: async () => {
      await Promise.all([fetchMedia(), fetchFolders()])
    },
  })

  // ----- Handle file input change -----
  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        uploadFiles(e.target.files)
        e.target.value = ''
      }
    },
    [uploadFiles],
  )

  // ----- Drag-and-drop handlers (canvas-wide) -----
  const handleDragOver = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    },
    [setIsDragOver],
  )

  const handleDragLeave = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.currentTarget === e.target || !e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false)
      }
    },
    [setIsDragOver],
  )

  const handleDrop = useCallback(
    (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        uploadFiles(e.dataTransfer.files)
      }
    },
    [setIsDragOver, uploadFiles],
  )

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
