/**
 * @description
 * Preview renderers for Data-Driven Widget components (9 total).
 * These show admin previews with Dynamic/Manual badges and
 * representative placeholder layouts.
 *
 * Key features:
 * - Each shows a "Dynamic" or "Manual" badge based on dataSource prop
 * - Project List, News Feed, Event Calendar show list/card layouts
 * - Document Table shows table with filter row
 * - Contact Card, Board Members Grid show people layouts
 * - Standards List, Effective Dates Table show grouped list/table layouts
 *
 * @dependencies
 * - None (pure presentational components)
 *
 * @notes
 * - Data-driven widgets inherit dataSourceFields from props-schema.ts
 * - All widgets show placeholder data in preview mode
 */
'use client'

import React from 'react'
import type { ComponentPreviewProps } from './PreviewRenderer'

// ---------------------------------------------------------------------------
// Shared badge component
// ---------------------------------------------------------------------------

function DataSourceBadge({ dataSource }: { dataSource?: string }) {
  const isDynamic = dataSource !== 'manual'
  return (
    <span
      className={`inline-flex items-center px-1.5 py-0.5 text-xs rounded font-medium ${
        isDynamic ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
      }`}
    >
      {isDynamic ? 'Dynamic' : 'Manual'}
    </span>
  )
}

// ---------------------------------------------------------------------------
// Project List
// ---------------------------------------------------------------------------

export function ProjectListPreview({ props, compact }: ComponentPreviewProps) {
  const displayStyle = (props.displayStyle as string) || 'cards'

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Projects</span>
          <DataSourceBadge dataSource={props.dataSource as string} />
        </div>
        {displayStyle === 'cards' ? (
          <div className="grid grid-cols-2 gap-1">
            {[1, 2].map((i) => (
              <div key={i} className="border border-gray-200 rounded p-1">
                <div className="h-1.5 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            {[1, 2].map((i) => (
              <div key={i} className="h-2 bg-gray-100 rounded" />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Project List</span>
        <DataSourceBadge dataSource={props.dataSource as string} />
      </div>
      {displayStyle === 'cards' ? (
        <div className="grid grid-cols-2 gap-2">
          {['Active Project A', 'Active Project B', 'Completed Project C'].map((name, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-2">
              <div className="text-xs font-medium text-gray-700">{name}</div>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-green-400' : 'bg-gray-300'}`} />
                <span className="text-xs text-gray-400">{i < 2 ? 'Active' : 'Completed'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {['Active Project A', 'Active Project B'].map((name, i) => (
            <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100">
              <span className="text-xs text-gray-700">{name}</span>
              <span className="text-xs text-green-600">Active</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// News Feed
// ---------------------------------------------------------------------------

export function NewsFeedPreview({ props, compact }: ComponentPreviewProps) {
  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">News</span>
          <DataSourceBadge dataSource={props.dataSource as string} />
        </div>
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-1">
              <div className="w-1 bg-blue-300 rounded flex-shrink-0" />
              <div className="h-1.5 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">News Feed</span>
        <DataSourceBadge dataSource={props.dataSource as string} />
      </div>
      <div className="space-y-3">
        {['New Standard Released', 'Board Meeting Summary', 'Consultation Period Opens'].map((title, i) => (
          <div key={i} className="flex gap-2 pb-2 border-b border-gray-100 last:border-0">
            <div className="w-1 bg-blue-400 rounded flex-shrink-0" />
            <div>
              <div className="text-xs font-medium text-gray-700">{title}</div>
              <div className="text-xs text-gray-400 mt-0.5">Mar {6 - i}, 2026</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Event Calendar
// ---------------------------------------------------------------------------

export function EventCalendarPreview({ props, compact }: ComponentPreviewProps) {
  const displayStyle = (props.displayStyle as string) || 'list'

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Events</span>
          <DataSourceBadge dataSource={props.dataSource as string} />
        </div>
        <div className="space-y-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-1.5">
              <div className="w-5 h-5 bg-blue-100 rounded text-center leading-5 text-xs text-blue-600 font-medium flex-shrink-0">
                {10 + i}
              </div>
              <div className="h-1.5 bg-gray-200 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Events</span>
        <DataSourceBadge dataSource={props.dataSource as string} />
      </div>
      {displayStyle === 'calendar' ? (
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-xs text-gray-400 font-medium">{d}</div>
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              className={`text-center text-xs py-1 rounded ${
                i === 5 || i === 9 ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-500'
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {[
            { date: 'Mar 11', title: 'Board Meeting', type: 'meeting' },
            { date: 'Mar 15', title: 'Webinar: Standards Update', type: 'webinar' },
            { date: 'Mar 20', title: 'Comment Deadline', type: 'deadline' },
          ].map((event, i) => (
            <div key={i} className="flex items-start gap-2 pb-2 border-b border-gray-100 last:border-0">
              <div className="w-10 h-10 bg-blue-50 rounded flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-xs text-blue-600 font-bold">{event.date.split(' ')[1]}</span>
                <span className="text-xs text-blue-400">{event.date.split(' ')[0]}</span>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-700">{event.title}</div>
                <div className="text-xs text-gray-400">{event.type}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Document Table
// ---------------------------------------------------------------------------

export function DocumentTablePreview({ props, compact }: ComponentPreviewProps) {
  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Documents</span>
          <DataSourceBadge dataSource={props.dataSource as string} />
        </div>
        <div className="border border-gray-200 rounded overflow-hidden">
          <div className="flex bg-gray-50 px-1 py-0.5">
            <div className="h-1.5 bg-gray-200 rounded w-1/2" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="flex px-1 py-0.5 border-t border-gray-100">
              <div className="h-1.5 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Document Table</span>
        <DataSourceBadge dataSource={props.dataSource as string} />
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600">
          <span className="flex-1">Title</span>
          <span className="w-20 text-center">Type</span>
          <span className="w-20 text-right">Date</span>
        </div>
        {['Discussion Paper on IFRS 17', 'Exposure Draft ED-123', 'Guidance Note GN-45'].map((title, i) => (
          <div key={i} className="flex items-center px-3 py-2 border-t border-gray-100 text-xs">
            <span className="flex-1 text-gray-700 truncate">{title}</span>
            <span className="w-20 text-center text-gray-400">PDF</span>
            <span className="w-20 text-right text-gray-400">2026-0{i + 1}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Contact Card
// ---------------------------------------------------------------------------

export function ContactCardPreview({ props, compact }: ComponentPreviewProps) {
  const layout = (props.layout as string) || 'card'

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xs text-gray-500">👤</span>
        </div>
        <div>
          <div className="h-1.5 bg-gray-200 rounded w-16" />
          <div className="h-1 bg-gray-100 rounded w-12 mt-0.5" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className={`${layout === 'card' ? 'border border-gray-200 rounded-lg p-4' : ''} flex items-start gap-3`}>
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-lg text-gray-400">👤</span>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-700">Contact Name, CPA</div>
          <div className="text-xs text-gray-500">Director, Standards</div>
          <div className="text-xs text-blue-500 mt-1">email@frascanada.ca</div>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Board Members Grid
// ---------------------------------------------------------------------------

export function BoardMembersGridPreview({ props, compact }: ComponentPreviewProps) {
  const columns = (props.columns as number) || 3

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Members</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 text-center">
              <div className="w-5 h-5 bg-gray-200 rounded-full mx-auto" />
              <div className="h-1 bg-gray-100 rounded w-3/4 mx-auto mt-0.5" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="text-sm font-semibold text-gray-700 mb-3">Board Members</div>
      <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {['Jane Smith', 'John Doe', 'Alice Chen'].map((name, i) => (
          <div key={i} className="text-center">
            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-1" />
            <div className="text-xs font-medium text-gray-700">{name}</div>
            <div className="text-xs text-gray-400">Member</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Consultation Countdown
// ---------------------------------------------------------------------------

export function ConsultationCountdownPreview({ props, compact }: ComponentPreviewProps) {
  if (compact) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-1.5 text-center">
        <div className="text-xs text-red-600 font-bold">14 days left</div>
        <div className="text-xs text-red-400">Comment Period</div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <div className="text-xs text-red-500 uppercase tracking-wider font-medium mb-1">Comment Period Ends</div>
        <div className="flex justify-center gap-3">
          {[
            { num: '14', label: 'Days' },
            { num: '6', label: 'Hours' },
            { num: '23', label: 'Min' },
          ].map((unit, i) => (
            <div key={i} className="text-center">
              <div className="text-xl font-bold text-red-600">{unit.num}</div>
              <div className="text-xs text-red-400">{unit.label}</div>
            </div>
          ))}
        </div>
        {(props.showDescription as boolean) !== false && (
          <p className="text-xs text-gray-500 mt-2">Consultation on proposed changes...</p>
        )}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Standards List
// ---------------------------------------------------------------------------

export function StandardsListPreview({ props, compact }: ComponentPreviewProps) {
  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Standards</span>
          <DataSourceBadge dataSource={props.dataSource as string} />
        </div>
        <div className="space-y-0.5">
          {['Section 1', 'Section 2'].map((s, i) => (
            <div key={i} className="text-xs text-gray-500 pl-1 border-l-2 border-blue-300">{s}</div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Standards List</span>
        <DataSourceBadge dataSource={props.dataSource as string} />
      </div>
      <div className="space-y-3">
        {['IFRS Standards', 'ASPE Standards'].map((section, i) => (
          <div key={i}>
            <div className="text-xs font-semibold text-blue-600 mb-1 uppercase">{section}</div>
            <div className="space-y-1 pl-2 border-l-2 border-blue-200">
              {[`${section} - Part ${i * 2 + 1}`, `${section} - Part ${i * 2 + 2}`].map((item, j) => (
                <div key={j} className="text-xs text-gray-600">{item}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Effective Dates Table
// ---------------------------------------------------------------------------

export function EffectiveDatesTablePreview({ props, compact }: ComponentPreviewProps) {
  const headerColor = (props.sectionHeaderColor as string) || '#00438C'

  if (compact) {
    return (
      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-gray-600">Effective Dates</span>
          <DataSourceBadge dataSource={props.dataSource as string} />
        </div>
        <div className="border border-gray-200 rounded overflow-hidden">
          <div className="h-3 rounded-t" style={{ backgroundColor: headerColor }} />
          {[1, 2].map((i) => (
            <div key={i} className="flex px-1 py-0.5 border-t border-gray-100">
              <div className="h-1.5 bg-gray-100 rounded flex-1" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-gray-700">Effective Dates</span>
        <DataSourceBadge dataSource={props.dataSource as string} />
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="px-3 py-2 text-white text-xs font-semibold" style={{ backgroundColor: headerColor }}>
          Standards Section
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { standard: 'IFRS 17', date: 'Jan 1, 2025' },
            { standard: 'IFRS S1', date: 'Jan 1, 2026' },
            { standard: 'ASPE 3041', date: 'Apr 1, 2026' },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between px-3 py-2 text-xs">
              <span className="text-gray-700">{row.standard}</span>
              <span className="text-gray-500">{row.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
