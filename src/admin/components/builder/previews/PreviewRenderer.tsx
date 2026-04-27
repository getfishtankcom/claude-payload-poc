/**
 * @description
 * Central preview renderer dispatch — maps component.type to the
 * appropriate preview renderer. Used by both BuilderCanvas (compact=true)
 * and InspectorPanel (compact=false).
 *
 * Key features:
 * - Dispatches to one of 31 specialized preview renderers
 * - GenericPreview fallback for unknown component types
 * - compact prop controls card (small) vs inspector (large) rendering
 *
 * @dependencies
 * - content-previews: 10 content block renderers
 * - layout-previews: 7 layout component renderers
 * - data-previews: 9 data-driven widget renderers
 * - interactive-previews: 5 interactive element renderers
 *
 * @notes
 * - All preview renderers are pure presentational — no side effects
 * - Unknown types get a graceful fallback, not an error
 */
'use client'

import React from 'react'

// Content Blocks
import {
  RichTextPreview,
  HeadingPreview,
  ImagePreview,
  VideoPreview,
  AccordionPreview,
  TabsPreview,
  TablePreview,
  BlockquotePreview,
  DividerPreview,
  ImageGridPreview,
} from './content-previews'

// Layout Components
import {
  CardGridPreview,
  TwoColumnPreview,
  ThreeColumnPreview,
  HeroBannerPreview,
  CTABannerPreview,
  FeatureRowPreview,
  StatsBarPreview,
} from './layout-previews'

// Data-Driven Widgets
import {
  ProjectListPreview,
  NewsFeedPreview,
  EventCalendarPreview,
  DocumentTablePreview,
  ContactCardPreview,
  BoardMembersGridPreview,
  ConsultationCountdownPreview,
  StandardsListPreview,
  EffectiveDatesTablePreview,
} from './data-previews'

// Interactive Elements
import {
  SearchBarPreview,
  FilterPanelPreview,
  NewsletterSignupPreview,
  DownloadButtonPreview,
  AnchorLinkPreview,
} from './interactive-previews'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Props accepted by all preview renderers */
export interface ComponentPreviewProps {
  /** The component's configured props */
  props: Record<string, unknown>
  /** true = small canvas card, false = larger inspector panel */
  compact?: boolean
}

/** A preview renderer function */
type PreviewRendererFn = React.FC<ComponentPreviewProps>

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

/** Map of component type slug -> preview renderer */
const previewRegistry: Record<string, PreviewRendererFn> = {
  // Content Blocks (10)
  'rich-text': RichTextPreview,
  heading: HeadingPreview,
  image: ImagePreview,
  video: VideoPreview,
  accordion: AccordionPreview,
  tabs: TabsPreview,
  table: TablePreview,
  blockquote: BlockquotePreview,
  divider: DividerPreview,
  'image-grid': ImageGridPreview,

  // Layout Components (7)
  'card-grid': CardGridPreview,
  'two-column': TwoColumnPreview,
  'three-column': ThreeColumnPreview,
  'hero-banner': HeroBannerPreview,
  'cta-banner': CTABannerPreview,
  'feature-row': FeatureRowPreview,
  'stats-bar': StatsBarPreview,

  // Data-Driven Widgets (9)
  'project-list': ProjectListPreview,
  'news-feed': NewsFeedPreview,
  'event-calendar': EventCalendarPreview,
  'document-table': DocumentTablePreview,
  'contact-card': ContactCardPreview,
  'board-members-grid': BoardMembersGridPreview,
  'consultation-countdown': ConsultationCountdownPreview,
  'standards-list': StandardsListPreview,
  'effective-dates-table': EffectiveDatesTablePreview,

  // Interactive Elements (5)
  'search-bar': SearchBarPreview,
  'filter-panel': FilterPanelPreview,
  'newsletter-signup': NewsletterSignupPreview,
  'download-button': DownloadButtonPreview,
  'anchor-link': AnchorLinkPreview,
}

// ---------------------------------------------------------------------------
// Generic Fallback
// ---------------------------------------------------------------------------

function GenericPreview({ props, compact }: ComponentPreviewProps) {
  // Try to show the first text-like prop value
  const firstTextProp = Object.entries(props).find(
    ([, v]) => typeof v === 'string' && v.length > 0,
  )

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className="w-5 h-5 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">◻</div>
        <span className="text-xs text-gray-500 truncate">
          {firstTextProp ? firstTextProp[1] as string : 'Component'}
        </span>
      </div>
    )
  }

  return (
    <div className="p-3 bg-gray-50 rounded border border-gray-200 text-center">
      <div className="text-2xl text-gray-300 mb-1">◻</div>
      {firstTextProp ? (
        <p className="text-xs text-gray-500 line-clamp-2">{firstTextProp[1] as string}</p>
      ) : (
        <p className="text-xs text-gray-400">No preview available</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

interface PreviewRendererProps {
  /** Component type slug (e.g., 'hero-banner') */
  type: string
  /** Component's configured props */
  props: Record<string, unknown>
  /** true = small canvas card, false = larger inspector panel */
  compact?: boolean
}

/**
 * Renders a visual preview for any registered component type.
 * Falls back to GenericPreview for unknown types.
 */
export function PreviewRenderer({ type, props, compact = false }: PreviewRendererProps) {
  const Renderer = previewRegistry[type] ?? GenericPreview
  return <Renderer props={props} compact={compact} />
}

export { previewRegistry }
