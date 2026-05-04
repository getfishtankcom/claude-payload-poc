# i18n Coverage Audit — Hardcoded English on `/fr`

**Date:** 2026-05-04
**Trigger:** Follow-up to #215 / PR #227 (fr.json diacritics). Hypothesis: even with fr.json corrected, components may render hardcoded English directly, bypassing `next-intl` entirely.
**Method:** Static analysis of `src/components/**/*.tsx` for files lacking `useTranslations`/`getTranslations` imports + JSDOM scan of rendered `/fr` HTML for English-marker words.
**Pages scanned:** `/fr`, `/fr/recherche`, `/fr/projets-actifs`, `/fr/nous-joindre`, `/fr/consultations-ouvertes`.

## TL;DR

Two confirmed hardcoded-English bugs render on **every** `/fr` page. Translation keys already exist for both — the components just never call `useTranslations`.

| # | Component | Visible on `/fr` | Translation key exists? | Severity |
|---|---|---|---|---|
| 1 | `NewsletterCTA.tsx` (8+ strings) | YES — footer, every page | YES — `messages/{en,fr}.json` → `newsletter.*` | **P1** |
| 2 | `SiteHeader.tsx` (1 string) | YES — header, every page | YES — `nav.primaryNavLabel` ("Navigation principale") | **P2** (a11y only) |
| 3 | `SearchModal.tsx`, `MobileMenu.tsx`, `AnchorNav.tsx` | NO (interaction-mounted) | Mixed | **P3** (latent — lights up on user action) |

## #1 — NewsletterCTA.tsx (P1)

**File:** `src/components/NewsletterCTA.tsx`
**Mounted in:** site footer (`SiteFooter.tsx`) → renders on every public page
**Behavior on `/fr`:** Every newsletter string renders in English. Confirmed in DOM:

```
$ grep -E "Subscribe|Email address" /tmp/fr-home.html
… <label>Email address</label>
… <button>Subscribe</button>
```

### Hardcoded strings
| Line | String | Existing key |
|---|---|---|
| 35 | `'Trusted by 3,000+ professionals across Canada'` (default heading) | none — needs `newsletter.heading` (or new `newsletter.headingFallback`) |
| 50 | `'Please enter a valid email address.'` (validation) | `newsletter.invalidEmail` ✅ |
| 67 | `'Something went wrong. Please try again.'` (error) | none — needs `newsletter.unknownError` |
| 81 | `'Thank you for subscribing!'` (success) | `newsletter.success` ✅ |
| 87 | `'Email address'` (sr-only label) | none — needs `forms.emailAddress` ✅ ("Adresse courriel *") OR new `newsletter.emailLabel` |
| 97 | `'Enter your email'` (placeholder) | `newsletter.placeholder` ✅ |
| 116 | `'Subscribing...'` / `'Subscribe'` (button) | `newsletter.subscribe` ✅ + needs `newsletter.subscribing` |
| 133 | `'Follow us on LinkedIn'` (link) | none — needs `newsletter.linkedin` |

### Fix sketch

```tsx
'use client'
import { useTranslations } from 'next-intl'

export function NewsletterCTA({ heading, description, className = '' }: Props) {
  const t = useTranslations('newsletter')
  // …
  setErrorMessage(t('invalidEmail'))
  // …
  return (
    <div className={className.trim()} data-testid="newsletter-cta">
      {(heading ?? t('heading')) && <h2 …>{heading ?? t('heading')}</h2>}
      …
      <label htmlFor="newsletter-email" className="sr-only">{t('emailLabel')}</label>
      <input … placeholder={t('placeholder')} … />
      <Button …>{status === 'submitting' ? t('subscribing') : t('subscribe')}</Button>
      …
    </div>
  )
}
```

### Translation key additions (en.json + fr.json)
- `newsletter.headingFallback` — "Trusted by 3,000+ professionals across Canada" / "Approuvé par plus de 3 000 professionnels au Canada"
- `newsletter.unknownError` — "Something went wrong. Please try again." / "Une erreur est survenue. Veuillez réessayer."
- `newsletter.emailLabel` — "Email address" / "Adresse courriel"
- `newsletter.subscribing` — "Subscribing…" / "Inscription en cours…"
- `newsletter.linkedin` — "Follow us on LinkedIn" / "Suivez-nous sur LinkedIn"

## #2 — SiteHeader.tsx (P2 — a11y only)

**File:** `src/components/layout/SiteHeader.tsx:204`
**Issue:** `aria-label="Primary navigation"` is hardcoded English. The translation key `nav.primaryNavLabel` ("Navigation principale" / "Primary navigation") already exists.
**Visible on /fr DOM:**

```
$ grep aria-label="Primary /tmp/fr-home.html
aria-label="Primary navigation"
```

**Fix:** swap the literal for `t('primaryNavLabel')` from the existing `useTranslations('nav')` instance.

## #3 — Latent (interaction-mounted)

These don't render server-side so they don't appear in the DOM scan, but they will surface as English the moment a user opens the menu / search:

- `src/components/SearchModal.tsx`:
  - `aria-label="Search"`, `aria-label="Close search"`, `aria-label="Search query"`
  - `placeholder="Projects, meetings, documents, and more."`
  (Note: there's a near-duplicate translated string at `search.searchInputPlaceholder` — "Projets, réunions, documents et plus.")
- `src/components/layout/MobileMenu.tsx`:
  - `aria-label="Close menu"`, `aria-label="Mobile navigation"`
  - `placeholder="Search projects, standards..."`
- `src/components/AnchorNav.tsx`:
  - `aria-label="On this page"`

All three should be wired through `useTranslations('nav' | 'search')` with the existing keys (`nav.closeMenu`, `nav.mobileNavLabel`, `search.ariaLabel`, `search.mobilePlaceholder`).

## Recommendation

File one P1 issue to wire `NewsletterCTA` through `useTranslations('newsletter')` (add 5 missing keys). Bundle the SiteHeader aria-label swap and the latent interaction-mounted components in the same PR — same pattern, ~30 LOC. End-to-end change is a single tight commit.

## Out-of-scope but adjacent

The grep deliberately ignored Storybook files, test files, and admin-shell components (per current scope split). A full sweep including those would likely surface more.
