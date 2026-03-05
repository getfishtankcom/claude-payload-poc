/**
 * @description
 * Reusable link group field — an array of link fields.
 * Used for CTA button groups, footer link lists, etc.
 *
 * Usage:
 *   import { linkGroup } from '@/fields/linkGroup'
 *   fields: [linkGroup(), linkGroup({ appearances: ['default', 'outline'] })]
 *
 * @dependencies
 * - link field from @/fields/link
 * - deepMerge utility
 *
 * @notes
 * - Adapted from Payload website template
 */
import type { ArrayField, Field } from 'payload'

import type { LinkAppearance } from './link'

import { deepMerge } from '@/utilities/deepMerge'
import { link } from './link'

type LinkGroupType = (options?: {
  appearances?: LinkAppearance[] | false
  overrides?: Partial<ArrayField>
}) => Field

export const linkGroup: LinkGroupType = ({ appearances, overrides = {} } = {}) => {
  const generatedLinkGroup: Field = {
    name: 'links',
    type: 'array',
    fields: [
      link({
        appearances,
      }),
    ],
    admin: {
      initCollapsed: true,
    },
  }

  return deepMerge(generatedLinkGroup, overrides)
}
