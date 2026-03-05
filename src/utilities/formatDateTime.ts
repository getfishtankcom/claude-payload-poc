/**
 * @description
 * Date/time formatting utility.
 * Formats ISO timestamps into human-readable strings.
 *
 * @notes
 * - Adapted from Payload website template
 * - Uses Intl.DateTimeFormat for locale-aware formatting
 * - FRAS site is bilingual (EN/FR) — locale param supports both
 */

export const formatDateTime = (
  timestamp: string,
  options?: {
    locale?: string
    format?: 'short' | 'long' | 'iso'
  },
): string => {
  const { locale = 'en-CA', format = 'long' } = options || {}

  if (!timestamp) return ''

  const date = new Date(timestamp)

  if (format === 'iso') {
    return date.toISOString().split('T')[0] // YYYY-MM-DD
  }

  if (format === 'short') {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date)
  }

  // 'long' — e.g., "March 5, 2026" or "5 mars 2026"
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}
