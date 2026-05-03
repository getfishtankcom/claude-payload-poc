/**
 * @description
 * Backwards-compat shim. The canonical entry point is now
 * `getSearchProvider().getSyncHooks(config)` from `@/search` —
 * see #172 (Algolia migration Slice 1: provider abstraction).
 *
 * Kept so any legacy import path still resolves while the codebase
 * migrates. Will be removed in a future cleanup once all imports point
 * at `@/search` directly.
 */
import type { SyncHooksConfig } from './types'
import { getSearchProvider } from './index'

export function syncToMeilisearch(config: SyncHooksConfig) {
  return getSearchProvider().getSyncHooks(config)
}
