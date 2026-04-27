/**
 * Sitecore-parity insert-options table.
 *
 * Maps a parent node's contentType (or a special folder slug) to the set of
 * child content types an editor may insert under it. Used by TreeContextMenu
 * to populate the Insert > submenu and to gate the menu visibility entirely.
 *
 * Source of truth: PRD-admin-panel §4.4.
 */

/** Map of parent contentType / folder-slug → allowed child contentType slugs. */
export const INSERT_OPTIONS: Record<string, string[]> = {
  // Tree root: only top-level structural nodes.
  root: ['page', 'folder'],

  // Special folder types — keyed by node slug (matched by `getInsertOptionsForNode`).
  'boards-folder': ['board-detail'],
  'projects-folder': ['project'],
  'news-folder': ['news'],
  'events-folder': ['event'],
  'documents-folder': ['document'],
  'consultations-folder': ['consultation'],
  'data-folder': ['contact', 'standard', 'decision-summary'],

  // Generic content types.
  'board-detail': ['page'],
  page: ['page'],
  folder: ['page', 'folder'],
  settings: ['global-config'],

  // Leaf-only types — explicit empty arrays so we render "(no insert options)"
  // rather than fall through to "undefined" which would mean "any allowed".
  news: [],
  project: [],
  event: [],
  document: [],
  consultation: [],
  contact: [],
  standard: [],
  'decision-summary': [],
  media: [],
  'global-config': [],
}

/** Hard cap on tree depth — nothing can be inserted past this. */
export const MAX_TREE_DEPTH = 5

/** Human-readable label per content type slug. */
export const CONTENT_TYPE_LABELS: Record<string, string> = {
  page: 'Page',
  folder: 'Folder',
  'board-detail': 'Board Detail Page',
  news: 'News Article',
  project: 'Project',
  event: 'Event',
  document: 'Document',
  consultation: 'Consultation',
  contact: 'Contact',
  standard: 'Standard',
  'decision-summary': 'Decision Summary',
  media: 'Media',
  'global-config': 'Setting',
}

/** Resolve allowed inserts for a node, considering both contentType and slug. */
export function getAllowedInserts(node: { contentType: string; slug?: string }): string[] {
  // Special folder-by-slug overrides take precedence.
  const slug = node.slug?.toLowerCase() ?? ''
  for (const folderKey of [
    'boards-folder',
    'projects-folder',
    'news-folder',
    'events-folder',
    'documents-folder',
    'consultations-folder',
    'data-folder',
  ]) {
    if (slug.includes(folderKey)) return INSERT_OPTIONS[folderKey]
  }
  return INSERT_OPTIONS[node.contentType] ?? []
}

/** Convenience helper — returns labelled insert options for the menu UI. */
export function getInsertOptionsLabelled(node: {
  contentType: string
  slug?: string
}): Array<{ value: string; label: string }> {
  return getAllowedInserts(node).map((value) => ({
    value,
    label: CONTENT_TYPE_LABELS[value] ?? value,
  }))
}
