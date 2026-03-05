/**
 * @description
 * Call to Action block schema for Payload CMS page builder.
 * Rich text content with CTA links and a visual variant selector.
 *
 * Key features:
 * - Rich text (Lexical) with heading support (h2, h3, h4)
 * - Link group for CTA buttons (max 2)
 * - Variant select: light, dark, purple for visual theming
 *
 * @dependencies
 * - @payloadcms/richtext-lexical: Lexical editor features
 * - @/fields/linkGroup: Reusable link array field
 *
 * @notes
 * - Used for promotional banners and action sections
 * - Replaces hardcoded NewToFras component with CMS-editable content
 * - interfaceName generates TypeScript type in payload-types.ts
 */
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Calls to Action',
  },
  fields: [
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
    linkGroup({
      appearances: ['default', 'outline', 'ghost'],
      overrides: { maxRows: 2 } as Record<string, unknown>,
    }),
    {
      name: 'variant',
      type: 'select',
      defaultValue: 'light',
      label: 'Visual Variant',
      options: [
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Purple', value: 'purple' },
      ],
    },
  ],
}
