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

export type BoardNavItem = {
  id: string | number
  name: string
  slug: string
  abbreviation: string
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
  return (
    <nav
      className={`${className}`.trim()}
      data-testid="board-nav"
      aria-label="Filter by board"
    >
      {/* Desktop: vertical nav list (hidden below lg) */}
      <div className="hidden lg:block sticky top-8">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-text-muted">
          Boards
        </h2>
        <ul className="space-y-1" role="list">
          <li>
            <button
              type="button"
              onClick={() => onBoardSelect(null)}
              className={`block w-full text-left rounded-md px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                activeBoard === null
                  ? 'bg-primary text-white font-semibold'
                  : 'text-text-primary hover:bg-gray-50 hover:text-primary'
              }`}
              aria-current={activeBoard === null ? 'true' : undefined}
              data-testid="board-nav-all"
            >
              All Boards
            </button>
          </li>
          {boards.map((board) => (
            <li key={board.slug}>
              <button
                type="button"
                onClick={() => onBoardSelect(board.slug)}
                className={`block w-full text-left rounded-md px-4 py-2.5 text-sm transition-colors cursor-pointer ${
                  activeBoard === board.slug
                    ? 'bg-primary text-white font-semibold'
                    : 'text-text-primary hover:bg-gray-50 hover:text-primary'
                }`}
                aria-current={activeBoard === board.slug ? 'true' : undefined}
                data-testid={`board-nav-${board.slug}`}
              >
                {board.abbreviation || board.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: dropdown selector (visible below lg) */}
      <div className="lg:hidden">
        <label htmlFor="board-select" className="mb-2 block text-xs font-bold uppercase tracking-wider text-text-muted">
          Filter by Board
        </label>
        <select
          id="board-select"
          value={activeBoard || ''}
          onChange={(e) => onBoardSelect(e.target.value || null)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
          data-testid="board-nav-mobile"
        >
          <option value="">All Boards</option>
          {boards.map((board) => (
            <option key={board.slug} value={board.slug}>
              {board.name}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}
