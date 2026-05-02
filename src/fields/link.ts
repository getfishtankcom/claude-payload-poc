/**
 * @description
 * Reusable link field for Payload CMS collections.
 * Supports internal references (to other collections) and custom URLs.
 * Includes label, new tab toggle, and optional appearance selector.
 *
 * Usage in a collection:
 *   import { link } from '@/fields/link'
 *   fields: [link(), link({ disableLabel: true }), link({ appearances: ['default', 'outline'] })]
 *
 * @dependencies
 * - deepMerge utility for overrides
 *
 * @notes
 * - Adapted from Payload website template
 * - relationTo targets our canonical collection names (see CLAUDE.md)
 * - Appearance options map to Button component variants
 */
import type { Field, GroupField } from 'payload'

import { deepMerge } from '@/utilities/deepMerge'

export type LinkAppearance = 'default' | 'outline' | 'ghost'

export const appearanceOptions: Record<LinkAppearance, { label: string; value: string }> = {
  default: {
    label: 'Default',
    value: 'default',
  },
  outline: {
    label: 'Outline',
    value: 'outline',
  },
  ghost: {
    label: 'Ghost (text link)',
    value: 'ghost',
  },
}

type LinkType = (options?: {
  appearances?: LinkAppearance[] | false
  disableLabel?: boolean
  overrides?: Partial<GroupField>
}) => Field

export const link: LinkType = ({ appearances, disableLabel = false, overrides = {} } = {}) => {
  const linkResult: GroupField = {
    name: 'link',
    type: 'group',
    admin: {
      hideGutter: true,
    },
    fields: [
      {
        type: 'row',
        fields: [
          {
            name: 'type',
            type: 'radio',
            admin: {
              layout: 'horizontal',
              width: '50%',
            },
            defaultValue: 'reference',
            options: [
              {
                label: 'Internal link',
                value: 'reference',
              },
              {
                label: 'Custom URL',
                value: 'custom',
              },
            ],
          },
          {
            name: 'newTab',
            type: 'checkbox',
            admin: {
              style: {
                alignSelf: 'flex-end',
              },
              width: '50%',
            },
            label: 'Open in new tab',
          },
        ],
      },
    ],
  }

  // Internal reference and custom URL fields
  const linkTypes: Field[] = [
    {
      name: 'reference',
      type: 'relationship',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'reference',
      },
      label: 'Document to link to',
      // Add collection slugs here as they're created in later epics
      relationTo: ['pages'],
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'custom',
      },
      label: 'Custom URL',
      required: true,
    },
  ]

  if (!disableLabel) {
    linkResult.fields.push({
      type: 'row',
      fields: [
        ...linkTypes,
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: {
            width: '50%',
          },
          label: 'Label',
          required: true,
        },
      ],
    })
  } else {
    linkResult.fields = [...linkResult.fields, ...linkTypes]
  }

  if (appearances !== false) {
    let appearanceOptionsToUse = [
      appearanceOptions.default,
      appearanceOptions.outline,
      appearanceOptions.ghost,
    ]

    if (appearances) {
      appearanceOptionsToUse = appearances.map((appearance) => appearanceOptions[appearance])
    }

    linkResult.fields.push({
      name: 'appearance',
      type: 'select',
      admin: {
        description: 'Choose how the link should be rendered.',
      },
      defaultValue: 'default',
      options: appearanceOptionsToUse,
    })
  }

  return deepMerge(linkResult, overrides)
}
