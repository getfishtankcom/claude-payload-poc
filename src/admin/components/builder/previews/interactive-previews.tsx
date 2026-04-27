/**
 * @description
 * Preview renderers for Interactive Element components (5 total).
 * These show admin previews of search bars, filters, newsletter forms,
 * download buttons, and anchor links.
 *
 * Key features:
 * - Search Bar: rounded input mockup with placeholder text
 * - Filter Panel: facet checkboxes
 * - Newsletter Signup: heading + email input + subscribe button
 * - Download Button: styled button with icon
 * - Anchor Link: visible heading or invisible marker
 *
 * @dependencies
 * - None (pure presentational components)
 *
 * @notes
 * - These are non-functional previews — no actual interactivity
 */
'use client'

import React from 'react'
import type { ComponentPreviewProps } from './PreviewRenderer'

// ---------------------------------------------------------------------------
// Search Bar
// ---------------------------------------------------------------------------

export function SearchBarPreview({ props, compact }: ComponentPreviewProps) {
  const placeholder = (props.placeholder as string) || 'Search...'
  const scope = (props.scope as string) || 'all'

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-full px-2 py-1">
        <span className="text-gray-400 text-xs">🔍</span>
        <span className="text-xs text-gray-400">{placeholder}</span>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-2.5 shadow-sm">
        <span className="text-gray-400">🔍</span>
        <span className="text-sm text-gray-400 flex-1">{placeholder}</span>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          {scope === 'all' ? 'All' : scope === 'board' ? 'Board' : 'Projects'}
        </span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Filter Panel
// ---------------------------------------------------------------------------

export function FilterPanelPreview({ props, compact }: ComponentPreviewProps) {
  const facets = (props.facets as Array<{ name?: string; type?: string }>) || []
  const layout = (props.layout as string) || 'vertical'

  const displayFacets = facets.length > 0
    ? facets
    : [{ name: 'Board', type: 'board' }, { name: 'Type', type: 'type' }, { name: 'Date', type: 'date-range' }]

  if (compact) {
    return (
      <div className={`flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'} gap-1`}>
        {displayFacets.slice(0, 3).map((facet, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-gray-400 text-xs">🔽</span>
            <span className="text-xs text-gray-500">{facet.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="text-sm font-semibold text-gray-700 mb-2">Filters</div>
      <div className={`${layout === 'horizontal' ? 'flex gap-4' : 'space-y-3'}`}>
        {displayFacets.map((facet, i) => (
          <div key={i}>
            <div className="text-xs font-medium text-gray-600 mb-1">{facet.name}</div>
            <div className="space-y-1">
              {['Option A', 'Option B'].map((opt, j) => (
                <label key={j} className="flex items-center gap-1.5 text-xs text-gray-500 cursor-default">
                  <div className="w-3 h-3 border border-gray-300 rounded" />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Newsletter Signup
// ---------------------------------------------------------------------------

export function NewsletterSignupPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Stay Updated'
  const description = props.description as string | undefined
  const buttonText = (props.buttonText as string) || 'Subscribe'

  if (compact) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded p-2">
        <div className="text-xs font-medium text-blue-700 mb-1">{heading}</div>
        <div className="flex gap-1">
          <div className="flex-1 bg-white border border-gray-200 rounded px-1.5 py-0.5 text-xs text-gray-400">
            email@...
          </div>
          <div className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded">{buttonText}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-800">{heading}</h4>
        {description && <p className="text-xs text-blue-600 mt-0.5">{description}</p>}
        <div className="flex gap-2 mt-3">
          <div className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-400">
            Enter your email...
          </div>
          <button className="bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg">
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Download Button
// ---------------------------------------------------------------------------

export function DownloadButtonPreview({ props, compact }: ComponentPreviewProps) {
  const buttonText = (props.buttonText as string) || 'Download'
  const variant = (props.variant as string) || 'primary'

  const variantClasses: Record<string, string> = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-600 text-white',
    outline: 'bg-white text-gray-700 border border-gray-300',
  }

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs ${variantClasses[variant] ?? variantClasses.primary}`}>
        <span>⬇</span>
        <span>{buttonText}</span>
      </div>
    )
  }

  return (
    <div className="p-3 flex justify-center">
      <button className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium ${variantClasses[variant] ?? variantClasses.primary}`}>
        <span>⬇</span>
        <span>{buttonText}</span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Anchor Link
// ---------------------------------------------------------------------------

export function AnchorLinkPreview({ props, compact }: ComponentPreviewProps) {
  const anchorId = (props.anchorId as string) || 'section'
  const display = (props.display as string) || 'invisible'

  if (compact) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-400">🔗</span>
        <span className="text-xs text-gray-500 font-mono">#{anchorId}</span>
        {display === 'invisible' && (
          <span className="text-xs text-gray-300 italic">hidden</span>
        )}
      </div>
    )
  }

  return (
    <div className="p-3">
      {display === 'visible' ? (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">🔗</span>
          <span className="text-sm font-medium text-gray-700">#{anchorId}</span>
        </div>
      ) : (
        <div className="flex items-center gap-2 py-2 border border-dashed border-gray-200 rounded-lg justify-center">
          <span className="text-gray-300">🔗</span>
          <span className="text-xs text-gray-400 font-mono">#{anchorId}</span>
          <span className="text-xs text-gray-300">(invisible anchor)</span>
        </div>
      )}
    </div>
  )
}
