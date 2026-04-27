/**
 * Preview renderers for the 22 components added in Layer 1.
 *
 * Each renders a schematic card with the component name and a key prop
 * summary. Follows the existing pattern in content/layout/data/interactive
 * preview files but consolidated here for tighter Layer 1 scope.
 */
'use client'

import React from 'react'
import type { ComponentPreviewProps } from './PreviewRenderer'

function Strip({ color }: { color: string }) {
  return <div className={`h-1 w-full rounded-t ${color}`} />
}

function CardShell({
  category,
  name,
  summary,
  compact,
}: {
  category: 'content' | 'layout' | 'data' | 'interactive'
  name: string
  summary?: string
  compact?: boolean
}) {
  const stripColor = {
    content: 'bg-blue-300',
    layout: 'bg-purple-300',
    data: 'bg-green-300',
    interactive: 'bg-orange-300',
  }[category]

  if (compact) {
    return (
      <div className="flex items-center gap-2 py-1">
        <div className={`w-2 h-2 rounded-full ${stripColor}`} />
        <span className="text-xs text-gray-600 truncate">{name}</span>
        {summary && <span className="text-xs text-gray-400 truncate">— {summary}</span>}
      </div>
    )
  }
  return (
    <div className="rounded border border-gray-200 bg-white overflow-hidden">
      <Strip color={stripColor} />
      <div className="p-2.5">
        <div className="text-xs font-medium text-gray-700">{name}</div>
        {summary && <div className="mt-1 text-xs text-gray-500 line-clamp-2">{summary}</div>}
      </div>
    </div>
  )
}

// --- Content -------------------------------------------------------------

export function DisclaimerPreview({ props, compact }: ComponentPreviewProps) {
  const style = (props.style as string) || 'info'
  return <CardShell category="content" name="Disclaimer" summary={`${style} style`} compact={compact} />
}

// --- Layout --------------------------------------------------------------

export function QuickLinksPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Quick Links'
  const links = Array.isArray(props.links) ? props.links.length : 0
  return <CardShell category="layout" name={heading} summary={`${links} link${links === 1 ? '' : 's'}`} compact={compact} />
}

export function PageHeaderPreview({ props, compact }: ComponentPreviewProps) {
  const title = (props.title as string) || 'Page Header'
  const subtitle = (props.subtitle as string) || ''
  return <CardShell category="layout" name={title} summary={subtitle} compact={compact} />
}

export function PromoCardGridPreview({ props, compact }: ComponentPreviewProps) {
  const cards = Array.isArray(props.cards) ? props.cards.length : 0
  const cols = (props.columns as string) || '3'
  return <CardShell category="layout" name="Promo Card Grid" summary={`${cards} cards · ${cols} cols`} compact={compact} />
}

// --- Data ---------------------------------------------------------------

export function ProjectTimelinePreview({ props, compact }: ComponentPreviewProps) {
  const stages = (props.stageCount as number) ?? 5
  const current = (props.currentStage as number) ?? 1
  return <CardShell category="data" name="Project Timeline" summary={`${current} of ${stages} stages`} compact={compact} />
}

export function NewsCardWidgetPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'News'
  const limit = (props.limit as number) ?? 3
  return <CardShell category="data" name={heading} summary={`${limit} items · Dynamic`} compact={compact} />
}

export function DraftsCardPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'My Drafts'
  const limit = (props.limit as number) ?? 5
  return <CardShell category="data" name={heading} summary={`Latest ${limit}`} compact={compact} />
}

export function EventsCardPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Events'
  const limit = (props.limit as number) ?? 3
  return <CardShell category="data" name={heading} summary={`${limit} upcoming`} compact={compact} />
}

export function NewsEventsGridPreview({ props, compact }: ComponentPreviewProps) {
  const news = (props.newsLimit as number) ?? 3
  const events = (props.eventsLimit as number) ?? 3
  return <CardShell category="data" name="News + Events Grid" summary={`${news} news · ${events} events`} compact={compact} />
}

export function BrowseByStandardPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Browse by Standard'
  return <CardShell category="data" name={heading} summary="Standards browse grid" compact={compact} />
}

export function RightRailEventsListPreview({ props, compact }: ComponentPreviewProps) {
  const limit = (props.limit as number) ?? 5
  const heading = (props.heading as string) || 'Upcoming Events'
  return <CardShell category="data" name={heading} summary={`${limit} items · right rail`} compact={compact} />
}

export function RightRailResourceListPreview({ props, compact }: ComponentPreviewProps) {
  const limit = (props.limit as number) ?? 5
  const type = (props.typeFilter as string) || 'all'
  return <CardShell category="data" name="Right Rail — Resources" summary={`${limit} items · ${type}`} compact={compact} />
}

export function EventSummaryTablePreview({ props, compact }: ComponentPreviewProps) {
  const source = (props.source as string) || 'manual'
  const rows = Array.isArray(props.rows) ? props.rows.length : 0
  return <CardShell category="data" name="Event Summary Table" summary={`${source} · ${rows} rows`} compact={compact} />
}

export function MeetingTopicsTablePreview({ props, compact }: ComponentPreviewProps) {
  const source = (props.source as string) || 'manual'
  const rows = Array.isArray(props.rows) ? props.rows.length : 0
  return <CardShell category="data" name="Meeting Topics Table" summary={`${source} · ${rows} rows`} compact={compact} />
}

export function RelatedContentPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Related Content'
  const layout = (props.layout as string) || 'cards'
  return <CardShell category="data" name={heading} summary={`Layout: ${layout}`} compact={compact} />
}

export function MeetingDetailPreview({ props, compact }: ComponentPreviewProps) {
  const showTopics = props.showTopics !== false
  const showDocs = props.showDocuments !== false
  const parts = [showTopics && 'topics', showDocs && 'documents'].filter(Boolean).join(' + ')
  return <CardShell category="data" name="Meeting Detail" summary={parts || 'header only'} compact={compact} />
}

// --- Interactive --------------------------------------------------------

export function SubscribeBannerPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'Subscribe'
  return <CardShell category="interactive" name={heading} summary="HubSpot signup" compact={compact} />
}

export function MemberActionFormPreview({ props, compact }: ComponentPreviewProps) {
  const variant = (props.formVariant as string) || 'attend'
  const requireAuth = props.requireAuth !== false
  return (
    <CardShell
      category="interactive"
      name="Member Action Form"
      summary={`${variant}${requireAuth ? ' · auth required' : ''}`}
      compact={compact}
    />
  )
}

export function CategoryPillsPreview({ props, compact }: ComponentPreviewProps) {
  const opts = Array.isArray(props.options) ? props.options.length : 0
  const param = (props.paramName as string) || 'category'
  return <CardShell category="interactive" name="Category Pills" summary={`${opts} options · ?${param}=`} compact={compact} />
}

export function AnchorNavPreview({ props, compact }: ComponentPreviewProps) {
  const heading = (props.heading as string) || 'On this page'
  const auto = props.autoDetect !== false
  return <CardShell category="interactive" name={heading} summary={auto ? 'Auto-detect H2' : 'Manual'} compact={compact} />
}

export function SocialSharePreview({ props, compact }: ComponentPreviewProps) {
  const platforms = Array.isArray(props.platforms) ? props.platforms.length : 0
  return <CardShell category="interactive" name="Social Share" summary={`${platforms} platform${platforms === 1 ? '' : 's'}`} compact={compact} />
}

export function RssLinkPreview({ props, compact }: ComponentPreviewProps) {
  const label = (props.label as string) || 'Subscribe via RSS'
  return <CardShell category="interactive" name={label} summary="RSS feed link" compact={compact} />
}
