/**
 * Shared Payload local-API helpers.
 *
 * Every CMS query module routes through `withPayload`, which:
 *   - Resolves the Payload client once per call (Payload memoizes internally)
 *   - Catches infrastructure errors and returns the supplied fallback
 *   - Logs failures to the server console so problems are not silent
 *
 * The "swallow + return fallback" contract is intentional: a public-facing
 * marketing site degrades better than it crashes when the CMS is briefly
 * unreachable. Concentrating that decision here means future contributors
 * change it in one place, not 30+. See payload-helpers.activeBoards.test.ts
 * for the documented expectation.
 */
import { getPayload, type Payload } from 'payload'
import config from '@payload-config'

/** Payload-configured locales (matches `localization.locales` in payload.config.ts). */
export type PayloadLocale = 'en' | 'fr'

/** Narrows an arbitrary string to a configured Payload locale, defaulting to 'en'. */
export function toPayloadLocale(locale: string | undefined): PayloadLocale {
  return locale === 'fr' ? 'fr' : 'en'
}

/**
 * Run a function against the Payload local API, returning `fallback` if anything throws.
 *
 * @example
 *   const news = await withPayload(
 *     (payload) => payload.find({ collection: 'news', limit: 3 }).then((r) => r.docs),
 *     [],
 *   )
 */
export async function withPayload<T>(
  fn: (payload: Payload) => Promise<T>,
  fallback: T,
): Promise<T> {
  try {
    const payload = await getPayload({ config })
    return await fn(payload)
  } catch (error) {
    console.error('[cms] payload query failed:', error)
    return fallback
  }
}
