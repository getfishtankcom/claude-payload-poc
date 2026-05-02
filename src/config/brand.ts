/**
 * Brand constants for the F.R.A.S → RAS rename.
 *
 * Single source of truth for organization name strings. Import and
 * use these constants instead of hardcoding org-name strings anywhere.
 *
 * The product is being rebranded to
 * Reporting and Assurance Standards (RAS) Canada.
 */
export const BRAND = {
  /** Short marketing name. */
  name: 'RAS Canada',
  /** Long official name. */
  fullName: 'Reporting and Assurance Standards (RAS) Canada',
  /** Three-letter abbreviation. */
  abbreviation: 'RAS',
  /** French short name (placeholder — design team to confirm). */
  nameFr: 'NIFC Canada',
  /** Former org name. Kept for legacy field labels and migration notes. */
  formerName: 'F.R.A.S Canada',
  /** Tagline used on homepage hero. */
  tagline: "Canada's Official Hub for Accounting and Assurance Standards",
  /** Production domain. */
  domain: 'frascanada.ca',
  /** Production URL. */
  url: 'https://frascanada.ca',
  /** Admin panel browser title suffix. */
  adminTitle: 'RAS Canada CMS',
} as const

export type Brand = typeof BRAND
