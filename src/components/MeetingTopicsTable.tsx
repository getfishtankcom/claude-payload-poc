/**
 * @description
 * Meeting agenda topics table component.
 * Displays topic, description, and status/outcome in a responsive table.
 *
 * Key features:
 * - 3 columns: Topic, Description, Status/Outcome
 * - Responsive: table on desktop, stacked cards on mobile
 * - Accessible with proper table semantics
 *
 * @dependencies
 * - None (pure presentational component)
 *
 * @notes
 * - Used on Meeting Detail pages
 * - Separate from Effective Dates Table and Event Summary Table
 */
import React from 'react'

type MeetingTopic = {
  topic: string
  description: string
  status: string
}

type MeetingTopicsTableProps = {
  topics: MeetingTopic[]
  'data-testid'?: string
}

export function MeetingTopicsTable({ topics, ...props }: MeetingTopicsTableProps) {
  if (topics.length === 0) {
    return (
      <p className="text-text-muted italic" data-testid={props['data-testid']}>
        No agenda topics available.
      </p>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block" data-testid={props['data-testid'] || 'meeting-topics-table'}>
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-300 text-left">
              <th className="px-4 py-3 font-semibold text-text-primary">Topic</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Description</th>
              <th className="px-4 py-3 font-semibold text-text-primary">Status/Outcome</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((topic, i) => (
              <tr key={i} className="border-b border-gray-200 even:bg-surface-subtle">
                <td className="px-4 py-3 font-medium text-text-primary">{topic.topic}</td>
                <td className="px-4 py-3 text-text-secondary">{topic.description}</td>
                <td className="px-4 py-3 text-text-secondary">{topic.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="flex flex-col gap-4 md:hidden" data-testid={`${props['data-testid'] || 'meeting-topics-table'}-mobile`}>
        {topics.map((topic, i) => (
          <div key={i} className="rounded-md border border-gray-200 p-4">
            <p className="font-semibold text-text-primary">{topic.topic}</p>
            <p className="mt-1 text-sm text-text-secondary">{topic.description}</p>
            <p className="mt-2 text-xs font-medium uppercase text-text-muted">{topic.status}</p>
          </div>
        ))}
      </div>
    </>
  )
}
