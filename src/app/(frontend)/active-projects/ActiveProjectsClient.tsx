/**
 * @description
 * Client component for Active Projects listing page.
 * Manages board filtering, text search, standards dropdown, and collapsible groups.
 *
 * Key features:
 * - BoardNav sidebar for board filtering
 * - Text search input for filtering by project name
 * - Standards dropdown for narrowing by standard
 * - Projects grouped under collapsible standard headers
 * - Client-side filtering for responsive interactivity
 *
 * @dependencies
 * - BoardNav: Left sidebar board filter
 * - ProjectCard: Individual project card rendering
 * - @heroicons/react: ChevronDownIcon, MagnifyingGlassIcon
 *
 * @notes
 * - Client component due to filter state management
 * - All data passed from server component parent
 * - Grouping by standard — projects without a standard go into "Other"
 */
'use client'

import React, { useState, useMemo } from 'react'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { BoardNav } from '@/components/board/BoardNav'
import { ProjectCard } from '@/components/board/ProjectCard'
import type { BoardNavItem } from '@/components/board/BoardNav'
import type { ProjectCardData } from '@/components/board/ProjectCard'

type StandardInfo = {
  id: string | number
  name: string
  slug: string
}

type ProjectWithStandard = ProjectCardData & {
  standardName?: string | null
  standardId?: string | number | null
  boardSlugFilter: string
}

type ActiveProjectsClientProps = {
  boards: BoardNavItem[]
  projects: ProjectWithStandard[]
  standards: StandardInfo[]
}

export function ActiveProjectsClient({
  boards,
  projects,
  standards,
}: ActiveProjectsClientProps) {
  const [activeBoard, setActiveBoard] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStandard, setSelectedStandard] = useState<string>('')
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      if (activeBoard && p.boardSlugFilter !== activeBoard) return false
      if (searchQuery && !p.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      if (selectedStandard && String(p.standardId) !== selectedStandard) return false
      return true
    })
  }, [projects, activeBoard, searchQuery, selectedStandard])

  // Group by standard
  const groupedProjects = useMemo(() => {
    const groups: Record<string, ProjectWithStandard[]> = {}
    for (const project of filteredProjects) {
      const groupKey = project.standardName || 'Other Projects'
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(project)
    }
    return groups
  }, [filteredProjects])

  function toggleGroup(groupKey: string) {
    setCollapsedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(groupKey)) {
        next.delete(groupKey)
      } else {
        next.add(groupKey)
      }
      return next
    })
  }

  return (
    <div
      className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[240px_1fr] lg:px-8"
      data-testid="page-active-projects"
    >
      {/* Left sidebar: Board navigation */}
      <aside data-testid="sidebar-nav">
        <BoardNav
          boards={boards}
          activeBoard={activeBoard}
          onBoardSelect={setActiveBoard}
        />
      </aside>

      {/* Main content */}
      <main data-testid="main-content">
        {/* Filter bar */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" aria-hidden="true" />
            <input
              type="text"
              placeholder="Filter projects by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-primary focus:ring-1 focus:ring-primary"
              data-testid="project-search"
            />
          </div>
          <select
            value={selectedStandard}
            onChange={(e) => setSelectedStandard(e.target.value)}
            aria-label="Filter by standard"
            className="rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
            data-testid="standard-filter"
          >
            <option value="">All Standards</option>
            {standards.map((s) => (
              <option key={s.id} value={String(s.id)}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* Grouped project list */}
        {Object.keys(groupedProjects).length === 0 ? (
          <div className="py-12 text-center text-text-muted">
            <p>No projects found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedProjects).map(([groupName, groupProjects]) => {
              const isCollapsed = collapsedGroups.has(groupName)
              return (
                <div key={groupName} data-testid={`project-group-${groupName}`}>
                  {/* Collapsible group header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(groupName)}
                    className="flex w-full items-center justify-between rounded-sm bg-group-header px-4 py-3 text-left cursor-pointer"
                    aria-expanded={!isCollapsed}
                  >
                    <span className="text-sm font-bold text-text-heading">
                      {groupName}
                      <span className="ml-2 text-text-muted font-normal">
                        ({groupProjects.length})
                      </span>
                    </span>
                    <ChevronDownIcon
                      className={`h-4 w-4 text-text-muted transition-transform ${isCollapsed ? '' : 'rotate-180'}`}
                      aria-hidden="true"
                    />
                  </button>

                  {/* Project cards */}
                  {!isCollapsed && (
                    <div className="mt-3 space-y-3">
                      {groupProjects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
