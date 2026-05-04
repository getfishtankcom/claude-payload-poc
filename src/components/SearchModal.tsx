/**
 * @description
 * Full-screen overlay search modal with recent/popular tags.
 * Triggered from header search input or hero search bar.
 *
 * Key features:
 * - Large centered search input with placeholder
 * - Recent tags from localStorage (user's search history)
 * - Popular tags from CMS search-config global (passed as props)
 * - "Search" navigates to /search?q={query}; "Cancel" closes modal
 * - Escape key closes modal; focus trapped inside
 * - Dimmed backdrop with smooth transition
 *
 * @dependencies
 * - TagChip: Pill-style tag components for recent/popular tags
 * - Button: Primary (Search) and secondary (Cancel) actions
 * - @heroicons/react: MagnifyingGlassIcon for search input
 * - next/navigation: useRouter for programmatic navigation
 *
 * @notes
 * - Client component due to state management and event listeners
 * - Recent tags stored in localStorage key 'fras-recent-searches' (max 8)
 * - Popular tags come from CMS via props (fetched server-side in layout)
 * - Focus is trapped: Tab cycles between modal elements only
 * - Body scroll is locked when modal is open
 */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { TagChip } from '@/components/TagChip'
import { Button } from '@/components/ui'

const RECENT_SEARCHES_KEY = 'fras-recent-searches'
const MAX_RECENT_SEARCHES = 8

type PopularTag = {
  label: string
  query: string
  id?: string
}

type SearchModalProps = {
  /** Whether the modal is open */
  isOpen: boolean
  /** Callback to close the modal */
  onClose: () => void
  /** Popular tags from CMS search-config global */
  popularTags?: PopularTag[] | null
}

/** Reads recent searches from localStorage */
function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

/** Saves a search query to recent searches in localStorage */
function saveRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return
  try {
    const existing = getRecentSearches()
    // Remove duplicates and prepend new query
    const updated = [query.trim(), ...existing.filter((q) => q !== query.trim())].slice(
      0,
      MAX_RECENT_SEARCHES,
    )
    localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
  } catch {
    // localStorage unavailable — silently ignore
  }
}

export function SearchModal({ isOpen, onClose, popularTags }: SearchModalProps) {
  const t = useTranslations('search')
  const tCommon = useTranslations('common')
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Load recent searches when modal opens
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(getRecentSearches())
      // Focus input after a brief delay to allow animation
      setTimeout(() => inputRef.current?.focus(), 50)
    } else {
      setQuery('')
    }
  }, [isOpen])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle search submission
  const handleSearch = useCallback(() => {
    const trimmed = query.trim()
    if (!trimmed) return
    saveRecentSearch(trimmed)
    onClose()
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
  }, [query, onClose, router])

  // Handle tag click — populate query and search
  const handleTagClick = useCallback(
    (searchQuery: string) => {
      saveRecentSearch(searchQuery)
      onClose()
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    },
    [onClose, router],
  )

  // Keyboard handling: Escape to close, Enter to search
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Focus trap: keep focus within modal
  useEffect(() => {
    if (!isOpen || !modalRef.current) return

    function handleFocusTrap(e: KeyboardEvent) {
      if (e.key !== 'Tab' || !modalRef.current) return

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'input, button, a[href], [tabindex]:not([tabindex="-1"])',
      )
      if (focusableElements.length === 0) return

      const first = focusableElements[0]
      const last = focusableElements[focusableElements.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleFocusTrap)
    return () => document.removeEventListener('keydown', handleFocusTrap)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 pt-24 sm:pt-32"
      role="dialog"
      aria-modal="true"
      aria-label={t('modalAriaLabel')}
      data-testid="search-modal"
      onClick={(e) => {
        // Close when clicking backdrop
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={modalRef}
        className="mx-4 w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg sm:p-8"
        data-testid="search-modal-content"
      >
        {/* Close button */}
        <div className="mb-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-sm p-1 text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright"
            aria-label={t('closeAriaLabel')}
            data-testid="search-modal-close"
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {/* Search input */}
        <div className="relative mb-6">
          <MagnifyingGlassIcon
            className="absolute left-4 top-1/2 h-6 w-6 -translate-y-1/2 text-text-muted"
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch()
            }}
            placeholder={t('searchInputPlaceholder')}
            className="w-full rounded-sm border border-gray-300 bg-white py-3.5 pl-12 pr-4 text-lg placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
            data-testid="search-modal-input"
            aria-label={t('queryLabel')}
          />
        </div>

        {/* Tags sections */}
        <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div data-testid="search-modal-recent">
              <h3 className="mb-3 text-sm font-semibold text-text-heading">{t('recentSearches')}</h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <TagChip
                    key={term}
                    label={term}
                    onClick={() => handleTagClick(term)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Popular tags from CMS */}
          {popularTags && popularTags.length > 0 && (
            <div data-testid="search-modal-popular">
              <h3 className="mb-3 text-sm font-semibold text-text-heading">{t('popularTags')}</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <TagChip
                    key={tag.id || tag.query}
                    label={tag.label}
                    onClick={() => handleTagClick(tag.query)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3">
          <Button
            variant="secondary"
            size="md"
            onClick={onClose}
            data-testid="search-modal-cancel"
          >
            {tCommon('cancel')}
          </Button>
          <Button
            variant="dark"
            size="md"
            onClick={handleSearch}
            disabled={!query.trim()}
            data-testid="search-modal-submit"
          >
            {t('searchButton')}
          </Button>
        </div>
      </div>
    </div>
  )
}
