/**
 * @description
 * Tiny redirect view at `/admin/builder` (no `:id` segment). Bounces
 * to `/admin/collections/pages` so typing the URL directly doesn't
 * land on Payload's generic 404. (#162 / QA-114)
 *
 * The action-bar entry on Pages-collection edit views still routes to
 * `/admin/builder/<page-id>` (the real builder). This is a cheap fix
 * for the gap until a proper page-picker landing ships (option B from
 * the issue).
 *
 * @notes
 * - Server component — `redirect()` from `next/navigation` is the
 *   canonical way to issue a 307 redirect from an RSC.
 * - Default export is required by Payload's `views.*.Component`
 *   path-string registration.
 */
import { redirect } from 'next/navigation'

export default function PageBuilderIndex() {
  redirect('/admin/collections/pages')
}
