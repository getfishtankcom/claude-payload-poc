/**
 * Branding global — single source of truth for the site/admin logo.
 *
 * `logo` is a localized upload so EN and FR can serve different banner
 * variants (legacy frascanada.ca has `fras-banner-en.png` and
 * `fras-banner-fr.png`). Not required — when empty, the public header /
 * footer and admin login fall back to the existing text wordmark
 * (`tCommon('siteName')` / `BRAND.name`). Alt text is read from the
 * Media doc itself, which already enforces alt at upload time.
 *
 * Favicon stays a static asset under `src/app/icon.png` (Next 16
 * file-convention) — favicons are square, language-neutral, and hot
 * paths shouldn't depend on a DB roundtrip.
 */
import type { GlobalConfig } from 'payload'

export const Branding: GlobalConfig = {
  slug: 'branding',
  label: 'Branding',
  admin: {
    description:
      'Site-wide logo used in the public header, footer, and admin login. Upload separate EN/FR variants if the wordmark differs by locale.',
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      localized: true,
      required: false,
      admin: {
        description:
          'Falls back to the text wordmark when empty. Header renders at max-h 48px, footer at max-h 64px, admin login at max-h 64px — the same asset is reused everywhere.',
      },
    },
  ],
}
