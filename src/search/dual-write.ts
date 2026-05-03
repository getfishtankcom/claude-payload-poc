/**
 * @description
 * Dual-write provider — composes two `SearchProvider` implementations
 * so every Payload write fans out to both. Used during the 2-week
 * parallel indexing window (#176 / Algolia migration Slice 5) to
 * validate Algolia correctness on real editor activity before the
 * production cutover.
 *
 * Activation: `SEARCH_DUAL_WRITE=true` (separate from `SEARCH_PROVIDER`
 * so the frontend keeps reading from the primary provider while writes
 * fan out to both). The factory in `./index.ts` wires this up.
 *
 * @notes
 * - Frontend reads stay on the primary provider's client. Only writes
 *   are dual.
 * - Each hook is best-effort: a failure on one provider is logged but
 *   does NOT block the Payload save or the other provider's write.
 *   This matches User Story 16 / 17 (sync within seconds, deletes
 *   propagate) — primary stays authoritative; secondary is a
 *   correctness check.
 * - `applySettings` calls both providers in turn so settings stay in
 *   sync during the window.
 */
import type {
  IndexSettings,
  ProviderLocale,
  SearchClient,
  SearchProvider,
  SyncHooks,
  SyncHooksConfig,
} from './types'

/** Build the dual-write composition. `primary.name` decides what the
    `name` field reports for telemetry. */
export function buildDualWriteProvider(
  primary: SearchProvider,
  secondary: SearchProvider,
): SearchProvider {
  return {
    name: primary.name,

    getSyncHooks(config: SyncHooksConfig): SyncHooks {
      const primaryHooks = primary.getSyncHooks(config)
      const secondaryHooks = secondary.getSyncHooks(config)

      return {
        afterChange: async (args) => {
          const result = await runOrLog(
            'afterChange',
            primary.name,
            () => primaryHooks.afterChange(args),
          )
          // Fire-and-forget the secondary so primary latency isn't
          // affected. Errors are caught + logged inside `runOrLog`.
          void runOrLog(
            'afterChange',
            secondary.name,
            () => secondaryHooks.afterChange(args),
          )
          return result ?? args.doc
        },
        afterDelete: async (args) => {
          await runOrLog(
            'afterDelete',
            primary.name,
            () => primaryHooks.afterDelete(args),
          )
          void runOrLog(
            'afterDelete',
            secondary.name,
            () => secondaryHooks.afterDelete(args),
          )
        },
      }
    },

    getSearchClient(locale: ProviderLocale): SearchClient {
      // Reads stay on the primary provider during the parallel-indexing
      // window. Slice 6 (#177) is when the cutover flips this.
      return primary.getSearchClient(locale)
    },

    async applySettings(indexName: string, settings: IndexSettings): Promise<void> {
      await runOrLog('applySettings', primary.name, () => primary.applySettings(indexName, settings))
      await runOrLog(
        'applySettings',
        secondary.name,
        () => secondary.applySettings(indexName, settings),
      )
    },
  }
}

async function runOrLog<T>(
  hook: string,
  providerName: string,
  fn: () => T | Promise<T>,
): Promise<T | undefined> {
  try {
    return await fn()
  } catch (error) {
    console.error(
      `[search.dualWrite] ${providerName}.${hook} failed (non-blocking):`,
      error,
    )
    return undefined
  }
}

/** Read the env var. Exported so tests can stub it without setting
    `process.env` globally. */
export function isDualWriteEnabled(): boolean {
  return process.env.SEARCH_DUAL_WRITE === 'true'
}
