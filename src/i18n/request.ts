/**
 * @description
 * Server-side i18n request configuration for next-intl.
 * Called once per request to load locale-specific messages.
 *
 * Key features:
 * - Validates incoming locale against supported locales
 * - Loads JSON message files from messages/ directory
 * - Falls back to default locale if invalid
 *
 * @dependencies
 * - next-intl/server: getRequestConfig
 * - next-intl: hasLocale
 * - ./routing: routing config
 *
 * @notes
 * - Message files live at project root: messages/en.json, messages/fr.json
 * - This runs server-side only via React cache
 * - timeZone set to America/Toronto (RAS Canada)
 */
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  // Validate locale from [locale] route segment
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: 'America/Toronto',
  }
})
