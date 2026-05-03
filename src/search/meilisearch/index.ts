/**
 * @description
 * Public exports for the Meilisearch provider implementation.
 * The factory at `src/search/index.ts` is the only thing that should
 * import from this module — collection configs go through
 * `getSearchProvider()` and call `getSyncHooks(...)` on the result.
 *
 * (#172 / Algolia migration Slice 1 — provider abstraction.)
 */
export { meilisearchProvider } from './provider'
