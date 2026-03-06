/**
 * @description
 * Defines the props schema system for page builder components.
 * Each component registers a schema describing its configurable fields,
 * which the Props Drawer uses to render the editing form.
 *
 * Key features:
 * - PropField: describes a single configurable property
 * - Supports text, number, select, checkbox, richtext, media, relationship, array, group types
 * - Data-driven widgets use dataSourceSchema for Manual/Dynamic toggle
 *
 * @dependencies
 * - None (pure types)
 *
 * @notes
 * - Field types align with Payload field types where possible
 * - Array fields contain nested PropField[] for item shape
 * - Group fields contain nested PropField[] for sub-fields
 */

/** Supported prop field types */
export type PropFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'select'
  | 'checkbox'
  | 'richtext'
  | 'media'
  | 'relationship'
  | 'array'
  | 'group'
  | 'color'

/** A select option */
export interface PropSelectOption {
  label: string
  value: string
}

/** A single configurable prop field */
export interface PropField {
  /** Field key in the component's props object */
  name: string
  /** Human-readable label */
  label: string
  /** Field type */
  type: PropFieldType
  /** Whether this field is required */
  required?: boolean
  /** Default value */
  defaultValue?: unknown
  /** For select fields: available options */
  options?: PropSelectOption[]
  /** For relationship fields: the collection slug to relate to */
  relationTo?: string
  /** For array fields: the shape of each item */
  fields?: PropField[]
  /** For group fields: nested sub-fields */
  subFields?: PropField[]
  /** For number fields: min/max constraints */
  min?: number
  max?: number
  /** Admin-facing description / help text */
  description?: string
}

/** Props schema for a component — array of prop fields */
export type PropsSchema = PropField[]

/**
 * Data source schema for data-driven widgets.
 * Allows editors to choose Manual (inline data) or Dynamic (collection query).
 */
export const dataSourceFields: PropField[] = [
  {
    name: 'dataSource',
    label: 'Data Source',
    type: 'select',
    defaultValue: 'dynamic',
    options: [
      { label: 'Manual', value: 'manual' },
      { label: 'Dynamic', value: 'dynamic' },
    ],
  },
  {
    name: 'collection',
    label: 'Collection',
    type: 'select',
    description: 'Collection to query (when Data Source = Dynamic)',
    options: [
      { label: 'Projects', value: 'projects' },
      { label: 'News', value: 'news' },
      { label: 'Events', value: 'events' },
      { label: 'Documents', value: 'documents' },
      { label: 'Resources', value: 'resources' },
      { label: 'Consultations', value: 'consultations' },
      { label: 'Board Members', value: 'board-members' },
      { label: 'Contacts', value: 'contacts' },
      { label: 'Standards', value: 'standards' },
      { label: 'Effective Dates', value: 'effective-dates' },
    ],
  },
  {
    name: 'boardFilter',
    label: 'Board Filter',
    type: 'relationship',
    relationTo: 'boards',
    description: 'Filter results by board (when Data Source = Dynamic)',
  },
  {
    name: 'limit',
    label: 'Limit',
    type: 'number',
    min: 1,
    max: 100,
    defaultValue: 10,
    description: 'Maximum number of items to display',
  },
  {
    name: 'sortOrder',
    label: 'Sort Order',
    type: 'select',
    defaultValue: 'newest',
    options: [
      { label: 'Newest First', value: 'newest' },
      { label: 'Oldest First', value: 'oldest' },
      { label: 'Alphabetical', value: 'alpha' },
    ],
  },
]
