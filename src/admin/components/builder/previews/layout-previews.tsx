/**
 * @description
 * Preview renderers for Layout components (7 total).
 * Lightweight admin-only visual approximations for canvas cards
 * and inspector panel previews.
 *
 * Key features:
 * - Card Grid: grid of card outlines with titles
 * - Two/Three Column: column ratio visualization
 * - Hero Banner: gradient box with heading/CTA
 * - CTA Banner: colored strip with button pill
 * - Feature Row: icon + text block
 * - Stats Bar: big numbers with labels
 *
 * @dependencies
 * - None (pure presentational components)
 *
 * @notes
 * - All renderers handle missing/empty props gracefully
 */
'use client'

import React from 'react'
import type { ComponentPreviewProps } from './PreviewRenderer'

// ---------------------------------------------------------------------------
// Card Grid
// ---------------------------------------------------------------------------

export function CardGridPreview({ props, compact }: ComponentPreviewProps) {
  const columns = (props.columns as number) || 3
  const items = (props.items as Array<{ title?: string; description?: string }>) || []
  const style = (props.style as string) || 'default'

  const cardBorder = style === 'elevated' ? 'shadow-sm' : style === 'bordered' ? 'border-2' : 'border'

  if (compact) {
    return (
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${Math.min(columns, 4)}, 1fr)` }}>
        {Array.from({ length: Math.min(items.length || columns, 4) }).map((_, i) => (
          <div key={i} className={`${cardBorder} border-gray-200 rounded p-1.5`}>
            <div className="h-1.5 bg-gray-200 rounded w-3/4 mb-1" />
            <div className="h-1 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  const displayItems = items.length > 0
    ? items.slice(0, columns * 2)
    : Array.from({ length: columns }, (_, i) => ({ title: `Card ${i + 1}`, description: 'Description text' }))

  return (
    <div className="p-3">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {displayItems.map((item, i) => (
          <div key={i} className={`${cardBorder} border-gray-200 rounded-lg p-3`}>
            <div className="w-full h-10 bg-gray-100 rounded mb-2" />
            <div className="text-xs font-medium text-gray-700 truncate">{item.title || `Card ${i + 1}`}</div>
            {item.description && (
              <div className="text-xs text-gray-400 mt-0.5 line-clamp-2">{item.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Two Column
// ---------------------------------------------------------------------------

export function TwoColumnPreview({ props, compact }: ComponentPreviewProps) {
  const ratio = (props.ratio as string) || '50-50'
  const [left, right] = ratio.split('-').map(Number)

  if (compact) {
    return (
      <div className="flex gap-1">
        <div className="bg-blue-50 border border-blue-200 rounded p-1" style={{ flex: left }}>
          <div className="h-1.5 bg-blue-200 rounded w-3/4 mb-0.5" />
          <div className="h-1 bg-blue-100 rounded w-full" />
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded p-1" style={{ flex: right }}>
          <div className="h-1.5 bg-purple-200 rounded w-3/4 mb-0.5" />
          <div className="h-1 bg-purple-100 rounded w-full" />
        </div>
      </div>
    )
  }

  return (
    <div className="p-3">
      <div className="text-xs text-gray-400 mb-2">{ratio.replace('-', '/')}</div>
      <div className="flex gap-3">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3" style={{ flex: left }}>
          <div className="text-xs text-blue-500 font-medium mb-1">Left Column</div>
          <div className="h-2 bg-blue-100 rounded w-full mb-1" />
          <div className="h-2 bg-blue-100 rounded w-4/5" />
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3" style={{ flex: right }}>
          <div className="text-xs text-purple-500 font-medium mb-1">Right Column</div>
          <div className="h-2 bg-purple-100 rounded w-full mb-1" />
          <div className="h-2 bg-purple-100 rounded w-3/4" />
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Three Column
// ---------------------------------------------------------------------------

export function ThreeColumnPreview({ props, compact }: ComponentPreviewProps) {
  if (compact) {
    return (
      <div className="flex gap-1">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex-1 bg-gray-50 border border-gray-200 rounded p-1">
            <div className="h-1.5 bg-gray-200 rounded w-3/4 mb-0.5" />
            <div className="h-1 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
    )
  }

  const colors = ['blue', 'purple', 'emerald'] as const
  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-200', bar: 'bg-blue-100', text: 'text-blue-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-200', bar: 'bg-purple-100', text: 'text-purple-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', bar: 'bg-emerald-100', text: 'text-emerald-500' },
  }

  return (
    <div className="p-3">
      <div className="flex gap-2">
        {colors.map((color, i) => {
          const c = colorMap[color]
          return (
            <div key={i} className={`flex-1 ${c.bg} border ${c.border} rounded-lg p-3`}>
              <div className={`text-xs ${c.text} font-medium mb-1`}>Column {i + 1}</div>
              <div className={`h-2 ${c.bar} rounded w-full mb-1`} />
              <div className={`h-2 ${c.bar} rounded w-3/4`} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hero Banner
// ---------------------------------------------------------------------------

export function HeroBannerPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Hero Heading'
  const subheading = props.subheading as string | undefined
  const ctaLabel = props.ctaLabel as string | undefined
  const bgStyle = (props.backgroundStyle as string) || 'gradient'

  const bgClass =
    bgStyle === 'solid'
      ? 'bg-gray-800'
      : bgStyle === 'image'
        ? 'bg-gray-700'
        : 'bg-gradient-to-r from-indigo-800 to-purple-700'

  if (compact) {
    return (
      <div className={`${bgClass} rounded p-2 text-white`}>
        <div className="text-xs font-bold truncate">{heading}</div>
        {subheading && <div className="text-xs opacity-70 truncate mt-0.5">{subheading}</div>}
        {ctaLabel && (
          <div className="mt-1 inline-block px-2 py-0.5 bg-white/20 rounded text-xs">{ctaLabel}</div>
        )}
      </div>
    )
  }

  return (
    <div className={`${bgClass} rounded-lg p-6 text-white text-center`}>
      <h3 className="text-lg font-bold">{heading}</h3>
      {subheading && <p className="text-sm opacity-80 mt-1">{subheading}</p>}
      {ctaLabel && (
        <button className="mt-3 px-4 py-1.5 bg-white text-gray-800 text-sm font-medium rounded hover:bg-gray-100">
          {ctaLabel}
        </button>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// CTA Banner
// ---------------------------------------------------------------------------

export function CTABannerPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Call to Action'
  const body = props.body as string | undefined
  const buttonLabel = (props.buttonLabel as string) || 'Learn More'
  const variant = (props.variant as string) || 'default'

  const bgMap: Record<string, string> = {
    default: 'bg-blue-600',
    dark: 'bg-gray-800',
    purple: 'bg-purple-700',
  }

  if (compact) {
    return (
      <div className={`${bgMap[variant] ?? bgMap.default} rounded p-2 flex items-center justify-between`}>
        <span className="text-xs text-white font-medium truncate">{heading}</span>
        <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded flex-shrink-0 ml-2">{buttonLabel}</span>
      </div>
    )
  }

  return (
    <div className={`${bgMap[variant] ?? bgMap.default} rounded-lg p-5 text-white`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-base font-bold">{heading}</h4>
          {body && <p className="text-sm opacity-80 mt-1">{body}</p>}
        </div>
        <button className="px-4 py-2 bg-white text-gray-800 text-sm font-medium rounded hover:bg-gray-100 flex-shrink-0 ml-4">
          {buttonLabel}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Feature Row
// ---------------------------------------------------------------------------

export function FeatureRowPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Feature'
  const description = props.description as string | undefined
  const layout = (props.layout as string) || 'horizontal'

  if (compact) {
    return (
      <div className={`flex ${layout === 'vertical' ? 'flex-col items-center text-center' : 'items-center'} gap-2`}>
        <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
          <span className="text-blue-500 text-xs">✨</span>
        </div>
        <span className="text-xs text-gray-700 font-medium truncate">{heading}</span>
      </div>
    )
  }

  return (
    <div className={`p-3 flex ${layout === 'vertical' ? 'flex-col items-center text-center' : 'items-start'} gap-3`}>
      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-blue-500 text-lg">✨</span>
      </div>
      <div>
        <div className="text-sm font-semibold text-gray-700">{heading}</div>
        {description && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{description}</p>}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stats Bar
// ---------------------------------------------------------------------------

export function StatsBarPreview({ props, compact }: ComponentPreviewProps) {
  const stats = (props.stats as Array<{ number?: string; label?: string }>) || []
  const bgStyle = (props.backgroundStyle as string) || 'light'

  const displayStats = stats.length > 0
    ? stats
    : [
        { number: '42', label: 'Projects' },
        { number: '156', label: 'Members' },
        { number: '12', label: 'Boards' },
      ]

  const bgMap: Record<string, string> = {
    light: 'bg-gray-50',
    dark: 'bg-gray-800 text-white',
    gradient: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
  }

  if (compact) {
    return (
      <div className={`${bgMap[bgStyle] ?? bgMap.light} rounded p-1.5 flex justify-around`}>
        {displayStats.slice(0, 4).map((stat, i) => (
          <div key={i} className="text-center">
            <div className={`text-sm font-bold ${bgStyle === 'light' ? 'text-blue-600' : ''}`}>{stat.number}</div>
            <div className={`text-xs ${bgStyle === 'light' ? 'text-gray-500' : 'opacity-70'}`}>{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`${bgMap[bgStyle] ?? bgMap.light} rounded-lg p-5 flex justify-around`}>
      {displayStats.map((stat, i) => (
        <div key={i} className="text-center">
          <div className={`text-2xl font-bold ${bgStyle === 'light' ? 'text-blue-600' : ''}`}>{stat.number}</div>
          <div className={`text-xs ${bgStyle === 'light' ? 'text-gray-500' : 'opacity-70'} mt-0.5`}>{stat.label}</div>
        </div>
      ))}
    </div>
  )
}
