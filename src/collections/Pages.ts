/**
 * Pages collection — content pages with the page-builder architecture.
 * Tabs: Hero / Content (blocks) / Sidebar / CTA & News / Form Config /
 * Listing Config / SEO. Workflow + search-sync + board-filter + locking
 * + tree-hierarchy chrome via `withWorkflow` + extra fields below.
 *
 * @notes
 * - Hero is a group field (not a block) — lives above the layout
 * - Locking (lockedBy/lockedAt) is page-specific — extra fields below
 * - clearExpiredLock runs before workflow validation via `extraHooks`
 */
import type { CollectionConfig } from 'payload'

import { hero } from '@/heros/config'
import { blocks } from '@/blocks'
import { clearExpiredLock } from '@/admin/hooks/locking-hooks'
import { templateOptions } from '@/admin/templates'
import { withWorkflow } from './_lib/with-workflow'

export const Pages: CollectionConfig = withWorkflow(
  {
    slug: 'pages',
    admin: {
      useAsTitle: 'title',
      defaultColumns: ['title', 'slug', 'workflowState', 'publishedAt'],
    },
    fields: [
      { name: 'title', type: 'text', required: true, localized: true, label: 'Page Title' },
      {
        name: 'slug',
        type: 'text',
        localized: true,
        required: true,
        unique: true,
        label: 'Slug',
        admin: { position: 'sidebar' },
      },
      {
        name: 'publishedAt',
        type: 'date',
        label: 'Published At',
        admin: { position: 'sidebar', date: { pickerAppearance: 'dayAndTime' } },
      },
      {
        name: 'sidebar_type',
        type: 'select',
        label: 'Sidebar Type',
        defaultValue: 'none',
        options: [
          { label: 'Staff Contact', value: 'staff_contact' },
          { label: 'Section Navigation', value: 'section_nav' },
          { label: 'None', value: 'none' },
        ],
        admin: { position: 'sidebar' },
      },
      {
        name: 'pageLayout',
        type: 'select',
        label: 'Page Layout',
        defaultValue: 'default',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Simple Content', value: 'simple-content' },
        ],
        admin: {
          position: 'sidebar',
          description: 'T17 layout variant — simple-content for job listings etc.',
        },
      },
      {
        name: 'board',
        type: 'relationship',
        relationTo: 'boards',
        label: 'Board',
        admin: {
          position: 'sidebar',
          description: 'Associated board for board-scoped pages',
        },
      },
      // --- Page Builder fields (Epic 25) ---
      {
        name: 'template',
        type: 'select',
        label: 'Page Template',
        options: templateOptions,
        admin: {
          position: 'sidebar',
          description: 'Template determines locked/editable zones in the page builder',
        },
      },
      {
        name: 'builderLayout',
        type: 'json',
        label: 'Builder Layout',
        admin: {
          description: 'Page builder component layout JSON — managed by the visual builder',
          condition: () => false,
        },
      },
      // --- Tree hierarchy fields (Epic 23) ---
      {
        name: 'parent',
        type: 'relationship',
        relationTo: 'pages',
        label: 'Parent Page',
        admin: {
          position: 'sidebar',
          description: 'Parent item in the content tree hierarchy',
        },
        index: true,
      },
      {
        name: 'sortOrder',
        type: 'number',
        label: 'Sort Order',
        defaultValue: 0,
        admin: {
          position: 'sidebar',
          description: 'Order within parent for tree display',
        },
      },
      {
        name: 'contentType',
        type: 'select',
        label: 'Content Type',
        defaultValue: 'page',
        options: [
          { label: 'Page', value: 'page' },
          { label: 'Folder', value: 'folder' },
          { label: 'News Article', value: 'news' },
          { label: 'Project', value: 'project' },
          { label: 'Event', value: 'event' },
          { label: 'Document', value: 'document' },
          { label: 'Media', value: 'media' },
          { label: 'Settings', value: 'settings' },
        ],
        admin: {
          position: 'sidebar',
          description: 'Type of content (determines tree icon)',
        },
      },
      // --- Locking fields (Epic 22 — task 22.5) ---
      {
        name: 'lockedBy',
        type: 'relationship',
        relationTo: 'users',
        label: 'Locked By',
        admin: {
          position: 'sidebar',
          readOnly: true,
          description: 'User currently editing this item',
        },
      },
      {
        name: 'lockedAt',
        type: 'date',
        label: 'Locked At',
        admin: {
          position: 'sidebar',
          readOnly: true,
          description: 'When the lock was acquired',
          date: { pickerAppearance: 'dayAndTime' },
        },
      },
      {
        type: 'tabs',
        tabs: [
          { label: 'Hero', fields: [hero] },
          {
            label: 'Content',
            fields: [
              {
                name: 'layout',
                type: 'blocks',
                blocks,
                label: 'Layout',
                admin: { initCollapsed: true },
              },
            ],
          },
          {
            label: 'Sidebar',
            fields: [
              {
                name: 'staffContacts',
                type: 'relationship',
                relationTo: 'contacts',
                hasMany: true,
                label: 'Staff Contacts',
                admin: {
                  description:
                    'Contacts shown in the staff contact sidebar (when sidebar_type = staff_contact)',
                  condition: (data) => data?.sidebar_type === 'staff_contact',
                },
              },
              {
                name: 'sectionNavLinks',
                type: 'array',
                label: 'Section Nav Links',
                admin: {
                  description:
                    'Navigation links for the section nav sidebar (when sidebar_type = section_nav)',
                  condition: (data) => data?.sidebar_type === 'section_nav',
                },
                fields: [
                  { name: 'label', type: 'text', required: true, localized: true, label: 'Label' },
                  { name: 'href', type: 'text', required: true, label: 'URL' },
                  {
                    name: 'isActive',
                    type: 'checkbox',
                    label: 'Is Active',
                    defaultValue: false,
                  },
                ],
              },
            ],
          },
          {
            label: 'CTA & News',
            fields: [
              {
                name: 'ctaBlock',
                type: 'group',
                label: 'CTA Block',
                admin: { description: 'Optional promotional call-to-action block' },
                fields: [
                  { name: 'heading', type: 'text', localized: true, label: 'Heading' },
                  { name: 'description', type: 'textarea', localized: true, label: 'Description' },
                  { name: 'buttonLabel', type: 'text', localized: true, label: 'Button Label' },
                  { name: 'buttonHref', type: 'text', label: 'Button URL' },
                  {
                    name: 'variant',
                    type: 'select',
                    label: 'Variant',
                    defaultValue: 'light',
                    options: [
                      { label: 'Light', value: 'light' },
                      { label: 'Dark Purple', value: 'dark-purple' },
                    ],
                  },
                ],
              },
              {
                name: 'newsSection',
                type: 'checkbox',
                label: 'Show News Section',
                defaultValue: false,
                admin: { description: 'Display a related news feed section on this page' },
              },
            ],
          },
          {
            label: 'Form Config',
            fields: [
              {
                name: 'formConfig',
                type: 'group',
                label: 'Form Configuration',
                admin: { description: 'T15 — Contact/media inquiry form settings' },
                fields: [
                  {
                    name: 'captchaEnabled',
                    type: 'checkbox',
                    label: 'Enable CAPTCHA',
                    defaultValue: true,
                  },
                ],
              },
              {
                name: 'mediaInquiries',
                type: 'group',
                label: 'Media Inquiries',
                admin: { description: 'Contact information for media inquiries section' },
                fields: [
                  {
                    name: 'heading',
                    type: 'text',
                    localized: true,
                    label: 'Heading',
                    defaultValue: 'Media Inquiries',
                  },
                  { name: 'contactName', type: 'text', localized: true, label: 'Contact Name' },
                  { name: 'contactTitle', type: 'text', localized: true, label: 'Contact Title' },
                  { name: 'contactEmail', type: 'email', label: 'Contact Email' },
                  { name: 'contactPhone', type: 'text', label: 'Contact Phone' },
                ],
              },
            ],
          },
          {
            label: 'Listing Config',
            fields: [
              {
                name: 'listingHeading',
                type: 'text',
                localized: true,
                label: 'Listing Heading',
                admin: {
                  description:
                    'T17 — Heading above the dynamic listing area (e.g., "Open Positions")',
                },
              },
              {
                name: 'emptyStateMessage',
                type: 'richText',
                localized: true,
                label: 'Empty State Message',
                admin: { description: 'Message shown when no items exist in the listing' },
              },
            ],
          },
          {
            label: 'SEO',
            fields: [
              {
                name: 'meta',
                type: 'group',
                label: false,
                fields: [
                  { name: 'meta_title', type: 'text', label: 'Meta Title' },
                  { name: 'meta_description', type: 'textarea', label: 'Meta Description' },
                  {
                    name: 'og_image',
                    type: 'upload',
                    relationTo: 'media',
                    label: 'Open Graph Image',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    searchable: true,
    boardFiltered: true,
    extraEditChrome: [
      '/admin/components/FavoriteButtonField',
      '/admin/components/FrTranslationWarning',
      '/admin/components/VersionDiffButton',
      '/admin/components/LanguageSwitcher',
      '/admin/components/LockIndicator',
    ],
    extraHooks: { beforeChange: [clearExpiredLock] },
  },
)
