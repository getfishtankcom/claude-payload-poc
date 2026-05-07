/**
 * CMS query layer — per-collection modules over the Payload local API.
 * Re-exported here for callers that want a single import path.
 *
 * Prefer importing the specific module (`@/lib/cms/news`) when only one
 * collection is touched — keeps caller diffs scannable.
 */
export * from './client'
export * from './globals'
export * from './boards'
export * from './projects'
export * from './news'
export * from './events'
export * from './documents'
export * from './resources'
export * from './standards'
export * from './pages'
export * from './members'
