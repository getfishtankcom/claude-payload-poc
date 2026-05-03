/**
 * @description
 * Backwards-compat shim — re-exports the canonical
 * `getMeilisearchAdminClient` from `./meilisearch/client`.
 *
 * Direct callers should import from `./meilisearch/client` or, for
 * provider-agnostic code, go through `getSearchProvider()` from
 * `@/search`. (#172 / Algolia migration Slice 1.)
 */
export { getMeilisearchAdminClient as getMeilisearchClient } from './meilisearch/client'
