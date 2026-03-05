/**
 * @description
 * Media collection for file uploads in Payload CMS.
 * Handles images, documents, and other file assets.
 * Generates a thumbnail size (200x200) for admin panel previews.
 *
 * @notes
 * - Upload directory defaults to ./media within the project root
 * - Additional image sizes will be added as component needs emerge
 * - Media permissions are flat — all editors access all folders (per admin panel decisions)
 */
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
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
    mimeTypes: ['image/*', 'application/pdf'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
  ],
}
