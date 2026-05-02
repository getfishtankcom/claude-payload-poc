/**
 * @description
 * Shared types for the page builder template system.
 * Defines the shape of template zone configurations, layout JSON,
 * and component instances used throughout the page builder.
 *
 * Key features:
 * - TemplateZone: locked or editable zone definition
 * - PageTemplate: full template config with zones array
 * - ComponentInstance: a placed component in a zone
 * - BuilderLayout: the JSON stored in the pages collection
 *
 * @dependencies
 * - None (pure types)
 *
 * @notes
 * - Layout JSON schema must be stable — changing it breaks existing pages
 * - Component IDs use nanoid-style random strings
 * - Data source modes: 'manual' for inline data, 'dynamic' for collection queries
 */

/** A single zone in a page template */
export interface TemplateZone {
  /** Unique zone identifier (e.g., 'header', 'main', 'sidebar') */
  name: string
  /** Human-readable label */
  label: string
  /** Whether editors can modify this zone */
  type: 'locked' | 'editable'
  /** For locked zones: the component type placed here */
  lockedComponent?: string
  /** For editable zones: which component types are allowed (empty = all) */
  allowedComponents?: string[]
  /** For editable zones: max number of components (0 = unlimited) */
  maxComponents?: number
}

/** A page template definition */
export interface PageTemplate {
  /** Unique template identifier */
  slug: string
  /** Human-readable name */
  label: string
  /** Description shown in the template picker */
  description: string
  /** Ordered array of zones */
  zones: TemplateZone[]
}

/** A component instance placed in a zone */
export interface ComponentInstance {
  /** Unique instance ID (nanoid) */
  id: string
  /** Component type from the registry (e.g., 'rich-text', 'card-grid') */
  type: string
  /** Component configuration values */
  props: Record<string, unknown>
}

/** The layout JSON stored on the page document */
export interface BuilderLayout {
  /** Map of zone name -> array of component instances */
  zones: Record<string, ComponentInstance[]>
}

/** Template slug union type for type safety */
export type TemplateName =
  | 'homepage'
  | 'board-detail'
  | 'project-detail'
  | 'active-projects'
  | 'open-consultations'
  | 'search-results'
  | 'content-page'
  | 'flexible-page'
