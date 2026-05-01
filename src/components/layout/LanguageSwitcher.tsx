/**
 * @description
 * Language switcher toggle for EN/FR bilingual support.
 * Displays the alternate locale name and switches to it on click,
 * preserving the current page path.
 *
 * Key features:
 * - Shows alternate language label ("Français" when on EN, "English" when on FR)
 * - Preserves current page path when switching locales
 * - Uses next-intl's Link and usePathname for locale-aware navigation
 * - Compact variant for utility bar, inline variant for mobile menu
 *
 * @dependencies
 * - next-intl/navigation: Link, usePathname for locale-aware routing
 * - @/i18n/routing: routing config for createNavigation
 *
 * @notes
 * - Client component due to usePathname hook
 * - The link automatically handles locale prefix swapping
 * - data-testid="language-switcher" for self-test compatibility
 */
'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import type { Locale } from '@/i18n/routing'

type LanguageSwitcherProps = {
  /** Display variant: 'compact' for utility bar, 'inline' for mobile menu */
  variant?: 'compact' | 'inline'
  /** Optional callback when language is switched (e.g., close mobile menu) */
  onSwitch?: () => void
}

/** Maps locale codes to display labels */
const localeLabels: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
}

export function LanguageSwitcher({ variant = 'compact', onSwitch }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const pathname = usePathname()
  const router = useRouter()

  // Determine the alternate locale
  const alternateLocale: Locale = locale === 'en' ? 'fr' : 'en'
  const alternateLabel = localeLabels[alternateLocale]

  const handleSwitch = () => {
    router.replace(pathname, { locale: alternateLocale })
    onSwitch?.()
  }

  if (variant === 'inline') {
    return (
      <button
        type="button"
        onClick={handleSwitch}
        className="font-medium text-primary hover:underline cursor-pointer"
        data-testid="language-switcher"
        aria-label={`Switch to ${alternateLabel}`}
      >
        {alternateLocale.toUpperCase()}
      </button>
    )
  }

  return (
    <button
      type="button"
      onClick={handleSwitch}
      className="px-2 py-1 text-sm text-text-muted hover:text-primary cursor-pointer"
      data-testid="language-switcher"
      aria-label={`Switch to ${alternateLabel}`}
    >
      {alternateLabel}
    </button>
  )
}
