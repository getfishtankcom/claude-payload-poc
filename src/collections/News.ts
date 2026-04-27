/**
 * @description
 * News collection for RAS Canada news articles, announcements, and press releases.
 * Supports featured images via the media collection and board association.
 *
 * Key features:
 * - Category enum for content classification (expanded for Phase 2)
 * - Featured image upload via media collection
 * - Rich text body content
 * - Board relationship for filtering by organization
 * - External URL for link-out news items
 * - Volunteer opportunity flag for volunteer listing pages
 * - Workflow: 5-state with workflowState, workflowHistory, publishOn/unpublishOn
 * - RBAC: role-based access control (author/editor/admin)
 *
 * @dependencies
 * - Media collection (upload for featured_image)
 * - Boards collection (relationship)
 * - Users collection (createdBy relationship)
 * - workflow fields from @/fields/workflow
 * - access/roles for RBAC
 * - admin/hooks/workflow-hooks for transition validation
 *
 * @notes
 * - News stories currently have NO images in Sitecore content (fields exist but unpopulated)
 * - frasIdNumber is the Sitecore FRAS ID for migration/workflow reference
 * - Phase 2 additions: externalUrl, isVolunteerOpportunity, expanded category enum
 * - Epic 22: workflow, RBAC added
 */
import type { CollectionConfig } from 'payload'

import { syncToMeilisearch } from '@/search/meilisearch-sync'
import { workflowFields } from '@/fields/workflow'
import { contentRead, contentCreate, contentUpdate, contentDelete } from '@/access/roles'
import { validateWorkflowTransition, createLogWorkflowTransition } from '@/admin/hooks/workflow-hooks'

const { afterChange: meilisearchAfterChange, afterDelete } = syncToMeilisearch({ indexName: 'news' })

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', 'category', 'workflowState', 'board'],
    components: {
      beforeListTable: ['/admin/components/BoardFilterBar'],
      edit: {
        beforeDocumentControls: [
          '/admin/components/FrTranslationWarning',
          '/admin/components/VersionDiffButton',
        ],
      },
    },
  },
  access: {
    read: contentRead,
    create: contentCreate,
    update: contentUpdate,
    delete: contentDelete,
  },
  hooks: {
    beforeChange: [validateWorkflowTransition],
    afterChange: [createLogWorkflowTransition('news'), meilisearchAfterChange],
    afterDelete: [afterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: 'Title',
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      label: 'Publish Date',
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Document for Comment', value: 'Document for Comment' },
        { label: 'International Activity', value: 'International Activity' },
        { label: 'Meeting Summary', value: 'Meeting Summary' },
        { label: 'News', value: 'News' },
        { label: 'Resource', value: 'Resource' },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      label: 'Excerpt',
    },
    {
      name: 'body',
      type: 'richText',
      localized: true,
      label: 'Body',
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
      label: 'Featured Image',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'External URL',
      admin: {
        description: 'Link to external content — displays with external link icon',
      },
    },
    {
      name: 'isVolunteerOpportunity',
      type: 'checkbox',
      label: 'Volunteer Opportunity',
      defaultValue: false,
      admin: {
        description: 'Flag this item for volunteer opportunity listings',
        position: 'sidebar',
      },
    },
    {
      name: 'frasIdNumber',
      type: 'text',
      label: 'FRAS ID Number',
      admin: {
        position: 'sidebar',
        description: 'Sitecore FRAS ID for migration/workflow reference',
      },
    },
    {
      name: 'board',
      type: 'relationship',
      relationTo: 'boards',
      label: 'Board',
    },
    // --- Workflow fields (Epic 22) ---
    ...workflowFields,
  ],
}
