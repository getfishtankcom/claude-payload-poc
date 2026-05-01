/**
 * Pure helpers for filtering which fields on a Payload doc should be
 * sent to the AI translator (PRD §13.E).
 *
 * Filtering rules:
 *   - System fields (id, timestamps, workflow state, scheduling, etc.)
 *     are skipped.
 *   - Relationship and upload fields (numeric IDs at depth:0) are skipped.
 *   - Booleans, dates (ISO 8601), and URLs are skipped.
 *   - Empty strings, null, undefined are skipped.
 *   - Strings with content, arrays of objects/strings, and Lexical-shaped
 *     objects are kept — the translator preserves nested structure.
 *   - Slug field always passes through (handled by translator's slug
 *     mapping glossary).
 *
 * Exported separately from route.ts so it can be unit-tested without
 * a Payload runtime.
 */

export const SYSTEM_FIELDS = new Set([
  'id',
  'createdAt',
  'updatedAt',
  '_status',
  'sortOrder',
  'workflowState',
  'workflowHistory',
  'createdBy',
  'publishOn',
  'unpublishOn',
  'translationStatus',
  'lockedBy',
  'lockedAt',
  'parent',
  'board',
  'boards',
  'standard',
  'standards',
  'category',
  'group',
  'type',
  'status',
  'role',
  'frasIdNumber',
  'sitecoreId',
  'date',
  'startDate',
  'endDate',
  'publishedDate',
  'commentPeriodStart',
  'commentPeriodEnd',
  'closingDate',
  'isVolunteerOpportunity',
  'sectionTabs',
  'sectionNavLinks',
  'staffContacts',
  'sidebar_type',
  'externalUrl',
  'photo',
  'image',
  'featured_image',
  'media',
  'documentUrl',
  'commentSubmitUrl',
  'commentsPdfUrl',
  'file_url',
  'thumbnail',
  'logo',
  'email',
  'phone',
  'phoneNumber',
])

export const SLUG_FIELDS = ['slug']

const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/
const URL_LIKE = /^https?:\/\//

export function isTranslatable(value: unknown): boolean {
  if (value == null) return false
  if (typeof value === 'number' || typeof value === 'boolean') return false
  if (typeof value === 'string') {
    if (!value.trim()) return false
    if (ISO_DATE.test(value)) return false
    if (URL_LIKE.test(value)) return false
    return true
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return false
    if (value.every((v) => typeof v === 'number')) return false
    return true
  }
  if (typeof value === 'object') {
    return true
  }
  return false
}

export function pickTranslatableFields(
  doc: Record<string, unknown>,
): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(doc)) {
    if (SYSTEM_FIELDS.has(k) && !SLUG_FIELDS.includes(k)) continue
    if (isTranslatable(v)) out[k] = v
  }
  // Slug always passes through if non-empty (overrides system-field skip).
  if ('slug' in doc && typeof doc.slug === 'string' && doc.slug) {
    out.slug = doc.slug
  }
  return out
}
