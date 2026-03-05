/**
 * @description
 * Client component for Open Consultations listing page.
 * Manages text search, board dropdown, and standard dropdown filtering.
 *
 * Key features:
 * - Text search input for filtering by consultation name
 * - Board dropdown filter
 * - Standard dropdown filter
 * - Consultation cards sorted by deadline (soonest first)
 * - Empty state when no consultations match filters
 *
 * @dependencies
 * - ConsultationCard component
 * - @heroicons/react: MagnifyingGlassIcon
 *
 * @notes
 * - Client component due to filter state management
 * - All data passed from server component parent
 * - Sorting done server-side; client only filters
 */
'use client'

import React, { useState, useMemo } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { ConsultationCard } from '@/components/board/ConsultationCard'
import type { ConsultationCardData } from '@/components/board/ConsultationCard'

type FilterOption = {
  id: string
  name: string
  slug: string
}

type ConsultationWithFilters = ConsultationCardData & {
  boardSlugFilter: string
  standardIdFilter?: string | null
}

type OpenConsultationsClientProps = {
  consultations: ConsultationWithFilters[]
  boards: FilterOption[]
  standards: FilterOption[]
}

export function OpenConsultationsClient({
  consultations,
  boards,
  standards,
}: OpenConsultationsClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBoard, setSelectedBoard] = useState<string>('')
  const [selectedStandard, setSelectedStandard] = useState<string>('')

  const filteredConsultations = useMemo(() => {
    return consultations.filter((c) => {
      if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedBoard && c.boardSlugFilter !== selectedBoard) return false
      if (selectedStandard && c.standardIdFilter !== selectedStandard) return false
      return true
    })
  }, [consultations, searchQuery, selectedBoard, selectedStandard])

  return (
    <div
      className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8"
      data-testid="page-open-consultations"
    >
      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
          <input
            type="text"
            placeholder="Filter consultations by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary"
            data-testid="consultation-search"
          />
        </div>
        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary md:w-auto md:max-w-[220px]"
          data-testid="board-filter"
          aria-label="Filter by board"
        >
          <option value="">All Boards</option>
          {boards.map((b) => (
            <option key={b.id} value={b.slug}>
              {b.name}
            </option>
          ))}
        </select>
        <select
          value={selectedStandard}
          onChange={(e) => setSelectedStandard(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary md:w-auto md:max-w-[220px]"
          data-testid="standard-filter"
          aria-label="Filter by standard"
        >
          <option value="">All Standards</option>
          {standards.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Consultation cards list */}
      {filteredConsultations.length === 0 ? (
        <div className="py-12 text-center text-text-muted">
          <p>No open consultations found matching your filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredConsultations.map((consultation) => (
            <ConsultationCard
              key={consultation.id}
              consultation={consultation}
            />
          ))}
        </div>
      )}
    </div>
  )
}
