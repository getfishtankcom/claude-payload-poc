/**
 * @description
 * Grouped table component with gray banner section headers and alternating row backgrounds.
 * Renders data in groups with a heading banner per group and dashed borders between rows.
 *
 * Key features:
 * - Gray banner section headers (full-width, #f0f0f0 bg, bold text)
 * - Alternating white/light gray data row backgrounds
 * - Dashed border between rows within same group
 * - Empty groups are not rendered
 * - Render prop pattern for row content
 *
 * @dependencies
 * - Design tokens from globals.css: --color-group-header (#F0F0F0), --color-row-alt
 *
 * @notes
 * - Server component — no client-side state
 * - Generic typing via renderRow prop for flexible row content
 */
import React from 'react'

type GroupData<T> = {
  /** Group heading text displayed in the banner */
  heading: string
  /** Array of row data items */
  rows: T[]
}

type GroupedTableProps<T> = {
  /** Array of groups, each with a heading and rows */
  groups: GroupData<T>[]
  /** Render function for each row */
  renderRow: (row: T, index: number) => React.ReactNode
  className?: string
}

export function GroupedTable<T>({ groups, renderRow, className = '' }: GroupedTableProps<T>) {
  // Filter out empty groups
  const nonEmptyGroups = groups.filter((group) => group.rows.length > 0)

  if (nonEmptyGroups.length === 0) {
    return (
      <div className="py-8 text-center text-text-muted" data-testid="grouped-table-empty">
        No items found
      </div>
    )
  }

  return (
    <div
      className={`overflow-hidden rounded-sm border border-gray-200 ${className}`.trim()}
      data-testid="grouped-table"
    >
      {nonEmptyGroups.map((group) => (
        <div key={group.heading} data-testid={`group-${group.heading.toLowerCase().replace(/\s+/g, '-')}`}>
          {/* Group header banner */}
          <div
            className="bg-group-header px-4 py-3 text-sm font-bold text-text-primary"
            data-testid="group-header"
          >
            {group.heading}
          </div>

          {/* Rows */}
          {group.rows.map((row, index) => (
            <div
              key={index}
              className={`px-4 py-3 ${
                index % 2 === 1 ? 'bg-row-alt' : 'bg-white'
              } ${index > 0 ? 'border-t border-dashed border-gray-300' : ''}`}
              data-testid="group-row"
            >
              {renderRow(row, index)}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
