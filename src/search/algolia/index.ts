/**
 * @description
 * Public exports for the Algolia provider implementation. The factory
 * at `src/search/index.ts` is the only thing that should import this
 * module — collection configs go through `getSearchProvider()`.
 *
 * (#173 / Algolia migration Slice 2 — News POC.)
 */
export { algoliaProvider } from './provider'
