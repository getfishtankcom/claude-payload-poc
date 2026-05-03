/**
 * @description
 * Slug → singular display-name resolution for the tree context menu and any
 * other admin surface that needs a human-readable name for a collection slug.
 *
 * @notes
 * - The known map covers every canonical FRAS Canada collection slug from
 *   CLAUDE.md. New collections that are not in the map fall back to a slug
 *   humanizer that hyphens → spaces and capitalizes each word.
 * - Callers can pass an `overrides` map to inject extra entries (e.g. for a
 *   wrapper that has live Payload `labels.singular` data) without touching
 *   the global defaults.
 */

/**
 * Canonical singular labels for collection slugs. Names match the
 * "Canonical Collection Names" table in CLAUDE.md and existing UI copy.
 */
export const COLLECTION_LABELS: Readonly<Record<string, string>> = Object.freeze({
  // Top-level content
  pages: 'Page',
  news: 'News article',
  projects: 'Project',
  events: 'Event',
  resources: 'Resource',
  standards: 'Standard',
  'standards-sections': 'Standards section',
  // Boards & people
  boards: 'Board',
  'board-detail': 'Board page',
  'board-members': 'Board member',
  committees: 'Committee',
  contacts: 'Contact',
  // Documents
  'document-for-comment': 'Document for Comment',
  'document-detail': 'Document detail',
  // CMS housekeeping (unlikely to appear in the editor tree, but harmless)
  redirects: 'Redirect',
  notifications: 'Notification',
  dictionary: 'Dictionary entry',
})

/**
 * Splits a slug on `-` and `_` and capitalizes each word. Leaves plurals
 * alone — a "Resource" in the known map beats a guessed singularizer.
 */
export const humanizeSlug = (slug: string): string =>
  slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

/**
 * Resolves a slug to its display name. Order: explicit override → canonical
 * map → humanized slug. Always returns a non-empty string.
 */
export const labelForCollection = (
  slug: string,
  overrides?: Readonly<Record<string, string>>,
): string => overrides?.[slug] ?? COLLECTION_LABELS[slug] ?? humanizeSlug(slug)
