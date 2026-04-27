/**
 * @description
 * Preview renderers for Content Block components (10 total).
 * These are lightweight admin-only visual approximations using Tailwind
 * utility classes. They render inside the canvas cards and inspector panel.
 *
 * Key features:
 * - Each renderer accepts ComponentPreviewProps (props + compact flag)
 * - compact=true: small canvas card view
 * - compact=false: larger inspector panel preview
 *
 * @dependencies
 * - None (pure presentational components)
 *
 * @notes
 * - These are NOT the final frontend components — just admin previews
 * - Rich text shows placeholder bars when no content is set
 * - All renderers gracefully handle missing/empty props
 */
'use client'

import React from 'react'
import type { ComponentPreviewProps } from './PreviewRenderer'

// ---------------------------------------------------------------------------
// Rich Text
// ---------------------------------------------------------------------------

export function RichTextPreview({ props, compact }: ComponentPreviewProps) {
  const content = props.content as string | undefined
  if (compact) {
    return (
      <div className="space-y-1.5">
        {content ? (
          <p className="text-xs text-gray-600 line-clamp-3">{content}</p>
        ) : (
          <>
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-4/5" />
            <div className="h-2 bg-gray-200 rounded w-3/5" />
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-2 p-3 bg-white border border-gray-100 rounded">
      {content ? (
        <p className="text-sm text-gray-700 line-clamp-6">{content}</p>
      ) : (
        <>
          <div className="h-2.5 bg-gray-200 rounded w-full" />
          <div className="h-2.5 bg-gray-200 rounded w-11/12" />
          <div className="h-2.5 bg-gray-200 rounded w-4/5" />
          <div className="h-2.5 bg-gray-200 rounded w-3/4" />
          <div className="h-2.5 bg-gray-200 rounded w-2/3" />
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Heading
// ---------------------------------------------------------------------------

export function HeadingPreview({ props, compact }: ComponentPreviewProps) {
  const text = (props.text as string) || 'Heading Text'
  const level = (props.level as string) || '2'
  const alignment = (props.alignment as string) || 'left'

  // Map heading levels to font sizes
  const sizeMap: Record<string, string> = {
    '1': compact ? 'text-base font-bold' : 'text-2xl font-bold',
    '2': compact ? 'text-sm font-bold' : 'text-xl font-bold',
    '3': compact ? 'text-sm font-semibold' : 'text-lg font-semibold',
    '4': compact ? 'text-xs font-semibold' : 'text-base font-semibold',
    '5': compact ? 'text-xs font-medium' : 'text-sm font-semibold',
    '6': compact ? 'text-xs font-medium' : 'text-sm font-medium',
  }

  const alignMap: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div className={`${alignMap[alignment] ?? 'text-left'} ${compact ? 'py-1' : 'p-3'}`}>
      <span className={`${sizeMap[level] ?? sizeMap['2']} text-gray-800`}>
        {compact ? text.slice(0, 40) + (text.length > 40 ? '...' : '') : text}
      </span>
      {!compact && (
        <div className="mt-1 text-xs text-gray-400">H{level} · {alignment}</div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------

export function ImagePreview({ props, compact }: ComponentPreviewProps) {
  const altText = (props.altText as string) || 'Image'
  const caption = props.caption as string | undefined
  const size = (props.size as string) || 'medium'

  const sizeLabel = size.charAt(0).toUpperCase() + size.slice(1)

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center text-gray-400 text-xs flex-shrink-0">
          🖼
        </div>
        <span className="text-xs text-gray-500 truncate">{altText}</span>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="w-full h-28 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <span className="text-3xl text-gray-300">🖼</span>
          <div className="text-xs text-gray-400 mt-1">{sizeLabel}</div>
        </div>
      </div>
      {caption && (
        <p className="text-xs text-gray-500 mt-1.5 text-center italic">{caption}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Video
// ---------------------------------------------------------------------------

export function VideoPreview({ props, compact }: ComponentPreviewProps) {
  const url = (props.url as string) || ''

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs">▶</span>
        </div>
        <span className="text-xs text-gray-500 truncate">{url || 'Video URL'}</span>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="w-full h-28 bg-gray-900 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mx-auto">
            <span className="text-white text-lg ml-0.5">▶</span>
          </div>
          {url && <p className="text-xs text-gray-400 mt-2 truncate max-w-[200px]">{url}</p>}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Accordion
// ---------------------------------------------------------------------------

export function AccordionPreview({ props, compact }: ComponentPreviewProps) {
  const items = (props.items as Array<{ title?: string }>) || []

  if (compact) {
    return (
      <div className="space-y-1">
        {(items.length > 0 ? items.slice(0, 3) : [{ title: 'Accordion Item' }]).map((item, i) => (
          <div key={i} className="flex items-center justify-between px-2 py-1 bg-gray-50 rounded text-xs">
            <span className="text-gray-600 truncate">{item.title || `Item ${i + 1}`}</span>
            <span className="text-gray-400 flex-shrink-0 ml-1">+</span>
          </div>
        ))}
        {items.length > 3 && (
          <div className="text-xs text-gray-400 text-center">+{items.length - 3} more</div>
        )}
      </div>
    )
  }

  return (
    <div className="p-3 space-y-1.5">
      {(items.length > 0 ? items : [{ title: 'Accordion Item 1' }, { title: 'Accordion Item 2' }]).map((item, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2 bg-gray-50 border border-gray-200 rounded">
          <span className="text-sm text-gray-700">{item.title || `Item ${i + 1}`}</span>
          <span className="text-gray-400">+</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

export function TabsPreview({ props, compact }: ComponentPreviewProps) {
  const tabs = (props.tabs as Array<{ label?: string }>) || []
  const tabLabels = tabs.length > 0 ? tabs.map((t) => t.label || 'Tab') : ['Tab 1', 'Tab 2', 'Tab 3']

  if (compact) {
    return (
      <div className="flex gap-1 border-b border-gray-200 pb-1">
        {tabLabels.slice(0, 4).map((label, i) => (
          <span
            key={i}
            className={`text-xs px-1.5 py-0.5 rounded-t ${
              i === 0 ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-400'
            }`}
          >
            {label.slice(0, 10)}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="flex gap-1 border-b border-gray-200">
        {tabLabels.map((label, i) => (
          <span
            key={i}
            className={`text-sm px-3 py-1.5 rounded-t ${
              i === 0
                ? 'bg-white text-blue-600 font-medium border border-gray-200 border-b-white -mb-px'
                : 'text-gray-500'
            }`}
          >
            {label}
          </span>
        ))}
      </div>
      <div className="p-3 border border-t-0 border-gray-200 rounded-b">
        <div className="h-2 bg-gray-100 rounded w-4/5 mb-1.5" />
        <div className="h-2 bg-gray-100 rounded w-3/5" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

export function TablePreview({ props, compact }: ComponentPreviewProps) {
  const hasHeader = (props.headerRow as boolean) !== false
  const striped = (props.striped as boolean) ?? false

  if (compact) {
    return (
      <div className="border border-gray-200 rounded overflow-hidden">
        {hasHeader && (
          <div className="flex bg-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex-1 px-1.5 py-1 border-r border-gray-200 last:border-r-0">
                <div className="h-1.5 bg-gray-300 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}
        {[1, 2].map((row) => (
          <div key={row} className={`flex ${striped && row % 2 === 0 ? 'bg-gray-50' : ''}`}>
            {[1, 2, 3].map((col) => (
              <div key={col} className="flex-1 px-1.5 py-1 border-r border-t border-gray-200 last:border-r-0">
                <div className="h-1.5 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="border border-gray-200 rounded overflow-hidden">
        {hasHeader && (
          <div className="flex bg-gray-100">
            {['Column A', 'Column B', 'Column C'].map((h) => (
              <div key={h} className="flex-1 px-3 py-2 border-r border-gray-200 last:border-r-0 text-xs font-semibold text-gray-600">
                {h}
              </div>
            ))}
          </div>
        )}
        {[1, 2, 3].map((row) => (
          <div key={row} className={`flex border-t border-gray-200 ${striped && row % 2 === 0 ? 'bg-gray-50' : ''}`}>
            {[1, 2, 3].map((col) => (
              <div key={col} className="flex-1 px-3 py-2 border-r border-gray-200 last:border-r-0">
                <div className="h-2 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Blockquote
// ---------------------------------------------------------------------------

export function BlockquotePreview({ props, compact }: ComponentPreviewProps) {
  const quote = (props.quote as string) || 'Quote text here...'
  const attribution = props.attribution as string | undefined
  const variant = (props.variant as string) || 'default'

  const borderColor = variant === 'highlighted' ? 'border-yellow-400 bg-yellow-50' : 'border-blue-400'

  if (compact) {
    return (
      <div className={`border-l-2 ${borderColor} pl-2 py-0.5`}>
        <p className="text-xs text-gray-600 italic line-clamp-2">{quote}</p>
      </div>
    )
  }

  return (
    <div className={`p-3 border-l-4 ${borderColor} ${variant === 'highlighted' ? '' : 'bg-gray-50'} rounded-r`}>
      <p className="text-sm text-gray-700 italic line-clamp-4">&ldquo;{quote}&rdquo;</p>
      {attribution && (
        <p className="text-xs text-gray-500 mt-2">&mdash; {attribution}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Divider
// ---------------------------------------------------------------------------

export function DividerPreview({ props, compact }: ComponentPreviewProps) {
  const style = (props.style as string) || 'line'
  const spacing = (props.spacing as string) || 'medium'

  const py = compact ? 'py-1' : spacing === 'small' ? 'py-2' : spacing === 'large' ? 'py-6' : 'py-4'

  return (
    <div className={py}>
      {style === 'dots' ? (
        <div className="flex justify-center gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
          ))}
        </div>
      ) : style === 'space' ? (
        <div className={compact ? 'h-2' : 'h-4'} />
      ) : (
        <hr className="border-gray-200" />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Image Grid
// ---------------------------------------------------------------------------

export function ImageGridPreview({ props, compact }: ComponentPreviewProps) {
  const images = (props.images as Array<{ caption?: string }>) || []
  const columns = (props.columns as number) || 3
  const count = images.length || columns

  if (compact) {
    return (
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(columns, 4)}, 1fr)` }}>
        {Array.from({ length: Math.min(count, 6) }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-300 text-xs">🖼</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: Math.min(count, 9) }).map((_, i) => (
          <div key={i} className="aspect-square bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-300 text-xl">🖼</span>
          </div>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-1.5 text-center">{count} image(s) · {columns} columns</div>
    </div>
  )
}
