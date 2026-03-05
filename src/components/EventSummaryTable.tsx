/**
 * @description
 * Tabular meeting/event summary component.
 * Displays date, topic, and decision/action in a responsive table.
 *
 * Key features:
 * - 3 columns: Date, Topic/Item, Decision/Action
 * - Responsive: table on desktop, stacked cards on mobile
 * - Accessible with proper table semantics
 *
 * @dependencies
 * - None (pure presentational component)
 *
 * @notes
 * - Replica of existing Summary Table from current Sitecore site
 * - Used on Event Summary Detail pages
 */
import React from 'react'

type EventSummaryRow = {
  date: string
  topic: string
  decision: string
}

type EventSummaryTableProps = {
  rows: EventSummaryRow[]
  'data-testid'?: string
}

export function EventSummaryTable({ rows, ...props }: EventSummaryTableProps) {
  if (rows.length === 0) {
    return (
      <p className="text-text-muted italic" data-testid={props['data-testid']}>
        No summary items available.
      </p>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block" data-testid={props['data-testid'] || 'event-summary-table'}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 text-left">
              <th className="px-4 py-3 font-semibold text-text-primary">Date</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Topic/Item</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Decision/Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b border-gray-200 even:bg-surface-subtle">
                <td className="px-4 py-3 text-text-secondary whitespace-nowrap">{row.date}</td>
                <td className="px-4 py-3 text-text-primary">{row.topic}</td>
                <td className="px-4 py-3 text-text-secondary">{row.decision}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-4 md:hidden" data-testid={`${props['data-testid'] || 'event-summary-table'}-mobile`}>
        {rows.map((row, i) => (
          <div key={i} className="rounded-md border border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase text-text-muted">{row.date}</p>
            <p className="mt-1 font-semibold text-text-primary">{row.topic}</p>
            <p className="mt-2 text-sm text-text-secondary">{row.decision}</p>
          </div>
        ))}
      </div>
    </>
  )
}
