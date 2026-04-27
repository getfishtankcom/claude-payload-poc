/**
 * @description
 * Media collection for file uploads in Payload CMS (Epic 24 enhanced).
 * Handles images, documents, video, and other file assets.
 * Generates thumbnail (200x200) and card (640x480) sizes for previews.
 *
 * Key features:
 * - Folder-based organization via `folder` relationship to `media-folders`
 * - Localized alt text, title, and description for WCAG 2.2 AA bilingual compliance
 * - Expanded mimeTypes: images, documents (pdf, docx, xlsx, pptx), video (mp4, webm)
 * - Payload's built-in image resizing for thumbnails
 *
 * @dependencies
 * - MediaFolders collection (relationship for folder organization)
 *
 * @notes
 * - Upload directory defaults to ./media within the project root
 * - Media permissions are flat — all editors access all folders (per admin panel decisions)
 * - Single file blob shared across locales; alt, title, description are per-locale
 * - This matches Sitecore's media library pattern (separate alt text per language, shared binary)
 */
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'folder', 'mimeType', 'filesize'],
    group: 'Media',
  },
  upload: {
    staticDir: 'media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 200,
        height: 200,
        position: 'centre',
      },
      {
        name: 'card',
        width: 640,
        height: 480,
        position: 'centre',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: [
      // Images
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/svg+xml',
      'image/gif',
      // Documents
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      // Video
      'video/mp4',
      'video/webm',
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      localized: true,
      label: 'Alt Text',
      admin: {
        description: 'Alternative text for screen readers (WCAG 2.2 AA). Required for images.',
      },
      validate: (value: string | null | undefined, { data }: { data: Record<string, unknown> }) => {
        // Alt text is required for images but optional for documents/video
        const mime = String(data?.mimeType || '')
        if (mime.startsWith('image/') && !value) {
          return 'Alt text is required for images (WCAG 2.2 AA)'
        }
        return true
      },
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      label: 'Title',
      admin: {
        description: 'Display title / tooltip text. Shown in media detail panel.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      label: 'Description',
      admin: {
        description: 'Extended description for media detail panel and search indexing.',
      },
    },
    {
      name: 'folder',
      type: 'relationship',
      relationTo: 'media-folders',
      label: 'Folder',
      admin: {
        position: 'sidebar',
        description: 'Folder this media item belongs to in the media library',
      },
      index: true,
    },
  ],
}
