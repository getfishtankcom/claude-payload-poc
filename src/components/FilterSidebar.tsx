/**
 * @description
 * Collapsible accordion filter sidebar for the Search Results page.
 * 5 filter sections: Board, Standard, Files & Media, Content Type, Date.
 *
 * Key features:
 * - Each section is a collapsible accordion with active filter count badge
 * - Board: 4 checkboxes (CSSB, AcSB, PSAB, AASB)
 * - Standard: grouped checkboxes under 4 categories
 * - Files & Media: checkboxes (All, PDF, Word, Video)
 * - Content Type: checkboxes for all content types
 * - Date: radio buttons (Last 30 days, Last 3 months, Last year, All time)
 * - "Clear All" link resets all filters
 * - Mobile: renders as stacked accordions above results
 *
 * @dependencies
 * - @heroicons/react: ChevronDownIcon for accordion toggles
 * - react-instantsearch: useRefinementList, useRange for Meilisearch facets
 *
 * @notes
 * - Client component due to accordion state and filter interactions
 * - Filter state is managed locally; wiring to react-instantsearch happens
 *   in the search page via callbacks
 * - data-filter-section attribute on each section for test selection
 */
'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

type FilterOption = {
  label: string
  value: string
  count?: number
}

type FilterSection = {
  id: string
  label: string
  type: 'checkbox' | 'radio'
  options: FilterOption[]
}

type FilterSidebarProps = {
  /** Currently active filter values keyed by section id */
  activeFilters?: Record<string, string[]>
  /** Called when a filter changes: (sectionId, values) */
  onFilterChange?: (sectionId: string, values: string[]) => void
  /** Called when "Clear All" is clicked */
  onClearAll?: () => void
  className?: string
}

/**
 * Section IDs are stable (used as filter keys + accordion-open state).
 * Section header labels are looked up against the `filters` namespace at
 * render time so they translate; option labels remain content-side and
 * are not translated in this PR (tracked as a follow-up — they're values
 * the user sends back to Meilisearch and would need a value-vs-label
 * split to translate safely).
 */
const SECTION_HEADER_KEYS: Record<string, string> = {
  board: 'byBoard',
  standard: 'byStandard',
  file_type: 'filesMedia',
  content_type: 'contentType',
  date: 'date',
}

const DEFAULT_SECTIONS: FilterSection[] = [
  {
    id: 'board',
    label: 'By Board',
    type: 'checkbox',
    options: [
      { label: 'CSSB', value: 'CSSB' },
      { label: 'AcSB', value: 'AcSB' },
      { label: 'PSAB', value: 'PSAB' },
      { label: 'AASB', value: 'AASB' },
    ],
  },
  {
    id: 'standard',
    label: 'By Standard',
    type: 'checkbox',
    options: [
      { label: 'CSDS (Sustainability)', value: 'CSDS' },
      { label: 'IFRS (Part I)', value: 'IFRS' },
      { label: 'ASPE (Part II)', value: 'ASPE' },
      { label: 'NFP (Part III)', value: 'NFP' },
      { label: 'Pension (Part IV)', value: 'Pension' },
      { label: 'Public Sector', value: 'Public Sector' },
      { label: 'Assurance', value: 'Assurance' },
    ],
  },
  {
    id: 'file_type',
    label: 'Files & Media',
    type: 'checkbox',
    options: [
      { label: 'All', value: 'all' },
      { label: 'PDF Files', value: 'pdf' },
      { label: 'Word Documents', value: 'word' },
      { label: 'Video', value: 'video' },
    ],
  },
  {
    id: 'content_type',
    label: 'Content Type',
    type: 'checkbox',
    options: [
      { label: 'Project', value: 'project' },
      { label: 'News', value: 'news' },
      { label: 'Document for Comment', value: 'document-for-comment' },
      { label: 'Resource', value: 'resource' },
      { label: 'Guidance', value: 'guidance' },
      { label: 'Articles', value: 'articles' },
      { label: 'Decision Summaries', value: 'decision-summaries' },
      { label: 'Webinar', value: 'webinar' },
    ],
  },
  {
    id: 'date',
    label: 'Date',
    type: 'radio',
    options: [
      { label: 'Last 30 days', value: '30d' },
      { label: 'Last 3 months', value: '3m' },
      { label: 'Last year', value: '1y' },
      { label: 'All time', value: 'all' },
    ],
  },
]

/** Single accordion section */
function AccordionSection({
  section,
  activeValues,
  isOpen,
  onToggle,
  onFilterChange,
  headerLabel,
}: {
  section: FilterSection
  activeValues: string[]
  isOpen: boolean
  onToggle: () => void
  onFilterChange: (sectionId: string, values: string[]) => void
  headerLabel: string
}) {
  const activeCount = activeValues.length

  function handleCheckboxChange(value: string, checked: boolean) {
    if (checked) {
      onFilterChange(section.id, [...activeValues, value])
    } else {
      onFilterChange(
        section.id,
        activeValues.filter((v) => v !== value),
      )
    }
  }

  function handleRadioChange(value: string) {
    onFilterChange(section.id, [value])
  }

  return (
    <div className="border-b border-gray-200" data-filter-section={section.id}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-text-heading hover:bg-gray-50 cursor-pointer"
        aria-expanded={isOpen}
        data-testid={`filter-toggle-${section.id}`}
      >
        <span>
          {headerLabel}
          {activeCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={`h-4 w-4 text-text-muted transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-3 space-y-2">
          {section.options.map((option) => {
            const inputId = `filter-${section.id}-${option.value}`
            return (
              <label
                key={option.value}
                htmlFor={inputId}
                className="flex items-center gap-2 text-sm text-text-primary cursor-pointer"
              >
                {section.type === 'checkbox' ? (
                  <input
                    id={inputId}
                    name={`${section.id}[]`}
                    value={option.value}
                    type="checkbox"
                    checked={activeValues.includes(option.value)}
                    onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                    className="h-6 w-6 rounded border-gray-300 text-primary focus:ring-primary-bright"
                  />
                ) : (
                  <input
                    id={inputId}
                    name={section.id}
                    value={option.value}
                    type="radio"
                    checked={activeValues.includes(option.value)}
                    onChange={() => handleRadioChange(option.value)}
                    className="h-6 w-6 border-gray-300 text-primary focus:ring-primary-bright"
                  />
                )}
                <span className="min-w-0 break-words">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-text-muted">({option.count})</span>
                )}
              </label>
            )
          })}
        </div>
      )}
    </div>
  )
}

export function FilterSidebar({
  activeFilters = {},
  onFilterChange,
  onClearAll,
  className = '',
}: FilterSidebarProps) {
  const tSearch = useTranslations('search')
  const tFilters = useTranslations('filters')
  const tCommon = useTranslations('common')

  // Track which accordion sections are open (all open by default)
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(DEFAULT_SECTIONS.map((s) => s.id)),
  )

  const totalActiveFilters = Object.values(activeFilters).reduce(
    (sum, values) => sum + values.length,
    0,
  )

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  function handleFilterChange(sectionId: string, values: string[]) {
    onFilterChange?.(sectionId, values)
  }

  return (
    <aside
      className={`rounded-sm border border-gray-200 bg-white ${className}`.trim()}
      data-testid="filter-sidebar"
      aria-label={tSearch('filtersAriaLabel')}
    >
      {/* Header with Clear All */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <h2 className="text-sm font-bold text-text-heading">{tSearch('filters')}</h2>
        {totalActiveFilters > 0 && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm text-primary hover:text-primary-vivid cursor-pointer"
            data-testid="filter-clear-all"
          >
            {tCommon('clearAll')}
          </button>
        )}
      </div>

      {/* Filter sections */}
      {DEFAULT_SECTIONS.map((section) => (
        <AccordionSection
          key={section.id}
          section={section}
          activeValues={activeFilters[section.id] || []}
          isOpen={openSections.has(section.id)}
          onToggle={() => toggleSection(section.id)}
          onFilterChange={handleFilterChange}
          headerLabel={tFilters(SECTION_HEADER_KEYS[section.id] ?? 'category')}
        />
      ))}
    </aside>
  )
}
