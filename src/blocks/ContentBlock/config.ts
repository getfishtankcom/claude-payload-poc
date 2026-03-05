/**
 * @description
 * Content block schema — multi-column layout with rich text per column.
 * Follows the Payload website template Content block pattern.
 *
 * Key features:
 * - Array of columns, each with size select + rich text + optional link
 * - Column sizes: oneThird, half, twoThirds, full
 * - Flexible layout for text + media content sections
 *
 * @dependencies
 * - @payloadcms/richtext-lexical: Lexical editor features
 * - @/fields/link: Reusable link field
 *
 * @notes
 * - interfaceName: ContentBlock for generated TypeScript types
 * - Columns render in a CSS grid; size determines span
 */
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { link } from '@/fields/link'

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: {
    singular: 'Content',
    plural: 'Content Blocks',
  },
  fields: [
    {
      name: 'columns',
      type: 'array',
      label: 'Columns',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'size',
          type: 'select',
          defaultValue: 'full',
          label: 'Column Size',
          options: [
            { label: 'One Third', value: 'oneThird' },
            { label: 'Half', value: 'half' },
            { label: 'Two Thirds', value: 'twoThirds' },
            { label: 'Full', value: 'full' },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          label: false,
        },
        link({ appearances: false }),
      ],
    },
  ],
}
