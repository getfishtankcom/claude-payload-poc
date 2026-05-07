/**
 * `withWorkflow` is the single seam through which a CollectionConfig opts
 * into RAS Canada's editorial workflow chrome — workflowState fields, the
 * workflow action bar in the edit view, transition validation hooks,
 * RBAC defaults, and (optionally) Meilisearch sync hooks and the board
 * filter bar in the list view.
 *
 * Before this factory existed, every workflow-participating collection
 * repeated the same admin.components blocks, the same hooks, and the same
 * access functions verbatim. Adding a new piece of admin chrome meant
 * editing 12+ files. After: edit this file.
 *
 * Use `withTranslationOnly` (./with-translation-only.ts) for the lighter
 * archetype — collections like `boards` and `standards` that only need the
 * translate button and the translation-status field.
 */
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  CollectionBeforeChangeHook,
  CollectionConfig,
  CollectionSlug,
} from 'payload'

import { contentCreate, contentDelete, contentRead, contentUpdate } from '@/access/roles'
import { workflowFields } from '@/fields/workflow'
import { createLogWorkflowTransition, validateWorkflowTransition } from '@/admin/hooks/workflow-hooks'
import { getSearchProvider } from '@/search'

export type WithWorkflowOptions = {
  /** Add Meilisearch sync hooks. The index name and collection slug both
   *  default to the collection's own slug. */
  searchable?: boolean
  /** Render `<BoardFilterBar />` above the list view. */
  boardFiltered?: boolean
  /** Admin components to render BEFORE the workflow action bar in the
   *  edit view (e.g., FavoriteButtonField, FrTranslationWarning,
   *  VersionDiffButton, LockIndicator). Order is preserved. */
  extraEditChrome?: string[]
  /** Render the TranslateButton after the workflow action bar. Default
   *  true. Set false for collections like BoardMembers and JobPostings
   *  where translation is handled out of band. */
  translatable?: boolean
  /** Extra hooks merged into the standard workflow hook chain. The factory
   *  composes these AFTER its own hooks: workflow validation runs first,
   *  workflow logging + search sync run before any collection-specific
   *  afterChange hook. */
  extraHooks?: {
    beforeChange?: CollectionBeforeChangeHook[]
    afterChange?: CollectionAfterChangeHook[]
    afterDelete?: CollectionAfterDeleteHook[]
  }
  /** Override the default RBAC functions. Defaults to the standard
   *  contentRead/Create/Update/Delete from `@/access/roles`. */
  access?: CollectionConfig['access']
}

export function withWorkflow(
  config: CollectionConfig,
  options: WithWorkflowOptions = {},
): CollectionConfig {
  const {
    searchable = false,
    boardFiltered = false,
    extraEditChrome = [],
    translatable = true,
    extraHooks,
    access,
  } = options
  const slug = config.slug as CollectionSlug

  const search = searchable
    ? getSearchProvider().getSyncHooks({ indexName: slug, collectionSlug: slug })
    : null

  const beforeDocumentControls = [
    ...extraEditChrome,
    '/admin/components/WorkflowActionBarField',
    ...(translatable ? ['/admin/components/TranslateButton'] : []),
  ]

  return {
    ...config,
    admin: {
      ...config.admin,
      components: {
        ...config.admin?.components,
        ...(boardFiltered ? { beforeListTable: ['/admin/components/BoardFilterBar'] } : {}),
        edit: {
          ...config.admin?.components?.edit,
          beforeDocumentControls,
        },
      },
    },
    access: access ?? {
      read: contentRead,
      create: contentCreate,
      update: contentUpdate,
      delete: contentDelete,
    },
    hooks: {
      ...config.hooks,
      // Extras prepend so callers can run setup hooks (e.g. clearExpiredLock)
      // before workflow transition validation.
      beforeChange: [...(extraHooks?.beforeChange ?? []), validateWorkflowTransition],
      afterChange: [
        createLogWorkflowTransition(slug),
        ...(search ? [search.afterChange] : []),
        ...(extraHooks?.afterChange ?? []),
      ],
      ...(search || extraHooks?.afterDelete
        ? {
            afterDelete: [
              ...(search ? [search.afterDelete] : []),
              ...(extraHooks?.afterDelete ?? []),
            ],
          }
        : {}),
    },
    fields: [...config.fields, ...workflowFields],
  }
}
