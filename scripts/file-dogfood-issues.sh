#!/bin/bash
# Files all 30 dogfood QA issues to GitHub.
# Source: dogfood-output/v2-admin-2026-05-02/report.md
set -e
REPO=cg-fishtank/claude-payload-poc

file_issue() {
  local num="$1"
  local title="$2"
  local sev="$3"
  local body="$4"
  shift 4
  local labels="bug,fix,dogfood"
  for extra in "$@"; do labels="$labels,$extra"; done
  case "$sev" in
    critical) labels="$labels,priority:p0" ;;
    high)     labels="$labels,priority:p1" ;;
    medium)   labels="$labels,priority:p2" ;;
    low)      labels="$labels,priority:p3" ;;
  esac
  echo ">>> ISSUE-$num [$sev]: $title"
  gh issue create --repo "$REPO" --title "[QA-$num] $title" --body "$body" --label "$labels" || echo "  (failed)"
}

file_issue 001 "\"Locale: undefined\" leaks into admin header on first dashboard render" high \
"## Bug
Top-right header of \`/admin\` reads literally \`Locale: undefined\` for the first render after sign-in. Expected \`Locale: English\` (or \`EN\`).

## Repro
1. Sign in at /admin/login
2. Land on /admin dashboard
3. Top-right corner: locale chip shows \`Locale: undefined\`

Subsequent navigations resolve correctly — the bug is the initial-render i18n race.

## Likely cause
Admin Nav is reading \`req.locale\` (or an i18n hook) before hydration and rendering raw \`undefined\` instead of falling back to the default locale.

_Found in dogfood pass; report at \`dogfood-output/v2-admin-2026-05-02/report.md\`._" \
  area:admin-shell i18n

file_issue 002 "Dashboard left column appears overlapping/clipped during hydration" medium \
"## Bug
Post-login \`/admin\` dashboard renders with the welcome header, role badge, and left-column widgets (Workflow Queue / My Recent Items / Pinned Items) overlapping. \`Welcome, test@test.com\` appears clipped (the \`@\` looks missing because adjacent boxes overlap horizontally). Right column (Quick Actions / Publishing Schedule) renders cleanly. Manifests during the loading-state render and partially persists once data arrives.

## Repro
1. Sign in → /admin
2. Compare left column (overlapping, cramped) to right column (clean)

## Likely cause
Left-column widgets lack vertical spacing or are flexed into a broken grid; the \`Loading…\` state collapses them on top of each other." \
  area:admin-shell

file_issue 003 "Tree gutter SVG icons render as plain dots — workflow-state colors don't propagate" medium \
"## Bug
\`<TreeSpine>\` (\`/admin/tree\`) renders sample tree data tagged with workflow state (\`published\`, \`draft\`, \`in-review\`, \`needs-revision\`), lock state, and \`hasFr\`. The Gutter component is supposed to render colored circles per state + lock icon + FR-missing badge. In practice every row shows a uniform black filled bullet — the \`--workflow-*\` CSS variables aren't reaching the SVG \`fill\`.

## Repro
1. /admin/tree → expand Home → expand News
2. Compare \"Home\" (published) to \"2026 Q1 update\" (draft + locked + FR-missing) — both render identically as one bullet

## Likely cause
\`Gutter.tsx\` uses \`<circle fill={color}/>\` with \`color = 'var(--workflow-published)'\`. Either the CSS var isn't reaching the SVG (Storybook-style isolation issue) or admin-tailwind.css's \`--workflow-*\` block isn't loaded for /admin/tree." \
  area:admin-shell

file_issue 004 "Tree right-click \"Insert\" submenu shows raw collection slug instead of human label" low \
"## Bug
Right-click any tree row → \"INSERT\" submenu shows \`New news\` (with \`news\` bolded) — that's the raw collection slug. Should be \`New News Article\` or whatever the singular display name is. Boards would show \`New board-detail\`.

## Repro
1. /admin/tree → expand Home → right-click News
2. Submenu shows \`INSERT\` then \`New news\`

## Fix
\`TreeContextMenu\` needs a label map (collection slug → display name). Could read from collection config (\`labels.singular\` / \`labels.plural\`)." \
  area:admin-shell

file_issue 005 "Workbox queue shows \"Author: Unknown\" for every item" medium \
"## Bug
\`/admin/workbox\` lists 5 items in the All tab. Every row's Author column reads \"Unknown\". Workbox is the cross-collection workflow dashboard; \"who submitted this\" is one of its columns.

## Likely cause
The workbox API endpoint isn't populating the user relation, or the front-end fails to resolve it." \
  area:admin-shell area:cms

file_issue 006 "Sitewide search returns 0 results for any common term — Meilisearch index appears empty" high \
"## Bug
\`/en/search?q=board\` (or any term) returns \"0 results found / No results found\". The site has hundreds of pages mentioning \"board\". Either the Meilisearch index is empty, the index isn't being queried correctly, or \`q=\` isn't being read.

## Repro
1. http://localhost:3000/en/search?q=board
2. Page renders the search shell with filters but result count is 0

## Likely cause
Meilisearch index needs (re)building, or \`payload-meilisearch\` plugin isn't syncing on document save. Run a reindex via the search admin and verify the index contains documents." \
  area:frontend

file_issue 007 "FR locale only translates content — UI chrome stays English" medium \
"## Bug
Switching to FR translates top-nav links + content data (project titles, news headlines, board names in the sidebar) but leaves the page heading, filter labels, form placeholders, and status badges in English.

## Repro
1. /en/active-projects → click Français
2. URL becomes /fr/active-projects
3. Notice still in English: page H1 \`Active Projects\`, sidebar label \`BOARDS\`, \`All Boards\` filter, \`All Standards\` dropdown, \`Filter projects by name…\` placeholder, \`PUBLIC COMMENT\` status badge

## Fix
next-intl messages dictionary missing FR entries; or the page heading is hardcoded instead of pulling from translated content." \
  area:frontend i18n

file_issue 008 "RASOC appears in Active Projects board filter on FR locale (violates RASOC exclusion rule)" high \
"## Bug
CLAUDE.md and the canonical RASOC rules say RASOC is an oversight council, not a standards board, and is **explicitly excluded** from the Active Projects board sidebar. EN view honors that — sidebar shows 4 boards. FR view leaks RASOC: the sidebar shows 5 entries including \`Conseil de surveillance de la normalisation en information et en certification\` (RASOC's French name).

## Repro
1. /en/active-projects → sidebar lists 4 boards (no RASOC) ✓
2. /fr/active-projects → sidebar lists 5 entries including RASOC's FR name ✗

## Fix
Apply the RASOC exclusion at the data layer, not in a per-locale filter component." \
  area:frontend i18n

file_issue 009 "Project detail Summary renders literal placeholder copy in production" critical \
"## Bug — CRITICAL
Every project detail page shows this in the Summary section:

> \"Rich text content will render here when Lexical serializer is configured.\"

That's debug placeholder copy shipped to production-shaped pages. Every visitor reading any active project sees it.

## Repro
1. /en/active-projects → click any project (e.g. \"Accounting for Crypto Assets\")
2. Summary section reads the placeholder string

## Fix
Wire up \`@payloadcms/richtext-lexical/react\`'s \`RichText\` component (or the project's HTML serializer) to render the \`summary\` field's Lexical JSON instead of the placeholder." \
  area:frontend area:cms

file_issue 010 "News detail URLs 404 — listings page links to a route that doesn't exist" high \
"## Bug
Every link on /en/news-listings points to \`/news/<slug>\` (e.g. \`/news/psab-meeting-march-2026\`). All return the 404 page. There's no \`/news/[slug]\` route under \`src/app/(frontend)/[locale]/(frontend)/\` — only \`/news-listings\`.

## Repro
1. /en/news-listings → click any news headline
2. Browser navigates to /en/news/<slug> → 404 page

## Fix
Either add a \`/news/[slug]/page.tsx\` route or change listings to link to whatever route serves news details. Currently the listing → detail flow is completely broken." \
  area:frontend

file_issue 011 "Project detail breadcrumb + sidebar show French board abbreviation (CNC) on EN pages" high \
"## Bug
EN project detail page (e.g. /en/active-projects/acsb/crypto-assets) breadcrumb reads \`Home > Active Projects > CNC > Accounting for Crypto Assets\`. \`CNC\` is the French abbreviation for AcSB (\"Conseil des normes comptables\"); the EN abbreviation is \`AcSB\`. Same string appears in the left sidebar header.

## Repro
1. /en/active-projects/acsb/crypto-assets
2. Inspect breadcrumb (third segment) → \`CNC\` not \`AcSB\`
3. Inspect sidebar (above Overview/Current Projects/Meetings) → \`CNC\` not \`AcSB\`

## Likely cause
The frontend reads the wrong locale field for the abbreviation (always FR), or the board record's abbreviation is stored in the FR field only.

Related: ISSUE-022 (same bug on board sub-pages)." \
  area:frontend i18n

file_issue 012 "Board detail page renders only the title — no body content" high \
"## Bug
A board landing page (e.g. /en/acsb) renders the breadcrumb, the H1 (\`AcSB — Accounting Standards Board\`), and then jumps to the global footer with a viewport-tall empty band in between. No about copy, recent news, current projects, committee/member listings — none of the sections the board detail page is supposed to host.

## Repro
1. /en/acsb
2. Title renders → roughly viewport-tall empty band → footer

## Note
Breadcrumb on this same view says \`Acsb\` (only first letter capitalized) instead of \`AcSB\`." \
  area:frontend area:cms

file_issue 013 "News edit form has no workflow action buttons (Submit / Approve / Publish)" high \
"## Bug
Open a Draft news article in /admin. Action bar shows: Compare versions / Translate to FR / Save / kebab. Kebab menu only lists Copy to locale / Create New / Duplicate / Duplicate Selected Locales / Delete. No \"Submit for Review\", no \"Approve\", no \"Publish\". Workflow can only be advanced via the Workflow State dropdown on the right rail (not discoverable).

Workbox has Approve/Reject/Publish buttons, but the per-document edit view doesn't. Authors live in the edit view.

## Repro
1. /admin/collections/news/60 (a Draft)
2. Inspect action bar + kebab — no workflow buttons

## Fix
Wire workflow actions into the edit view's action bar (Layer 3 plan)." \
  area:admin-shell area:cms

file_issue 014 "\"Missing French translation\" warning persists after a successful Translate-to-FR run" medium \
"## Bug
On a news article without an FR translation, action bar shows \"Missing French translation\" badge. Click \"Translate to FR\" → button shows \"Translating…\" → after 8-10s returns to idle. DB confirms FR row exists. But \"Missing French translation\" warning is still rendered. Switching locale to FR shows the FR content correctly. The warning component evaluates \"is FR missing?\" once at mount and never recomputes after a translate finishes — authors think their translate didn't take.

## Repro
1. /admin/collections/news/60 (an EN-only draft) — warning visible
2. Click \"Translate to FR\" → wait for completion
3. Warning still visible despite DB having FR row" \
  area:admin-shell i18n

file_issue 015 "Workbox Approve fires 400 + UI count drifts inconsistently (no error toast)" high \
"## Bug
Click Approve on the first In Review item in Workbox. Console emits 400 Bad Request. UI optimistically removes the row — All count drops 5→4. But Approved tab count stays at 1 (not 2). DB ends up in a different state than the UI suggests. No toast surfaces the 400.

End result: authors can't tell whether their Approve succeeded.

## Fix
Surface API errors as toasts; never optimistically remove on failure; verify the approve API contract (the 400 indicates a validation/payload mismatch)." \
  area:admin-shell area:cms

file_issue 016 "Notifications panel has z-index/layering issues — content bleeds through dashboard" medium \
"## Bug
Click the notifications bell on /admin. Panel opens with notification rows (\"…Liability Measurement: draft →\" etc.) but lacks a solid opaque background and isn't pinned to the right edge — rows extend off the left of the viewport (text clipped mid-word) and the dashboard widgets show through behind. First few characters of every notification title are clipped." \
  area:admin-shell

file_issue 017 "Cmd+K command palette modal lacks opaque backdrop — page content shows through" medium \
"## Bug
Press Cmd+K on /admin. Command Palette opens with search input + Navigate/Pages/News/Projects/Events/Documents/Resources sections. Functional, but the modal has no opaque backdrop — Workbox content (\"Liability Measurement\", \"Research Program: Financial Reporting Trends\") shows through behind/around the dropdown. Right-side dashboard widgets aren't dimmed.

## Fix
Add a backdrop element (or higher-opacity panel background) so the palette visually owns the viewport." \
  area:admin-shell

file_issue 018 "My Account login page title still reads default Clerk \"Sign in to My Application\"" high \
"## Bug
The public member login page (Clerk SignIn) renders title \`Sign in to My Application\`. \`My Application\` is the Clerk dashboard's default app name. Site visitors see literal Clerk-default copy on a branded page.

## Repro
1. /en/my-account/login (logged out)
2. Card title reads \`Sign in to My Application\`

## Fix
Set the Clerk Application name (Clerk Dashboard → Settings → Application name) or pass \`appearance\` / hard-coded title via \`<SignIn>\` props." \
  area:frontend

file_issue 019 "My Account login surfaces Clerk \"Development mode\" banner — track for prod cutover" medium \
"## Tracking
Clerk SignIn card on /en/my-account/login shows the orange \`Development mode\` banner. Expected on dev (Clerk dev keys), but worth a tracking issue so prod cutover doesn't ship with dev keys.

## Action items before launch
- Create production Clerk instance
- Set production Clerk publishable + secret keys via env
- Update DNS/origin allowlist on the Clerk dashboard" \
  area:frontend area:infra

file_issue 020 "RSS feed item links 404 (no /en/ prefix + target routes don't exist)" high \
"## Bug
\`/api/rss\` and \`/api/rss/[board]\` produce valid RSS XML, but every item \`<link>\` URL is unprefixed and routes to nonexistent destinations.

| Feed link | Result |
|---|---|
| \`/meetings-and-events/<slug>\` | 404 (no /en/) |
| \`/en/meetings-and-events/<slug>\` | 404 (route doesn't exist) |
| \`/news/<slug>\` | 404 |
| \`/boards/acsb\` | 404 |

Two compounding bugs: (1) RSS link generator omits /en/ locale segment; (2) target routes don't exist (\`/news/[slug]\`, \`/meetings-and-events/[slug]\`).

End result: every RSS subscriber receives broken links. Related: ISSUE-010." \
  area:frontend

file_issue 021 "Footer has TWO sections both labeled \"Quick Links\"" low \
"## Bug
Site footer has 4 columns:
1. Standards
2. Quick Links — Active Projects / Open Consultations / News & Updates / Contact / Careers
3. Boards — AcSB / PSAB / AASB / CSSB / RASOC
4. Quick Links — Privacy Policy / Terms of Use / Accessibility / Sitemap

Two columns share the same heading. Column 4 is the legal/utility column; should be \`Legal\`, \`Resources\`, or \`About\`." \
  area:frontend

file_issue 022 "Board sub-pages (members / committees / etc.) inherit the same CNC-on-EN bug" high \
"## Bug
ISSUE-011 documented the French-abbreviation-on-EN-page bug on project detail. Same bug repeats on every board sub-page under /en/[board]/...:
- /en/acsb/about/members → breadcrumb reads \`Home > CNC > About > Members\`
- (presumably also /en/acsb/committees, /en/acsb/documents)

But /en/acsb/decision-summaries breadcrumb shows correct EN name \`Accounting Standards Board\`. So multiple breadcrumb codepaths exist; only some honor active locale.

## Fix
Centralize board-name resolution to honor active locale consistently across all board sub-route layouts." \
  area:frontend i18n

file_issue 023 "Dictionary collection: H1 says \"Dictionaries\" but breadcrumb says \"Dictionary\"" low \
"## Bug
\`/admin/collections/dictionary\` list view: breadcrumb shows \`... / Dictionary\` and the H1 shows \`Dictionaries\`. Collection slug is \`dictionary\` (singular). One reads the slug, the other reads a custom label, and they disagree." \
  area:admin-shell area:cms

file_issue 024 "Document detail page returns 404 for valid slugs" high \
"## Bug
Board documents listing (/en/acsb/documents) lists 3 documents, each linking to \`/acsb/documents/<slug>\`. Both with and without /en/ prefix, every document detail URL renders the 404 page.

## Repro
1. /en/acsb/documents → click any document
2. Document detail URL shows the 404 page

The route file \`(frontend)/[locale]/(frontend)/[board]/documents/[docSlug]/page.tsx\` exists, so this is a slug-resolver / data-lookup bug (or seed slug doesn't match what listings link to)." \
  area:frontend

file_issue 025 "Compare Versions modal: \"Versions fetch failed: 404\"" high \
"## Bug
Open any document in admin → click \"Compare versions\" in the action bar. Modal opens with literal text \`Versions fetch failed: 404\` and a Close button. Console shows a 404 from the versions API. Authors can never compare versions.

## Repro
1. /admin/collections/news/60 → click Compare versions
2. Modal renders \`Versions fetch failed: 404\`

## Fix
Verify the versions API endpoint URL/contract." \
  area:admin-shell area:cms

file_issue 026 "Page Builder \"Submit for Review\" returns 404 (handler is a [FRAS] (stub))" high \
"## Bug
Page Builder for any page → type a title (autosave works) → click Submit for Review. Network 404. Console logs \`[FRAS] Submit for Review (stub)\`. Button is wired to a placeholder handler; Submit for Review does not move the page state.

## Repro
1. /admin/builder/<id>
2. Type a title — \`Saved 1s ago\` indicator appears
3. Click \"Submit for Review\" → 404, page state unchanged

## Fix
Wire the Submit for Review button to the actual workflow API." \
  area:admin-shell area:cms

file_issue 027 "Contact form submission is a no-op stub — shows success toast, never saves" critical \
"## Bug — CRITICAL
Public Contact form (Full Name / Email / Comments). Submit shows the green success banner \`Thank you for contacting us. We will respond shortly.\` Console reveals the submission is a stub:
- \`[FRAS] Submit for Review (stub)\`
- Failed to load resource: 404
- React useActionState transition warning

Real visitor messages disappear into a console log. Success banner is misleading.

## Fix
Wire the Contact form action to the actual FormSubmissions handler. Surface real success/error state." \
  area:frontend area:cms

file_issue 028 "Footer copyright still says old \"Financial Reporting & Assurance Standards Canada\" brand" high \
"## Bug
Footer copyright reads \`© 2026 Financial Reporting & Assurance Standards Canada. All rights reserved.\` That is the old FRAS brand name. Per src/config/brand.ts and CLAUDE.md, the project rebranded to \`Reporting and Assurance Standards (RAS) Canada\` — the \`Financial\` prefix is wrong.

Header logo correctly says \`RAS Canada\`. Legal copyright still leaks the legacy name. Visible on every public page.

## Fix
Replace the hardcoded copyright string with \`BRAND.fullName\` from \`src/config/brand.ts\`." \
  area:frontend

file_issue 029 "Public homepage has 6 axe-core a11y violations (duplicate <main>, heading-order skip)" high \
"## Bug
axe-core 4.10.2 scan of /en homepage returns 6 violations:

| Rule | Impact | Count |
|---|---|---|
| landmark-no-duplicate-main | moderate | 1 — page has more than one \`<main>\` |
| landmark-main-is-top-level | moderate | 1 — \`<main>\` nested inside another landmark |
| landmark-unique | moderate | 1 — duplicate landmark roles |
| region | moderate | 1 — content outside any landmark |
| heading-order | moderate | 1 — heading levels skip |
| empty-heading | minor | 4 — empty heading tags |

CLAUDE.md mandates WCAG 2.2 AA. Two \`<main>\` + nested \`<main>\` is structural a11y bug screen-reader users will trip over on every public page.

## Repro
\`\`\`js
const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js';s.onload=()=>axe.run().then(r=>console.log(r.violations));document.head.appendChild(s);
\`\`\`" \
  area:frontend accessibility

file_issue 030 "Admin dashboard has 15 color-contrast violations + missing main landmark" high \
"## Bug
axe-core 4.10.2 scan of /admin (logged in):

| Rule | Impact | Count |
|---|---|---|
| color-contrast | **serious** | **15** |
| landmark-one-main | moderate | 1 |
| region | moderate | 1 |

15 elements fail WCAG minimum text contrast ratio. Authors with low vision will struggle. Dashboard also missing \`<main>\` landmark — screen-reader users can't skip to main content." \
  area:admin-shell accessibility

echo
echo "Done. Filed all issues."
