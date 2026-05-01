/**
 * @description
 * Simple rich text block — single Lexical rich text field.
 * Used for free-form content sections in the page builder.
 *
 * Key features:
 * - Single rich text field with full heading support
 * - Fixed + inline toolbar features
 * - Minimal block for prose content
 *
 * @dependencies
 * - @payloadcms/richtext-lexical: Lexical editor features
 *
 * @notes
 * - Simplest block type — just rich text, no layout options
 * - interfaceName: RichTextBlock for generated TypeScript types
 */
import type { Block } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

export const RichTextBlock: Block = {
  slug: 'richText',
  interfaceName: 'RichTextBlock',
  labels: {
    singular: 'Rich Text',
    plural: 'Rich Text Blocks',
  },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
      required: true,
    },
  ],
}
