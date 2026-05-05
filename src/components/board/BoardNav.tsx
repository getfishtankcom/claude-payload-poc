/**
 * @description
 * Board navigation sidebar for Active Projects listing page.
 * Vertical list of board abbreviations (AcSB / PSAB / etc.) with active state highlighting.
 * On mobile (< 1024px), renders as a dropdown selector.
 *
 * Key features:
 * - "All Boards" option to show all projects
 * - Board selection filters the project list
 * - Active board synced with selection state
 * - Mobile: dropdown selector
 *
 * @dependencies
 * - None
 *
 * @notes
 * - Client component due to selection state
 * - RASOC excluded (oversight council, no active projects)
 */
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'

export type BoardNavItem = {
  id: string | number
  name: string
  slug: string
  abbreviation: string
}

/** Same closed-set lookup used by BoardLanding — the Boards collection's
    `abbreviation` field isn't `localized: true`, so it always returns the
    EN value. Maps EN abbreviation → i18n key under `boards.abbreviations.*`
    so the displayed label is locale-aware. */
const KNOWN_BOARDS = new Set(['acsb', 'psab', 'aasb', 'cssb', 'rasoc'])

function localizedBoardLabel(
  board: { abbreviation: string; name: string },
  t: (key: string) => string,
): string {
  const key = (board.abbreviation || '').toLowerCase()
  if (!KNOWN_BOARDS.has(key)) return board.abbreviation || board.name
  // next-intl returns the key path when an entry is missing; never let
  // `abbreviations.acsb` literal leak through to the UI.
  const lookupKey = `abbreviations.${key}`
  const value = t(lookupKey)
  return value && value !== lookupKey ? value : board.abbreviation || board.name
}

type BoardNavProps = {
  /** Board items from CMS */
  boards: BoardNavItem[]
  /** Currently selected board slug, or null for "All Boards" */
  activeBoard: string | null
  /** Called when a board is selected */
  onBoardSelect: (slug: string | null) => void
  className?: string
}

export function BoardNav({
  boards,
  activeBoard,
  onBoardSelect,
  className = '',
}: BoardNavProps) {
  const tBoards = useTranslations('boards')
  const tNav = useTranslations('nav')
  const tFilters = useTranslations('filters')

  return (
    <nav
      className={`${className}`.trim()}
      data-testid="board-nav"
      aria-label={tBoards('boardNavLabel')}
    >
      {/* Desktop: vertical nav list (hidden below lg) */}
      <div className="hidden lg:block sticky top-8">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          {tNav('boards')}
        </h2>
        <ul className="space-y-1" role="list">
          <li>
            <button
              type="button"
              onClick={() => onBoardSelect(null)}
              className={`block w-full rounded-r-md py-2.5 text-left text-sm transition-colors cursor-pointer ${
                activeBoard === null
                  ? 'border-l-4 border-primary bg-primary/5 pl-3 pr-4 text-primary font-semibold'
                  : 'border-l-4 border-transparent pl-4 pr-4 text-text-primary hover:border-primary/30 hover:bg-gray-50 hover:text-primary'
              }`}
              aria-current={activeBoard === null ? 'true' : undefined}
              data-testid="board-nav-all"
            >
              {tFilters('allBoards')}
            </button>
          </li>
          {boards.map((board) => (
            <li key={board.slug}>
              <button
                type="button"
                onClick={() => onBoardSelect(board.slug)}
                className={`block w-full rounded-r-md py-2.5 text-left text-sm transition-colors cursor-pointer ${
                  activeBoard === board.slug
                    ? 'border-l-4 border-primary bg-primary/5 pl-3 pr-4 text-primary font-semibold'
                    : 'border-l-4 border-transparent pl-4 pr-4 text-text-primary hover:border-primary/30 hover:bg-gray-50 hover:text-primary'
                }`}
                aria-current={activeBoard === board.slug ? 'true' : undefined}
                data-testid={`board-nav-${board.slug}`}
              >
                {localizedBoardLabel(board, tBoards)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: dropdown selector (visible below lg) */}
      <div className="lg:hidden">
        <label htmlFor="board-select" className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
          {tBoards('filterByBoard')}
        </label>
        <select
          id="board-select"
          value={activeBoard || ''}
          onChange={(e) => onBoardSelect(e.target.value || null)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
          data-testid="board-nav-mobile"
        >
          <option value="">{tFilters('allBoards')}</option>
          {boards.map((board) => (
            <option key={board.slug} value={board.slug}>
              {board.abbreviation || board.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}
