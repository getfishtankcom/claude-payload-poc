/**
 * @description
 * Central registry of all 31 page builder components.
 * Each component type registers its metadata, category, allowed zones,
 * props schema, and icon identifier. The page builder toolbox, canvas,
 * and props drawer all consume this registry.
 *
 * Key features:
 * - 4 categories: Content Blocks (10), Layout (7), Data-Driven (9), Interactive (5)
 * - Each component: type, label, category, icon, allowedZones, propsSchema
 * - Data-driven widgets include dataSourceFields for Manual/Dynamic toggle
 * - Helper functions for lookup, filtering by category, and zone compatibility
 *
 * @dependencies
 * - props-schema.ts: PropField, PropsSchema, dataSourceFields
 *
 * @notes
 * - Component types use kebab-case slugs (e.g., 'rich-text', 'card-grid')
 * - Icons reference Heroicons identifiers — rendered by the toolbox/canvas
 * - allowedZones empty array = allowed in all zones
 * - Components are code-only — admins cannot register custom types
 */

import type { PropsSchema } from './props-schema'
import { dataSourceFields } from './props-schema'

export type { PropsSchema, PropField, PropFieldType, PropSelectOption } from './props-schema'

/** Component category */
export type ComponentCategory = 'content' | 'layout' | 'data' | 'interactive'

/** Category metadata */
export interface CategoryInfo {
  slug: ComponentCategory
  label: string
  description: string
}

export const categories: CategoryInfo[] = [
  { slug: 'content', label: 'Content Blocks', description: 'Rich text, headings, images, and media' },
  { slug: 'layout', label: 'Layout Components', description: 'Cards, columns, heroes, and CTAs' },
  { slug: 'data', label: 'Data-Driven Widgets', description: 'Dynamic content from CMS collections' },
  { slug: 'interactive', label: 'Interactive Elements', description: 'Search, filters, forms, and actions' },
]

/** A registered page builder component type */
export interface BuilderComponentType {
  /** Unique slug (kebab-case) */
  type: string
  /** Human-readable label */
  label: string
  /** Category */
  category: ComponentCategory
  /** Heroicon identifier */
  icon: string
  /** Short description for the add-component modal */
  description: string
  /** Which zone names this component is allowed in (empty = all) */
  allowedZones: string[]
  /** Configurable props schema */
  propsSchema: PropsSchema
}

// ---------------------------------------------------------------------------
// CONTENT BLOCKS (10)
// ---------------------------------------------------------------------------

const richText: BuilderComponentType = {
  type: 'rich-text',
  label: 'Rich Text',
  category: 'content',
  icon: 'DocumentTextIcon',
  description: 'WYSIWYG block with formatting toolbar',
  allowedZones: [],
  propsSchema: [
    { name: 'content', label: 'Content', type: 'richtext', required: true },
  ],
}

const heading: BuilderComponentType = {
  type: 'heading',
  label: 'Heading',
  category: 'content',
  icon: 'HashtagIcon',
  description: 'H1-H6 heading with alignment',
  allowedZones: [],
  propsSchema: [
    { name: 'text', label: 'Text', type: 'text', required: true },
    {
      name: 'level',
      label: 'Level',
      type: 'select',
      defaultValue: '2',
      options: [
        { label: 'H1', value: '1' },
        { label: 'H2', value: '2' },
        { label: 'H3', value: '3' },
        { label: 'H4', value: '4' },
        { label: 'H5', value: '5' },
        { label: 'H6', value: '6' },
      ],
    },
    {
      name: 'alignment',
      label: 'Alignment',
      type: 'select',
      defaultValue: 'left',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
      ],
    },
  ],
}

const image: BuilderComponentType = {
  type: 'image',
  label: 'Image',
  category: 'content',
  icon: 'PhotoIcon',
  description: 'Single image with caption',
  allowedZones: [],
  propsSchema: [
    { name: 'image', label: 'Image', type: 'media', required: true },
    { name: 'altText', label: 'Alt Text', type: 'text', required: true },
    { name: 'caption', label: 'Caption', type: 'text' },
    {
      name: 'alignment',
      label: 'Alignment',
      type: 'select',
      defaultValue: 'center',
      options: [
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' },
        { label: 'Full Width', value: 'full' },
      ],
    },
    {
      name: 'size',
      label: 'Size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
        { label: 'Full Width', value: 'full' },
      ],
    },
  ],
}

const video: BuilderComponentType = {
  type: 'video',
  label: 'Video',
  category: 'content',
  icon: 'VideoCameraIcon',
  description: 'Embedded video (YouTube/Vimeo)',
  allowedZones: [],
  propsSchema: [
    { name: 'url', label: 'Video URL', type: 'text', required: true, description: 'YouTube or Vimeo URL' },
    { name: 'posterImage', label: 'Poster Image', type: 'media' },
    { name: 'autoplay', label: 'Autoplay', type: 'checkbox', defaultValue: false },
  ],
}

const accordion: BuilderComponentType = {
  type: 'accordion',
  label: 'Accordion',
  category: 'content',
  icon: 'Bars3BottomLeftIcon',
  description: 'Expandable content sections',
  allowedZones: [],
  propsSchema: [
    {
      name: 'items',
      label: 'Items',
      type: 'array',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'content', label: 'Content', type: 'richtext', required: true },
      ],
    },
    { name: 'defaultExpanded', label: 'Default Expanded', type: 'checkbox', defaultValue: false },
  ],
}

const tabs: BuilderComponentType = {
  type: 'tabs',
  label: 'Tabs',
  category: 'content',
  icon: 'RectangleGroupIcon',
  description: 'Tabbed content panels',
  allowedZones: [],
  propsSchema: [
    {
      name: 'tabs',
      label: 'Tabs',
      type: 'array',
      fields: [
        { name: 'label', label: 'Tab Label', type: 'text', required: true },
        { name: 'content', label: 'Content', type: 'richtext', required: true },
      ],
    },
    { name: 'defaultActive', label: 'Default Active Tab', type: 'number', defaultValue: 0, min: 0 },
  ],
}

const table: BuilderComponentType = {
  type: 'table',
  label: 'Table',
  category: 'content',
  icon: 'TableCellsIcon',
  description: 'Data table with rows and columns',
  allowedZones: [],
  propsSchema: [
    { name: 'content', label: 'Table Content', type: 'richtext', required: true, description: 'Use the rich text editor table features' },
    { name: 'headerRow', label: 'Header Row', type: 'checkbox', defaultValue: true },
    { name: 'striped', label: 'Striped Rows', type: 'checkbox', defaultValue: false },
  ],
}

const blockquote: BuilderComponentType = {
  type: 'blockquote',
  label: 'Blockquote',
  category: 'content',
  icon: 'ChatBubbleBottomCenterTextIcon',
  description: 'Styled quotation with attribution',
  allowedZones: [],
  propsSchema: [
    { name: 'quote', label: 'Quote Text', type: 'textarea', required: true },
    { name: 'attribution', label: 'Attribution', type: 'text' },
    {
      name: 'variant',
      label: 'Style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Highlighted', value: 'highlighted' },
      ],
    },
  ],
}

const divider: BuilderComponentType = {
  type: 'divider',
  label: 'Divider',
  category: 'content',
  icon: 'MinusIcon',
  description: 'Visual separator between sections',
  allowedZones: [],
  propsSchema: [
    {
      name: 'style',
      label: 'Style',
      type: 'select',
      defaultValue: 'line',
      options: [
        { label: 'Line', value: 'line' },
        { label: 'Dots', value: 'dots' },
        { label: 'Space', value: 'space' },
      ],
    },
    {
      name: 'spacing',
      label: 'Spacing',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
  ],
}

const imageGrid: BuilderComponentType = {
  type: 'image-grid',
  label: 'Image Grid',
  category: 'content',
  icon: 'Squares2X2Icon',
  description: 'Multi-image display grid for logos, galleries',
  allowedZones: [],
  propsSchema: [
    {
      name: 'images',
      label: 'Images',
      type: 'array',
      fields: [
        { name: 'image', label: 'Image', type: 'media', required: true },
        { name: 'caption', label: 'Caption', type: 'text' },
        { name: 'link', label: 'Link URL', type: 'text' },
      ],
    },
    { name: 'columns', label: 'Columns', type: 'number', defaultValue: 3, min: 2, max: 6 },
    {
      name: 'gap',
      label: 'Gap Size',
      type: 'select',
      defaultValue: 'medium',
      options: [
        { label: 'Small', value: 'small' },
        { label: 'Medium', value: 'medium' },
        { label: 'Large', value: 'large' },
      ],
    },
    {
      name: 'imageFit',
      label: 'Image Fit',
      type: 'select',
      defaultValue: 'cover',
      options: [
        { label: 'Cover', value: 'cover' },
        { label: 'Contain', value: 'contain' },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// LAYOUT COMPONENTS (7)
// ---------------------------------------------------------------------------

const cardGrid: BuilderComponentType = {
  type: 'card-grid',
  label: 'Card Grid',
  category: 'layout',
  icon: 'ViewColumnsIcon',
  description: 'Grid of content cards',
  allowedZones: [],
  propsSchema: [
    { name: 'columns', label: 'Columns', type: 'number', defaultValue: 3, min: 2, max: 4 },
    {
      name: 'style',
      label: 'Style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Bordered', value: 'bordered' },
        { label: 'Elevated', value: 'elevated' },
      ],
    },
    {
      name: 'items',
      label: 'Cards',
      type: 'array',
      fields: [
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'image', label: 'Image', type: 'media' },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'link', label: 'Link URL', type: 'text' },
      ],
    },
  ],
}

const twoColumn: BuilderComponentType = {
  type: 'two-column',
  label: '2-Column',
  category: 'layout',
  icon: 'Squares2X2Icon',
  description: 'Two-column layout with configurable ratio',
  allowedZones: [],
  propsSchema: [
    {
      name: 'ratio',
      label: 'Column Ratio',
      type: 'select',
      defaultValue: '50-50',
      options: [
        { label: '50/50', value: '50-50' },
        { label: '60/40', value: '60-40' },
        { label: '70/30', value: '70-30' },
        { label: '40/60', value: '40-60' },
        { label: '30/70', value: '30-70' },
      ],
    },
    { name: 'leftContent', label: 'Left Column', type: 'richtext' },
    { name: 'rightContent', label: 'Right Column', type: 'richtext' },
  ],
}

const threeColumn: BuilderComponentType = {
  type: 'three-column',
  label: '3-Column',
  category: 'layout',
  icon: 'ViewColumnsIcon',
  description: 'Three-column layout',
  allowedZones: [],
  propsSchema: [
    { name: 'equalWidths', label: 'Equal Widths', type: 'checkbox', defaultValue: true },
    { name: 'col1Content', label: 'Column 1', type: 'richtext' },
    { name: 'col2Content', label: 'Column 2', type: 'richtext' },
    { name: 'col3Content', label: 'Column 3', type: 'richtext' },
  ],
}

const heroBanner: BuilderComponentType = {
  type: 'hero-banner',
  label: 'Hero Banner',
  category: 'layout',
  icon: 'RectangleGroupIcon',
  description: 'Full-width hero with heading, subheading, and CTA',
  allowedZones: [],
  propsSchema: [
    { name: 'heading', label: 'Heading', type: 'text', required: true },
    { name: 'subheading', label: 'Subheading', type: 'text' },
    { name: 'ctaLabel', label: 'CTA Button Label', type: 'text' },
    { name: 'ctaUrl', label: 'CTA Button URL', type: 'text' },
    { name: 'backgroundImage', label: 'Background Image', type: 'media' },
    {
      name: 'backgroundStyle',
      label: 'Background Style',
      type: 'select',
      defaultValue: 'gradient',
      options: [
        { label: 'Gradient', value: 'gradient' },
        { label: 'Image', value: 'image' },
        { label: 'Solid Color', value: 'solid' },
      ],
    },
  ],
}

const ctaBanner: BuilderComponentType = {
  type: 'cta-banner',
  label: 'CTA Banner',
  category: 'layout',
  icon: 'MegaphoneIcon',
  description: 'Call-to-action strip with heading and button',
  allowedZones: [],
  propsSchema: [
    { name: 'heading', label: 'Heading', type: 'text', required: true },
    { name: 'body', label: 'Body Text', type: 'textarea' },
    { name: 'buttonLabel', label: 'Button Label', type: 'text', required: true },
    { name: 'buttonUrl', label: 'Button URL', type: 'text', required: true },
    {
      name: 'variant',
      label: 'Style',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Dark', value: 'dark' },
        { label: 'Purple', value: 'purple' },
      ],
    },
  ],
}

const featureRow: BuilderComponentType = {
  type: 'feature-row',
  label: 'Feature Row',
  category: 'layout',
  icon: 'SparklesIcon',
  description: 'Icon + text feature block',
  allowedZones: [],
  propsSchema: [
    { name: 'icon', label: 'Icon', type: 'text', description: 'Heroicon name (e.g., AcademicCapIcon)' },
    { name: 'heading', label: 'Heading', type: 'text', required: true },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'link', label: 'Link URL', type: 'text' },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal', value: 'horizontal' },
        { label: 'Vertical', value: 'vertical' },
      ],
    },
  ],
}

const statsBar: BuilderComponentType = {
  type: 'stats-bar',
  label: 'Stats Bar',
  category: 'layout',
  icon: 'ChartBarIcon',
  description: 'Key statistics display',
  allowedZones: [],
  propsSchema: [
    {
      name: 'stats',
      label: 'Statistics',
      type: 'array',
      fields: [
        { name: 'number', label: 'Number', type: 'text', required: true },
        { name: 'label', label: 'Label', type: 'text', required: true },
        { name: 'icon', label: 'Icon', type: 'text' },
      ],
    },
    {
      name: 'backgroundStyle',
      label: 'Background',
      type: 'select',
      defaultValue: 'light',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Gradient', value: 'gradient' },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// DATA-DRIVEN WIDGETS (9)
// ---------------------------------------------------------------------------

const projectList: BuilderComponentType = {
  type: 'project-list',
  label: 'Project List',
  category: 'data',
  icon: 'ClipboardDocumentListIcon',
  description: 'Dynamic project listing with filters',
  allowedZones: [],
  propsSchema: [
    ...dataSourceFields,
    {
      name: 'statusFilter',
      label: 'Status Filter',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Active', value: 'active' },
        { label: 'Completed', value: 'completed' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'displayStyle',
      label: 'Display Style',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Cards', value: 'cards' },
        { label: 'List', value: 'list' },
      ],
    },
  ],
}

const newsFeed: BuilderComponentType = {
  type: 'news-feed',
  label: 'News Feed',
  category: 'data',
  icon: 'NewspaperIcon',
  description: 'Dynamic news listing',
  allowedZones: [],
  propsSchema: [
    ...dataSourceFields,
    { name: 'showExcerpts', label: 'Show Excerpts', type: 'checkbox', defaultValue: true },
    {
      name: 'categoryFilter',
      label: 'Category Filter',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'News Release', value: 'news-release' },
        { label: 'Announcement', value: 'announcement' },
      ],
      defaultValue: 'all',
    },
  ],
}

const eventCalendar: BuilderComponentType = {
  type: 'event-calendar',
  label: 'Event Calendar',
  category: 'data',
  icon: 'CalendarIcon',
  description: 'Upcoming events listing',
  allowedZones: [],
  propsSchema: [
    ...dataSourceFields,
    {
      name: 'eventTypeFilter',
      label: 'Event Type',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Meeting', value: 'meeting' },
        { label: 'Webinar', value: 'webinar' },
        { label: 'Deadline', value: 'deadline' },
      ],
      defaultValue: 'all',
    },
    {
      name: 'displayStyle',
      label: 'Display Style',
      type: 'select',
      defaultValue: 'list',
      options: [
        { label: 'List', value: 'list' },
        { label: 'Calendar', value: 'calendar' },
      ],
    },
  ],
}

const documentTable: BuilderComponentType = {
  type: 'document-table',
  label: 'Document Table',
  category: 'data',
  icon: 'DocumentIcon',
  description: 'Filterable document listing',
  allowedZones: [],
  propsSchema: [
    ...dataSourceFields,
    {
      name: 'typeFilter',
      label: 'Document Type',
      type: 'select',
      options: [
        { label: 'All', value: 'all' },
        { label: 'Standard', value: 'standard' },
        { label: 'Guidance', value: 'guidance' },
        { label: 'Discussion Paper', value: 'discussion-paper' },
      ],
      defaultValue: 'all',
    },
    { name: 'searchable', label: 'Show Search', type: 'checkbox', defaultValue: true },
  ],
}

const contactCard: BuilderComponentType = {
  type: 'contact-card',
  label: 'Contact Card',
  category: 'data',
  icon: 'UserCircleIcon',
  description: 'Staff contact display',
  allowedZones: [],
  propsSchema: [
    { name: 'contact', label: 'Contact', type: 'relationship', relationTo: 'contacts', required: true },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'card',
      options: [
        { label: 'Card', value: 'card' },
        { label: 'Inline', value: 'inline' },
      ],
    },
  ],
}

const boardMembersGrid: BuilderComponentType = {
  type: 'board-members-grid',
  label: 'Board Members Grid',
  category: 'data',
  icon: 'UserGroupIcon',
  description: 'Board member listing with photos',
  allowedZones: [],
  propsSchema: [
    { name: 'board', label: 'Board', type: 'relationship', relationTo: 'boards', required: true },
    { name: 'showBio', label: 'Show Bio', type: 'checkbox', defaultValue: true },
    { name: 'columns', label: 'Columns', type: 'number', defaultValue: 3, min: 2, max: 4 },
  ],
}

const consultationCountdown: BuilderComponentType = {
  type: 'consultation-countdown',
  label: 'Consultation Countdown',
  category: 'data',
  icon: 'ClockIcon',
  description: 'Active consultation with countdown timer',
  allowedZones: [],
  propsSchema: [
    { name: 'consultation', label: 'Consultation', type: 'relationship', relationTo: 'consultations', required: true },
    { name: 'showDescription', label: 'Show Description', type: 'checkbox', defaultValue: true },
  ],
}

const standardsList: BuilderComponentType = {
  type: 'standards-list',
  label: 'Standards List',
  category: 'data',
  icon: 'BookOpenIcon',
  description: 'Grouped list of standards with section headers',
  allowedZones: [],
  propsSchema: [
    ...dataSourceFields,
    {
      name: 'grouping',
      label: 'Grouping',
      type: 'select',
      defaultValue: 'by-section',
      options: [
        { label: 'By Section', value: 'by-section' },
        { label: 'By Type', value: 'by-type' },
      ],
    },
    { name: 'showDescriptions', label: 'Show Descriptions', type: 'checkbox', defaultValue: true },
    { name: 'defaultCollapsed', label: 'Default Collapsed', type: 'checkbox', defaultValue: false },
  ],
}

const effectiveDatesTable: BuilderComponentType = {
  type: 'effective-dates-table',
  label: 'Effective Dates Table',
  category: 'data',
  icon: 'CalendarDaysIcon',
  description: 'Standards effective date tracking table',
  allowedZones: [],
  propsSchema: [
    ...dataSourceFields,
    { name: 'sectionHeaderColor', label: 'Section Header Color', type: 'color', description: 'Board-specific color' },
    { name: 'footnotes', label: 'Footnotes', type: 'richtext' },
  ],
}

// ---------------------------------------------------------------------------
// INTERACTIVE ELEMENTS (5)
// ---------------------------------------------------------------------------

const searchBar: BuilderComponentType = {
  type: 'search-bar',
  label: 'Search Bar',
  category: 'interactive',
  icon: 'MagnifyingGlassIcon',
  description: 'Inline search input',
  allowedZones: [],
  propsSchema: [
    { name: 'placeholder', label: 'Placeholder Text', type: 'text', defaultValue: 'Search...' },
    {
      name: 'scope',
      label: 'Search Scope',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All Content', value: 'all' },
        { label: 'Current Board', value: 'board' },
        { label: 'Projects Only', value: 'projects' },
      ],
    },
  ],
}

const filterPanel: BuilderComponentType = {
  type: 'filter-panel',
  label: 'Filter Panel',
  category: 'interactive',
  icon: 'FunnelIcon',
  description: 'Faceted filter controls',
  allowedZones: [],
  propsSchema: [
    {
      name: 'facets',
      label: 'Facets',
      type: 'array',
      fields: [
        { name: 'name', label: 'Facet Name', type: 'text', required: true },
        {
          name: 'type',
          label: 'Facet Type',
          type: 'select',
          options: [
            { label: 'Board', value: 'board' },
            { label: 'Type', value: 'type' },
            { label: 'Date Range', value: 'date-range' },
            { label: 'Status', value: 'status' },
          ],
        },
      ],
    },
    {
      name: 'layout',
      label: 'Layout',
      type: 'select',
      defaultValue: 'vertical',
      options: [
        { label: 'Vertical', value: 'vertical' },
        { label: 'Horizontal', value: 'horizontal' },
      ],
    },
  ],
}

const newsletterSignup: BuilderComponentType = {
  type: 'newsletter-signup',
  label: 'Newsletter Signup',
  category: 'interactive',
  icon: 'EnvelopeIcon',
  description: 'Email subscription form (HubSpot)',
  allowedZones: [],
  propsSchema: [
    { name: 'heading', label: 'Heading', type: 'text', defaultValue: 'Stay Updated' },
    { name: 'description', label: 'Description', type: 'textarea' },
    { name: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Subscribe' },
    { name: 'hubspotFormId', label: 'HubSpot Form ID', type: 'text', required: true },
  ],
}

const downloadButton: BuilderComponentType = {
  type: 'download-button',
  label: 'Download Button',
  category: 'interactive',
  icon: 'ArrowDownTrayIcon',
  description: 'File download call-to-action',
  allowedZones: [],
  propsSchema: [
    { name: 'document', label: 'Document', type: 'media', required: true },
    { name: 'buttonText', label: 'Button Text', type: 'text', defaultValue: 'Download' },
    {
      name: 'variant',
      label: 'Style',
      type: 'select',
      defaultValue: 'primary',
      options: [
        { label: 'Primary', value: 'primary' },
        { label: 'Secondary', value: 'secondary' },
        { label: 'Outline', value: 'outline' },
      ],
    },
  ],
}

const anchorLink: BuilderComponentType = {
  type: 'anchor-link',
  label: 'Anchor Link',
  category: 'interactive',
  icon: 'LinkIcon',
  description: 'In-page navigation anchor',
  allowedZones: [],
  propsSchema: [
    { name: 'anchorId', label: 'Anchor ID', type: 'text', required: true },
    {
      name: 'display',
      label: 'Display',
      type: 'select',
      defaultValue: 'invisible',
      options: [
        { label: 'Visible Heading', value: 'visible' },
        { label: 'Invisible', value: 'invisible' },
      ],
    },
  ],
}

// ---------------------------------------------------------------------------
// REGISTRY
// ---------------------------------------------------------------------------

/** All 31 registered component types */
export const componentRegistry: BuilderComponentType[] = [
  // Content Blocks (10)
  richText, heading, image, video, accordion, tabs, table, blockquote, divider, imageGrid,
  // Layout Components (7)
  cardGrid, twoColumn, threeColumn, heroBanner, ctaBanner, featureRow, statsBar,
  // Data-Driven Widgets (9)
  projectList, newsFeed, eventCalendar, documentTable, contactCard,
  boardMembersGrid, consultationCountdown, standardsList, effectiveDatesTable,
  // Interactive Elements (5)
  searchBar, filterPanel, newsletterSignup, downloadButton, anchorLink,
]

/** Registry indexed by component type slug */
export const componentsByType: Record<string, BuilderComponentType> = Object.fromEntries(
  componentRegistry.map((c) => [c.type, c]),
)

/** Get components filtered by category */
export function getComponentsByCategory(category: ComponentCategory): BuilderComponentType[] {
  return componentRegistry.filter((c) => c.category === category)
}

/** Get a component type by its slug */
export function getComponentType(type: string): BuilderComponentType | undefined {
  return componentsByType[type]
}

/** Search components by label (case-insensitive partial match) */
export function searchComponents(query: string): BuilderComponentType[] {
  const lower = query.toLowerCase()
  return componentRegistry.filter(
    (c) => c.label.toLowerCase().includes(lower) || c.description.toLowerCase().includes(lower),
  )
}

/** Get components allowed in a specific zone (by zone's allowedComponents list) */
export function getComponentsForZone(allowedComponents?: string[]): BuilderComponentType[] {
  if (!allowedComponents || allowedComponents.length === 0) return componentRegistry
  return componentRegistry.filter((c) => allowedComponents.includes(c.type))
}
