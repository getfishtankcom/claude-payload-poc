/**
 * @description
 * Client-side Workbox view for RAS Canada CMS admin (Epic 27).
 * Provides a unified dashboard for managing content workflow across all
 * 12 workflow-enabled collections. Replaces the need to open individual
 * item editors for state transitions.
 *
 * Key features:
 * - Tab bar: All | In Review (N) | Needs Revision (N) | Approved (N) | Scheduled (N)
 * - Item rows: title, content type icon, author, time since submission
 * - Inline workflow actions: Approve, Reject, Publish Now per-item
 * - Rejection comment modal (mandatory comment)
 * - Workflow history timeline modal
 * - Filters: board, content type, author, date range
 * - Sorting: date submitted (default), author, content type
 * - Bulk actions: multi-select, bulk approve, bulk publish, bulk reject
 * - URL query param persistence for filters and active tab
 *
 * @dependencies
 * - @payloadcms/ui: useAuth
 * - WorkflowActionBar patterns (shared rejection modal)
 *
 * @notes
 * - data-testid="workbox-view" on main container
 * - Authors see only their own items; editors/admins see all
 * - Queries 12 collections in parallel via Promise.allSettled
 * - Optimistic UI: button states update immediately, rollback on error
 */
'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@payloadcms/ui'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

import type { UserWithRole, WorkflowState } from '../types/workflow'
import { STATE_LABELS as SHARED_STATE_LABELS, STATE_COLORS as SHARED_STATE_COLORS } from '../types/workflow'
import { ModalOverlay, ModalButton } from '../components/ui/Modal'
import { InlineButton, BulkActionButton } from '../components/ui/ActionButton'

type WorkboxTab = 'all' | 'in_review' | 'needs_revision' | 'approved' | 'scheduled'
type SortField = 'date' | 'author' | 'type'
type SortDir = 'asc' | 'desc'

interface WorkboxItem {
  id: string
  title?: string
  slug?: string
  workflowState: WorkflowState
  workflowHistory?: Array<{
    from?: string
    to?: string
    user?: { id?: string; firstName?: string; email?: string } | string
    date?: string
    comment?: string
  }>
  createdBy?: { id?: string; email?: string; firstName?: string } | string
  publishOn?: string
  unpublishOn?: string
  updatedAt?: string
  createdAt?: string
  /** Board relationship (if collection has it) */
  board?: { id?: string; title?: string; slug?: string } | string
  /** Injected by our fetch logic */
  _collection: string
  _collectionLabel: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** All 12 workflow-enabled collections */
const WORKFLOW_COLLECTIONS: Array<{ slug: string; label: string; icon: string }> = [
  { slug: 'pages', label: 'Pages', icon: '📄' },
  { slug: 'news', label: 'News', icon: '📰' },
  { slug: 'projects', label: 'Projects', icon: '📋' },
  { slug: 'events', label: 'Events', icon: '📅' },
  { slug: 'consultations', label: 'Consultations', icon: '📢' },
  { slug: 'documents', label: 'Documents', icon: '📁' },
  { slug: 'board-members', label: 'Board Members', icon: '👤' },
  { slug: 'committees', label: 'Committees', icon: '👥' },
  { slug: 'resources', label: 'Resources', icon: '📖' },
  { slug: 'documents-for-comment', label: 'Docs for Comment', icon: '💬' },
  { slug: 'document-details', label: 'Document Details', icon: '📝' },
  { slug: 'job-postings', label: 'Job Postings', icon: '💼' },
]

const TAB_CONFIG: Array<{ key: WorkboxTab; label: string; states: WorkflowState[] }> = [
  { key: 'all', label: 'All', states: ['in_review', 'needs_revision', 'approved'] },
  { key: 'in_review', label: 'In Review', states: ['in_review'] },
  { key: 'needs_revision', label: 'Needs Revision', states: ['needs_revision'] },
  { key: 'approved', label: 'Approved', states: ['approved'] },
  { key: 'scheduled', label: 'Scheduled', states: ['approved'] },
]

const STATE_LABELS = SHARED_STATE_LABELS
const STATE_COLORS = SHARED_STATE_COLORS

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Time-ago helper */
function timeAgo(dateStr?: string): string {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 30) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

/** Get author display name from item */
function getAuthorName(item: WorkboxItem): string {
  if (!item.createdBy) return 'Unknown'
  if (typeof item.createdBy === 'string') return item.createdBy
  return item.createdBy.firstName || item.createdBy.email || 'Unknown'
}

/** Read URL params for initial state */
function getInitialTab(): WorkboxTab {
  if (typeof window === 'undefined') return 'all'
  const params = new URLSearchParams(window.location.search)
  const tab = params.get('tab')
  if (tab && ['all', 'in_review', 'needs_revision', 'approved', 'scheduled'].includes(tab)) {
    return tab as WorkboxTab
  }
  return 'all'
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function WorkboxClient() {
  const { user } = useAuth()
  const typedUser = user as UserWithRole | null
  const isEditorOrAdmin = typedUser?.role === 'admin' || typedUser?.role === 'editor'
  const isAuthorOnly = typedUser?.role === 'author'

  // --- State ---
  const [items, setItems] = useState<WorkboxItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<WorkboxTab>(getInitialTab)
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Filters
  const [filterType, setFilterType] = useState<string>('')
  const [filterAuthor, setFilterAuthor] = useState<string>('')

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Rejection modal
  const [rejectTarget, setRejectTarget] = useState<WorkboxItem | null>(null)
  const [rejectComment, setRejectComment] = useState('')

  // Bulk rejection modal
  const [showBulkRejectModal, setShowBulkRejectModal] = useState(false)
  const [bulkRejectComment, setBulkRejectComment] = useState('')

  // History modal
  const [historyTarget, setHistoryTarget] = useState<WorkboxItem | null>(null)

  // Transition loading state (per-item)
  const [transitioningIds, setTransitioningIds] = useState<Set<string>>(new Set())

  // Error toast
  const [toastError, setToastError] = useState<string | null>(null)

  // --- Fetch all workflow items across collections ---
  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const states = 'in_review,needs_revision,approved'
      const promises = WORKFLOW_COLLECTIONS.map(async (col) => {
        let url = `/api/${col.slug}?where[workflowState][in]=${states}&limit=100&sort=-updatedAt&depth=1`
        // Author scoping: only own items
        if (isAuthorOnly && typedUser?.id) {
          url += `&where[createdBy][equals]=${typedUser.id}`
        }
        const res = await fetch(url)
        if (!res.ok) return []
        const data = await res.json()
        return (data.docs || []).map((doc: Record<string, unknown>) => ({
          ...doc,
          _collection: col.slug,
          _collectionLabel: col.label,
        }))
      })

      const results = await Promise.allSettled(promises)
      const allItems: WorkboxItem[] = []
      for (const result of results) {
        if (result.status === 'fulfilled') {
          allItems.push(...result.value)
        }
      }
      setItems(allItems)
    } catch {
      setToastError('Failed to load workflow items')
    } finally {
      setLoading(false)
    }
  }, [isAuthorOnly, typedUser?.id])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  // Refresh on window focus
  useEffect(() => {
    const handleFocus = () => fetchItems()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [fetchItems])

  // --- URL param sync ---
  useEffect(() => {
    if (typeof window === 'undefined') return
    const params = new URLSearchParams(window.location.search)
    params.set('tab', activeTab)
    const newUrl = `${window.location.pathname}?${params.toString()}`
    window.history.replaceState(null, '', newUrl)
  }, [activeTab])

  // --- Filter and sort items ---
  const filteredItems = useMemo(() => {
    const tabConfig = TAB_CONFIG.find((t) => t.key === activeTab)
    if (!tabConfig) return []

    let result = items.filter((item) => {
      // Tab filter
      if (activeTab === 'scheduled') {
        // Scheduled = approved + has publishOn date
        return item.workflowState === 'approved' && !!item.publishOn
      }
      return tabConfig.states.includes(item.workflowState)
    })

    // Type filter
    if (filterType) {
      result = result.filter((item) => item._collection === filterType)
    }

    // Author filter (by name substring match)
    if (filterAuthor) {
      const q = filterAuthor.toLowerCase()
      result = result.filter((item) => getAuthorName(item).toLowerCase().includes(q))
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'date':
          cmp = new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime()
          break
        case 'author':
          cmp = getAuthorName(a).localeCompare(getAuthorName(b))
          break
        case 'type':
          cmp = a._collectionLabel.localeCompare(b._collectionLabel)
          break
      }
      return sortDir === 'desc' ? -cmp : cmp
    })

    return result
  }, [items, activeTab, filterType, filterAuthor, sortField, sortDir])

  // --- Tab counts ---
  const tabCounts = useMemo(() => {
    const counts: Record<WorkboxTab, number> = { all: 0, in_review: 0, needs_revision: 0, approved: 0, scheduled: 0 }
    for (const item of items) {
      if (item.workflowState === 'in_review') { counts.in_review++; counts.all++ }
      else if (item.workflowState === 'needs_revision') { counts.needs_revision++; counts.all++ }
      else if (item.workflowState === 'approved') {
        counts.approved++
        counts.all++
        if (item.publishOn) counts.scheduled++
      }
    }
    return counts
  }, [items])

  // --- Workflow transition ---
  const performTransition = useCallback(async (
    item: WorkboxItem,
    newState: WorkflowState,
    comment?: string,
  ) => {
    const itemKey = `${item._collection}-${item.id}`
    setTransitioningIds((prev) => new Set(prev).add(itemKey))
    setToastError(null)

    // Optimistic: remove from list functionally so rapid transitions don't
    // capture a stale `items` snapshot. Keep the removed item so we can
    // restore it on failure.
    let removed: WorkboxItem | undefined
    setItems((prev) => {
      const idx = prev.findIndex(
        (i) => i.id === item.id && i._collection === item._collection,
      )
      if (idx < 0) return prev
      removed = prev[idx]
      return [...prev.slice(0, idx), ...prev.slice(idx + 1)]
    })

    try {
      const body: Record<string, unknown> = { workflowState: newState }
      if (comment) {
        body._context = { workflowComment: comment }
      }
      const res = await fetch(`/api/${item._collection}/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.errors?.[0]?.message || `Transition failed: ${res.status}`)
      }
      // Successful — item stays removed from list (it moved states)
    } catch (err) {
      // Rollback optimistic update functionally — re-insert the removed item.
      setItems((prev) => (removed ? [...prev, removed] : prev))
      setToastError(err instanceof Error ? err.message : 'Transition failed')
      setTimeout(() => setToastError(null), 5000)
    } finally {
      setTransitioningIds((prev) => {
        const next = new Set(prev)
        next.delete(itemKey)
        return next
      })
    }
  }, [])

  // --- Reject handler ---
  const handleReject = useCallback(() => {
    if (!rejectTarget || !rejectComment.trim()) return
    performTransition(rejectTarget, 'needs_revision', rejectComment)
    setRejectTarget(null)
    setRejectComment('')
  }, [rejectTarget, rejectComment, performTransition])

  // --- Bulk actions ---
  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => `${i._collection}-${i.id}`)))
    }
  }, [filteredItems, selectedIds])

  const toggleSelect = useCallback((item: WorkboxItem) => {
    const key = `${item._collection}-${item.id}`
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }, [])

  const selectedItems = useMemo(() => {
    return filteredItems.filter((i) => selectedIds.has(`${i._collection}-${i.id}`))
  }, [filteredItems, selectedIds])

  const handleBulkApprove = useCallback(async () => {
    const eligible = selectedItems.filter((i) => i.workflowState === 'in_review')
    if (eligible.length === 0) return
    if (!confirm(`Approve ${eligible.length} item(s)?`)) return
    for (const item of eligible) {
      await performTransition(item, 'approved')
    }
    setSelectedIds(new Set())
  }, [selectedItems, performTransition])

  const handleBulkPublish = useCallback(async () => {
    const eligible = selectedItems.filter((i) => i.workflowState === 'approved')
    if (eligible.length === 0) return
    if (!confirm(`Publish ${eligible.length} item(s)?`)) return
    for (const item of eligible) {
      await performTransition(item, 'published')
    }
    setSelectedIds(new Set())
  }, [selectedItems, performTransition])

  const handleBulkReject = useCallback(() => {
    const eligible = selectedItems.filter((i) => i.workflowState === 'in_review')
    if (eligible.length === 0) return
    setShowBulkRejectModal(true)
  }, [selectedItems])

  const executeBulkReject = useCallback(async () => {
    if (!bulkRejectComment.trim()) return
    const eligible = selectedItems.filter((i) => i.workflowState === 'in_review')
    for (const item of eligible) {
      await performTransition(item, 'needs_revision', bulkRejectComment)
    }
    setShowBulkRejectModal(false)
    setBulkRejectComment('')
    setSelectedIds(new Set())
  }, [selectedItems, bulkRejectComment, performTransition])

  // --- Sort toggle ---
  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === 'desc' ? 'asc' : 'desc'))
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }, [sortField])

  // --- Render ---
  return (
    <div
      data-testid="workbox-view"
      style={{
        padding: '24px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: 'var(--font-body, system-ui, sans-serif)',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px' }}>Workbox</h1>
        <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)', margin: 0 }}>
          Manage content workflow across all collections
        </p>
      </div>

      {/* Error toast */}
      {toastError && (
        <div style={{
          padding: '10px 16px',
          marginBottom: '16px',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '6px',
          fontSize: '13px',
          color: '#dc2626',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <span>{toastError}</span>
          <button
            onClick={() => setToastError(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '14px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        gap: '0',
        borderBottom: '2px solid var(--theme-elevation-150)',
        marginBottom: '16px',
      }}>
        {TAB_CONFIG.map((tab) => (
          <button
            key={tab.key}
            data-testid={`workbox-tab-${tab.key}`}
            onClick={() => { setActiveTab(tab.key); setSelectedIds(new Set()) }}
            style={{
              padding: '10px 16px',
              fontSize: '13px',
              fontWeight: activeTab === tab.key ? 600 : 400,
              color: activeTab === tab.key ? 'var(--theme-elevation-1000)' : 'var(--theme-elevation-500)',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid var(--theme-elevation-1000)' : '2px solid transparent',
              marginBottom: '-2px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {tab.label}
            {tabCounts[tab.key] > 0 && (
              <span style={{
                padding: '1px 6px',
                borderRadius: '10px',
                fontSize: '11px',
                fontWeight: 600,
                background: activeTab === tab.key ? 'var(--theme-elevation-1000)' : 'var(--theme-elevation-200)',
                color: activeTab === tab.key ? 'white' : 'var(--theme-elevation-600)',
              }}>
                {tabCounts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filters + Sort bar */}
      <div style={{
        display: 'flex',
        gap: '12px',
        marginBottom: '12px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
        {/* Content type filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          style={{
            padding: '6px 10px',
            fontSize: '12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '4px',
            background: 'var(--theme-elevation-0)',
          }}
        >
          <option value="">All Types</option>
          {WORKFLOW_COLLECTIONS.map((col) => (
            <option key={col.slug} value={col.slug}>{col.icon} {col.label}</option>
          ))}
        </select>

        {/* Author search */}
        <input
          type="text"
          placeholder="Filter by author..."
          value={filterAuthor}
          onChange={(e) => setFilterAuthor(e.target.value)}
          style={{
            padding: '6px 10px',
            fontSize: '12px',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '4px',
            width: '180px',
          }}
        />

        <div style={{ flex: 1 }} />

        {/* Sort controls */}
        <span style={{ fontSize: '11px', color: 'var(--theme-elevation-400)' }}>Sort by:</span>
        {(['date', 'author', 'type'] as SortField[]).map((f) => (
          <button
            key={f}
            onClick={() => handleSort(f)}
            style={{
              padding: '4px 8px',
              fontSize: '11px',
              border: '1px solid var(--theme-elevation-200)',
              borderRadius: '4px',
              background: sortField === f ? 'var(--theme-elevation-100)' : 'transparent',
              fontWeight: sortField === f ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {f === 'date' ? 'Date' : f === 'author' ? 'Author' : 'Type'}
            {sortField === f && (sortDir === 'desc' ? ' ↓' : ' ↑')}
          </button>
        ))}
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && isEditorOrAdmin && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 12px',
          marginBottom: '8px',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '6px',
          fontSize: '12px',
        }}>
          <span style={{ fontWeight: 500 }}>{selectedIds.size} selected</span>
          <div style={{ flex: 1 }} />
          <BulkActionButton
            label="Bulk Approve"
            variant="success"
            onClick={handleBulkApprove}
            disabled={selectedItems.filter((i) => i.workflowState === 'in_review').length === 0}
          />
          <BulkActionButton
            label="Bulk Publish"
            variant="primary"
            onClick={handleBulkPublish}
            disabled={selectedItems.filter((i) => i.workflowState === 'approved').length === 0}
          />
          <BulkActionButton
            label="Bulk Reject"
            variant="warning"
            onClick={handleBulkReject}
            disabled={selectedItems.filter((i) => i.workflowState === 'in_review').length === 0}
          />
          <button
            onClick={() => setSelectedIds(new Set())}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '12px',
              color: '#6b7280',
              cursor: 'pointer',
            }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Items list */}
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>
          Loading workflow items...
        </div>
      ) : filteredItems.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: 'var(--theme-elevation-400)' }}>
          No items in this view
        </div>
      ) : (
        <div style={{ border: '1px solid var(--theme-elevation-150)', borderRadius: '8px', overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: isEditorOrAdmin ? '36px 1fr 120px 120px 100px 200px' : '1fr 120px 120px 100px',
            gap: '8px',
            padding: '8px 12px',
            background: 'var(--theme-elevation-50)',
            borderBottom: '1px solid var(--theme-elevation-150)',
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--theme-elevation-500)',
            textTransform: 'uppercase',
          }}>
            {isEditorOrAdmin && (
              <div>
                <input
                  type="checkbox"
                  checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                  onChange={handleSelectAll}
                  title="Select all"
                />
              </div>
            )}
            <div>Title</div>
            <div>Type</div>
            <div>Author</div>
            <div>Updated</div>
            {isEditorOrAdmin && <div style={{ textAlign: 'right' }}>Actions</div>}
          </div>

          {/* Item rows */}
          {filteredItems.map((item) => {
            const itemKey = `${item._collection}-${item.id}`
            const isTransitioning = transitioningIds.has(itemKey)
            const isSelected = selectedIds.has(itemKey)
            const colConfig = WORKFLOW_COLLECTIONS.find((c) => c.slug === item._collection)

            return (
              <div
                key={itemKey}
                data-testid="workbox-item-row"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isEditorOrAdmin ? '36px 1fr 120px 120px 100px 200px' : '1fr 120px 120px 100px',
                  gap: '8px',
                  padding: '10px 12px',
                  borderBottom: '1px solid var(--theme-elevation-100)',
                  alignItems: 'center',
                  fontSize: '13px',
                  opacity: isTransitioning ? 0.5 : 1,
                  background: isSelected ? '#f0f9ff' : 'transparent',
                  transition: 'opacity 0.2s, background 0.2s',
                }}
              >
                {/* Checkbox */}
                {isEditorOrAdmin && (
                  <div>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(item)}
                    />
                  </div>
                )}

                {/* Title + state badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '1px 6px',
                      borderRadius: '3px',
                      fontSize: '10px',
                      fontWeight: 600,
                      color: 'white',
                      background: STATE_COLORS[item.workflowState],
                      flexShrink: 0,
                    }}
                  >
                    {STATE_LABELS[item.workflowState]}
                  </span>
                  <a
                    href={`/admin/collections/${item._collection}/${item.id}`}
                    style={{
                      color: 'var(--theme-elevation-800)',
                      textDecoration: 'none',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                    title={item.title || item.slug || String(item.id)}
                  >
                    {item.title || item.slug || item.id}
                  </a>
                </div>

                {/* Type */}
                <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)' }}>
                  <span>{colConfig?.icon} </span>
                  {item._collectionLabel}
                </div>

                {/* Author */}
                <div style={{ fontSize: '12px', color: 'var(--theme-elevation-600)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {getAuthorName(item)}
                </div>

                {/* Updated */}
                <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400)' }}>
                  {timeAgo(item.updatedAt)}
                </div>

                {/* Actions */}
                {isEditorOrAdmin && (
                  <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    {/* Preview */}
                    <InlineButton
                      label="Preview"
                      onClick={() => window.open(`/admin/collections/${item._collection}/${item.id}`, '_blank')}
                      disabled={isTransitioning}
                    />

                    {/* State-specific actions */}
                    {item.workflowState === 'in_review' && (
                      <>
                        <InlineButton
                          label="Approve"
                          variant="success"
                          onClick={() => performTransition(item, 'approved')}
                          disabled={isTransitioning}
                        />
                        <InlineButton
                          label="Reject"
                          variant="warning"
                          onClick={() => setRejectTarget(item)}
                          disabled={isTransitioning}
                        />
                      </>
                    )}

                    {item.workflowState === 'needs_revision' && (
                      <InlineButton
                        label="History"
                        onClick={() => setHistoryTarget(item)}
                        disabled={isTransitioning}
                      />
                    )}

                    {item.workflowState === 'approved' && (
                      <InlineButton
                        label="Publish"
                        variant="success"
                        onClick={() => performTransition(item, 'published')}
                        disabled={isTransitioning}
                      />
                    )}

                    {/* History button (always available) */}
                    {item.workflowHistory && item.workflowHistory.length > 0 && item.workflowState !== 'needs_revision' && (
                      <InlineButton
                        label="History"
                        onClick={() => setHistoryTarget(item)}
                        disabled={isTransitioning}
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* --- Rejection Modal --- */}
      {rejectTarget && (
        <ModalOverlay onClose={() => { setRejectTarget(null); setRejectComment('') }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>
            Reject: {rejectTarget.title || rejectTarget.id}
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)', margin: '0 0 12px' }}>
            A comment is required. This will be shown to the author.
          </p>
          <textarea
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            placeholder="Explain what needs to be revised..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-200)',
              fontSize: '13px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <ModalButton label="Cancel" onClick={() => { setRejectTarget(null); setRejectComment('') }} />
            <ModalButton
              label="Reject"
              variant="warning"
              onClick={handleReject}
              disabled={!rejectComment.trim()}
            />
          </div>
        </ModalOverlay>
      )}

      {/* --- Bulk Rejection Modal --- */}
      {showBulkRejectModal && (
        <ModalOverlay onClose={() => { setShowBulkRejectModal(false); setBulkRejectComment('') }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '16px' }}>
            Bulk Reject ({selectedItems.filter((i) => i.workflowState === 'in_review').length} items)
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--theme-elevation-500)', margin: '0 0 12px' }}>
            This comment will be applied to all selected items.
          </p>
          <textarea
            value={bulkRejectComment}
            onChange={(e) => setBulkRejectComment(e.target.value)}
            placeholder="Explain what needs to be revised..."
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-200)',
              fontSize: '13px',
              resize: 'vertical',
              boxSizing: 'border-box',
            }}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '12px' }}>
            <ModalButton label="Cancel" onClick={() => { setShowBulkRejectModal(false); setBulkRejectComment('') }} />
            <ModalButton
              label="Reject All"
              variant="warning"
              onClick={executeBulkReject}
              disabled={!bulkRejectComment.trim()}
            />
          </div>
        </ModalOverlay>
      )}

      {/* --- Workflow History Modal --- */}
      {historyTarget && (
        <ModalOverlay onClose={() => setHistoryTarget(null)}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>
            Workflow History: {historyTarget.title || historyTarget.id}
          </h3>
          {(!historyTarget.workflowHistory || historyTarget.workflowHistory.length === 0) ? (
            <p style={{ fontSize: '13px', color: 'var(--theme-elevation-400)' }}>No history entries</p>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {[...historyTarget.workflowHistory].reverse().map((entry, idx) => {
                const userName = typeof entry.user === 'object'
                  ? (entry.user?.firstName || entry.user?.email || 'System')
                  : (entry.user || 'System')

                return (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '10px 0',
                      borderBottom: idx < (historyTarget.workflowHistory?.length ?? 0) - 1
                        ? '1px solid var(--theme-elevation-100)' : 'none',
                    }}
                  >
                    {/* Timeline dot */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: STATE_COLORS[(entry.to as WorkflowState) || 'draft'],
                        marginTop: '4px',
                      }} />
                      {idx < (historyTarget.workflowHistory?.length ?? 0) - 1 && (
                        <div style={{ width: '2px', flex: 1, background: 'var(--theme-elevation-150)', marginTop: '4px' }} />
                      )}
                    </div>

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 500 }}>
                        <span style={{
                          padding: '1px 4px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'white',
                          background: STATE_COLORS[(entry.from as WorkflowState) || 'draft'],
                        }}>
                          {STATE_LABELS[(entry.from as WorkflowState) || 'draft']}
                        </span>
                        <span style={{ margin: '0 6px', color: 'var(--theme-elevation-400)' }}>→</span>
                        <span style={{
                          padding: '1px 4px',
                          borderRadius: '3px',
                          fontSize: '10px',
                          fontWeight: 600,
                          color: 'white',
                          background: STATE_COLORS[(entry.to as WorkflowState) || 'draft'],
                        }}>
                          {STATE_LABELS[(entry.to as WorkflowState) || 'draft']}
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--theme-elevation-400)', marginTop: '4px' }}>
                        by {userName}
                        {entry.date && ` · ${new Date(entry.date).toLocaleString()}`}
                      </div>
                      {entry.comment && (
                        <div style={{
                          marginTop: '6px',
                          padding: '6px 10px',
                          background: '#fef3c7',
                          border: '1px solid #fde68a',
                          borderRadius: '4px',
                          fontSize: '12px',
                          color: '#92400e',
                        }}>
                          &ldquo;{entry.comment}&rdquo;
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
            <ModalButton label="Close" onClick={() => setHistoryTarget(null)} />
          </div>
        </ModalOverlay>
      )}
    </div>
  )
}

