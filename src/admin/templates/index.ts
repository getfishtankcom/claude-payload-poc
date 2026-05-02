/**
 * @description
 * Central registry of all page builder templates with their zone configurations.
 * Each template defines which zones are locked (structural) and which are editable.
 * Templates are selected on page creation and determine the builder's zone structure.
 *
 * Key features:
 * - 8 templates per PRD Section 6.5
 * - Locked zones for structural elements (header, footer, hero, etc.)
 * - Editable zones with optional component type restrictions and max counts
 * - Helper functions for template lookup and zone queries
 *
 * @dependencies
 * - types.ts: PageTemplate, TemplateZone, TemplateName
 *
 * @notes
 * - Template zone configs are code-only — admins cannot create custom templates
 * - allowedComponents empty array means all components are allowed
 * - maxComponents 0 means unlimited
 * - Locked zones render their lockedComponent automatically (not editable)
 */

import type { PageTemplate, TemplateName } from './types'

export type { PageTemplate, TemplateZone, TemplateName, ComponentInstance, BuilderLayout } from './types'

// All component type slugs, grouped by category for reference (Layer 1: 53 total).
const CONTENT_COMPONENTS = [
  'rich-text', 'heading', 'image', 'video', 'accordion',
  'tabs', 'table', 'blockquote', 'divider', 'image-grid',
  'disclaimer',
]
const LAYOUT_COMPONENTS = [
  'card-grid', 'two-column', 'three-column', 'hero-banner',
  'cta-banner', 'feature-row', 'stats-bar',
  'quick-links', 'page-header', 'promo-card-grid',
]
const DATA_COMPONENTS = [
  'project-list', 'news-feed', 'event-calendar', 'document-table',
  'contact-card', 'board-members-grid', 'consultation-countdown',
  'standards-list', 'effective-dates-table',
  'project-timeline', 'news-card-widget', 'drafts-card', 'events-card',
  'news-events-grid', 'browse-by-standard',
  'right-rail-events-list', 'right-rail-resource-list',
  'event-summary-table', 'meeting-topics-table', 'related-content',
  'meeting-detail',
]
const INTERACTIVE_COMPONENTS = [
  'search-bar', 'filter-panel', 'newsletter-signup',
  'download-button', 'anchor-link',
  'subscribe-banner', 'member-action-form', 'category-pills',
  'anchor-nav', 'social-share', 'rss-link',
]

// Right-rail / sidebar zones — restricted to widgets that read well at narrow width.
const RIGHT_RAIL_COMPONENTS = [
  'right-rail-events-list', 'right-rail-resource-list',
  'contact-card', 'board-members-grid',
  'quick-links', 'subscribe-banner', 'rss-link',
  'anchor-nav', 'disclaimer', 'related-content',
]

// Hero zones — limited to hero/header components.
const HERO_COMPONENTS = ['hero-banner', 'page-header']

// Footer zones — limited to opt-in calls to action.
const FOOTER_COMPONENTS = ['newsletter-signup', 'rss-link', 'subscribe-banner']

// Main / body zones — exclude right-rail-only widgets but allow everything else.
const MAIN_COMPONENTS = [
  ...CONTENT_COMPONENTS,
  ...LAYOUT_COMPONENTS.filter((c) => !HERO_COMPONENTS.includes(c)),
  ...DATA_COMPONENTS.filter(
    (c) => c !== 'right-rail-events-list' && c !== 'right-rail-resource-list',
  ),
  ...INTERACTIVE_COMPONENTS.filter((c) => c !== 'rss-link'),
]

// Full set — flexible-page body has no restrictions.
const ALL_COMPONENTS = [
  ...CONTENT_COMPONENTS,
  ...LAYOUT_COMPONENTS,
  ...DATA_COMPONENTS,
  ...INTERACTIVE_COMPONENTS,
]

// Sidebar set used by Project Detail / Content Page (broader than right-rail-only).
const SIDEBAR_COMPONENTS = [
  ...DATA_COMPONENTS,
  ...INTERACTIVE_COMPONENTS,
  'rich-text',
  'heading',
  'download-button',
]

/**
 * Homepage template
 * Locked: Header, Footer
 * Editable: Hero (1 component), Main (unlimited), Newsletter (1 component)
 */
const homepage: PageTemplate = {
  slug: 'homepage',
  label: 'Homepage',
  description: 'Main landing page with hero, flexible main content area, and newsletter zone.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'hero', label: 'Hero', type: 'editable', allowedComponents: HERO_COMPONENTS, maxComponents: 1 },
    { name: 'main', label: 'Main Content', type: 'editable', allowedComponents: MAIN_COMPONENTS, maxComponents: 0 },
    { name: 'newsletter', label: 'Newsletter', type: 'editable', allowedComponents: FOOTER_COMPONENTS, maxComponents: 1 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Board Detail template
 * Locked: Header, Hero Banner, Tab Nav, Footer
 * Editable: Tab Content (main components allowed)
 */
const boardDetail: PageTemplate = {
  slug: 'board-detail',
  label: 'Board Detail',
  description: 'Board landing page with hero, tab navigation, and editable tab content.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'hero', label: 'Hero Banner', type: 'locked', lockedComponent: 'hero-banner' },
    { name: 'tab-nav', label: 'Tab Navigation', type: 'locked', lockedComponent: 'section-nav' },
    { name: 'tab-content', label: 'Tab Content', type: 'editable', allowedComponents: MAIN_COMPONENTS, maxComponents: 0 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Project Detail template
 * Locked: Header, Hero, Timeline, Footer
 * Editable: Main (unlimited), Sidebar (limited to data/interactive)
 */
const projectDetail: PageTemplate = {
  slug: 'project-detail',
  label: 'Project Detail',
  description: 'Individual project page with timeline, main content, and sidebar.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'hero', label: 'Hero', type: 'locked', lockedComponent: 'hero-banner' },
    { name: 'timeline', label: 'Timeline', type: 'locked', lockedComponent: 'project-timeline' },
    { name: 'main', label: 'Main Content', type: 'editable', allowedComponents: MAIN_COMPONENTS, maxComponents: 0 },
    {
      name: 'sidebar',
      label: 'Sidebar',
      type: 'editable',
      allowedComponents: RIGHT_RAIL_COMPONENTS,
      maxComponents: 8,
    },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Active Projects template
 * Locked: Header, Hero, Filter Bar, Footer
 * Editable: Results Zone (1 component — Project List)
 */
const activeProjects: PageTemplate = {
  slug: 'active-projects',
  label: 'Active Projects',
  description: 'Listing page for active projects with filter bar and results.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'hero', label: 'Hero', type: 'locked', lockedComponent: 'hero-banner' },
    { name: 'filter-bar', label: 'Filter Bar', type: 'locked', lockedComponent: 'filter-panel' },
    { name: 'results', label: 'Results', type: 'editable', allowedComponents: ['project-list'], maxComponents: 1 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Open Consultations template
 * Locked: Header, Hero, Footer
 * Editable: Main (unlimited)
 */
const openConsultations: PageTemplate = {
  slug: 'open-consultations',
  label: 'Open Consultations',
  description: 'Open consultations listing with flexible main content area.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'hero', label: 'Hero', type: 'locked', lockedComponent: 'hero-banner' },
    { name: 'main', label: 'Main Content', type: 'editable', allowedComponents: MAIN_COMPONENTS, maxComponents: 0 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Search Results template
 * Locked: Header, Search Bar, Footer
 * Editable: Results Zone (locked to search-results component)
 */
const searchResults: PageTemplate = {
  slug: 'search-results',
  label: 'Search Results',
  description: 'Search results page with search bar and results display.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'search-bar', label: 'Search Bar', type: 'locked', lockedComponent: 'search-bar' },
    { name: 'results', label: 'Results', type: 'editable', allowedComponents: ['search-bar', 'filter-panel'], maxComponents: 2 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Content Page template (most common — articles, about, etc.)
 * Locked: Header, Footer
 * Editable: Main (unlimited), Sidebar (optional, limited)
 */
const contentPage: PageTemplate = {
  slug: 'content-page',
  label: 'Content Page',
  description: 'Standard content page with main area and optional sidebar.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'main', label: 'Main Content', type: 'editable', allowedComponents: MAIN_COMPONENTS, maxComponents: 0 },
    {
      name: 'sidebar',
      label: 'Sidebar',
      type: 'editable',
      allowedComponents: SIDEBAR_COMPONENTS,
      maxComponents: 8,
    },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/**
 * Flexible Page template — most freedom
 * Locked: Header, Footer
 * Editable: Full Body (all 53 component types)
 */
const flexiblePage: PageTemplate = {
  slug: 'flexible-page',
  label: 'Flexible Page',
  description: 'Maximum editorial freedom — full body zone with no restrictions.',
  zones: [
    { name: 'header', label: 'Header', type: 'locked', lockedComponent: 'site-header' },
    { name: 'body', label: 'Full Body', type: 'editable', allowedComponents: ALL_COMPONENTS, maxComponents: 0 },
    { name: 'footer', label: 'Footer', type: 'locked', lockedComponent: 'site-footer' },
  ],
}

/** All templates indexed by slug */
export const templates: Record<TemplateName, PageTemplate> = {
  'homepage': homepage,
  'board-detail': boardDetail,
  'project-detail': projectDetail,
  'active-projects': activeProjects,
  'open-consultations': openConsultations,
  'search-results': searchResults,
  'content-page': contentPage,
  'flexible-page': flexiblePage,
}

/** Array of all templates (for iteration) */
export const templateList: PageTemplate[] = Object.values(templates)

/** Select options for the template field on the pages collection */
export const templateOptions = templateList.map((t) => ({
  label: t.label,
  value: t.slug,
}))

/** Get a template by slug, returns undefined if not found */
export function getTemplate(slug: string): PageTemplate | undefined {
  return templates[slug as TemplateName]
}

/** Get only the editable zones for a template */
export function getEditableZones(slug: string) {
  const template = getTemplate(slug)
  if (!template) return []
  return template.zones.filter((z) => z.type === 'editable')
}

/** Get only the locked zones for a template */
export function getLockedZones(slug: string) {
  const template = getTemplate(slug)
  if (!template) return []
  return template.zones.filter((z) => z.type === 'locked')
}

/** Check if a component type is allowed in a specific zone */
export function isComponentAllowedInZone(componentType: string, zone: { allowedComponents?: string[] }): boolean {
  // If allowedComponents is empty or undefined, all components are allowed
  if (!zone.allowedComponents || zone.allowedComponents.length === 0) return true
  return zone.allowedComponents.includes(componentType)
}

/** Create an empty BuilderLayout for a template (all editable zones with empty arrays) */
export function createEmptyLayout(slug: string): { zones: Record<string, never[]> } {
  const editableZones = getEditableZones(slug)
  const zones: Record<string, never[]> = {}
  for (const zone of editableZones) {
    zones[zone.name] = []
  }
  return { zones }
}
