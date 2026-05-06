/**
 * `withTranslationOnly` is the lighter sibling of `withWorkflow`. It applies
 * to collections that surface in EN/FR (so they need the translate button +
 * a translation-status field) but do NOT participate in the editorial
 * workflow — Boards, Standards, StandardsSections, DecisionSummaries.
 *
 * Currently four collections repeat the same `TranslateButton` injection
 * and `translationStatusField` spread. After this factory: one decision
 * lives here.
 */
import type { CollectionConfig } from 'payload'

import { translationStatusField } from '@/fields/workflow'

export type WithTranslationOnlyOptions = {
  /** Render `<BoardFilterBar />` above the list view. */
  boardFiltered?: boolean
}

export function withTranslationOnly(
  config: CollectionConfig,
  options: WithTranslationOnlyOptions = {},
): CollectionConfig {
  const { boardFiltered = false } = options

  return {
    ...config,
    admin: {
      ...config.admin,
      components: {
        ...config.admin?.components,
        ...(boardFiltered ? { beforeListTable: ['/admin/components/BoardFilterBar'] } : {}),
        edit: {
          ...config.admin?.components?.edit,
          beforeDocumentControls: ['/admin/components/TranslateButton'],
        },
      },
    },
    fields: [...config.fields, translationStatusField],
  }
}
