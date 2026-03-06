/**
 * @description
 * Media Folders collection for folder-based media organization (Epic 24).
 * Provides a hierarchical folder structure for the admin media library browser.
 * Uses a self-referential `parent` relationship for nesting.
 *
 * Key features:
 * - Folder hierarchy via parent self-referential relationship
 * - Sort ordering within each level
 * - Admin displays folder name as title
 *
 * @dependencies
 * - None (standalone collection)
 *
 * @notes
 * - No folder scoping for permissions — all editors access all folders
 * - Tree depth limited by UI, not enforced at collection level
 * - Used by the admin media library view at /admin/media
 */
import type { CollectionConfig } from 'payload'

export const MediaFolders: CollectionConfig = {
  slug: 'media-folders',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'sortOrder'],
    group: 'Media',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Folder Name',
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'media-folders',
      label: 'Parent Folder',
      admin: {
        description: 'Parent folder in the hierarchy (null = root)',
      },
      index: true,
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Sort Order',
      defaultValue: 0,
      admin: {
        description: 'Order within parent folder for display',
      },
    },
  ],
}
