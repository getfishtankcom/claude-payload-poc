/**
 * @description
 * Hero group field configuration for Payload CMS.
 * Defines a discriminated union of hero types: none, highImpact, lowImpact.
 * Used on Pages collection and Homepage global as a top-level group field
 * (NOT a block — hero lives above the blocks layout).
 *
 * Key features:
 * - Type select determines which hero variant renders
 * - Rich text (Lexical) for heading/body content
 * - Link group for CTA buttons
 * - Conditional media upload (highImpact only)
 * - Conditional search_enabled toggle (highImpact only)
 *
 * @dependencies
 * - @payloadcms/richtext-lexical: Lexical editor with toolbar features
 * - @/fields/linkGroup: Reusable link array field
 *
 * @notes
 * - Follows official Payload website template pattern
 * - Hero is a GROUP field, not a block
 * - highImpact = gradient hero with optional search bar (homepage)
 * - lowImpact = simple text hero (interior pages)
 * - none = no hero rendered
 */
import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: 'Hero',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'none',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'lowImpact'].includes(type),
      },
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_: Record<string, unknown>, siblingData: Record<string, unknown> = {}) =>
            ['highImpact', 'lowImpact'].includes(siblingData?.type as string),
        },
        maxRows: 3,
      } as Record<string, unknown>,
    }),
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Optional background image for the hero section',
      },
      label: 'Background Image',
    },
    {
      name: 'search_enabled',
      type: 'checkbox',
      defaultValue: false,
      label: 'Show Search Bar',
      admin: {
        condition: (_, { type } = {}) => type === 'highImpact',
        description: 'Display the project search bar in the hero section',
      },
    },
  ],
}
