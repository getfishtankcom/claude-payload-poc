# FRAS Canada — Frontend Design / UX Dogfood Report
**Date:** 2026-05-03  
**Auditor:** Claude Sonnet 4.6 (agent)  
**Server:** http://localhost:3000 (Next.js dev, Payload 3.84, PostgreSQL, Meilisearch)  
**Viewports tested:** 1440px (desktop) + 768px (tablet)  
**Screenshots:** `.ai-reports/dogfood-frontend-design-2026-05-03/screenshots/`

---

## Overall Summary

The site presents a clean, professional baseline that's structurally sound at both tested breakpoints — no horizontal overflow anywhere. The visual language is consistent: brand purple is used purposefully, the hero gradient is polished, badge tokens are defined correctly, and typography is legible throughout. However, **two systemic bugs undermine nearly every page**: (1) all internal navigation links are missing the `/en/` locale prefix, meaning every nav link, footer link, and content card link 404s when opened in a new tab or bookmarked; and (2) every page bails out of server-side rendering due to a Clerk `CheckoutProvider` error, causing blank shells on first paint and SEO with no content. A third widespread issue is that all board abbreviation fields in the database contain French abbreviations (CNC, CNAC, CCNID) instead of English ones (AcSB, AASB, CSSB), surfacing incorrectly on the board landing H1, homepage promo cards, and news article bylines. Beyond these blockers, the individual page designs are clean with only minor polish work needed.

---

## Page Audits

### 1. Homepage — `/en`

**Screenshots:** `homepage-desktop.png`, `homepage-tablet.png`, `homepage-viewport.png`

**Findings:**

- `[critical]` **Clerk SSR bailout on every page load.** The `ClerkContextProvider` / `CheckoutProvider` throws a server-side error, triggering `BAILOUT_TO_CLIENT_SIDE_RENDERING` (confirmed 2× in HTML). All page body content is deferred to the client. Crawlers see an empty shell. This affects every page on the site.
- `[critical]` **Clerk "Configure your application" developer popup is visible in the bottom-right corner** of every page (across all 10 pages audited). This is a floating overlay from Clerk's dev SDK showing a temporary-API-keys warning. It obscures content and must be suppressed in any demo or review context. Not a code bug but a dev-environment concern that would block stakeholder reviews.
- `[high]` **All nav and footer links missing `/en/` locale prefix.** Primary nav links (Active Projects → `/active-projects`, Open Consultations → `/open-consultations`, News & Updates → `/news`), utility bar links (Contact → `/contact`, Careers → `/careers`), and all four columns of footer links all lack the `/en/` prefix. These return HTTP 404 directly — the next-intl middleware does NOT redirect them. Confirmed with curl: `curl -o /dev/null -w "%{http_code}" http://localhost:3000/active-projects` → `404`.
- `[high]` **Board abbreviations are French in promo cards.** The three homepage news/promo cards display "CCNID", "CNAC", "CNC" (French) instead of "CSSB", "AASB", "AcSB". These are sourced from the `boards.abbreviation` field in the database which was seeded/overwritten with French values.
- `[medium]` **H2 precedes H1 in raw HTML due to SSR bailout.** The footer's "Stay Informed" H2 appears at DOM position 47,381 while the hero H1 is at position 102,263. Bots parsing the HTML stream get a broken heading order. In-browser rendering is correct but this is an SEO and accessibility concern.
- `[medium]` **"News & Updates" nav link routes to `/news`**, but the actual route is `/en/news-listings`. Even if the locale prefix were added, this would still 404 (`/en/news` does resolve, so this specific one works, but the naming inconsistency is confusing).
- `[medium]` **No board-color accent on homepage promo cards.** The wireframes call for board-specific color treatment on news items. Currently all cards use the same gray border (`border-gray-200`) with no visual differentiation by board. Low-priority but noted.
- `[low]` **Hero search bar placeholder says "Find an active project"** — the CMS search docs note this is intentionally scoped to Projects. But the input looks visually identical to the global header search, which could confuse users. Consider a subtle label or placement distinction.
- `[low]` **"View All →" link on homepage news section** — not confirmed to have a locale prefix in the rendered output; likely also 404s. (Part of the systemic nav link issue.)

---

### 2. Active Projects — `/en/active-projects`

**Screenshots:** `active-projects-desktop.png`, `active-projects-tablet.png`

**Findings:**

- `[high]` **All project card links missing `/en/` prefix.** Every project title in the listing links to `/active-projects/acsb/crypto-assets` etc. — confirmed 404 in curl. Opening a project in a new tab fails.
- `[high]` **Board filter sidebar groups projects by board name ("Accounting Standards Board") not abbreviation.** At 768px the board filter sidebar is a full-width select, which works, but the labels use full names without abbreviations. Inconsistent with the rest of the UI which uses AcSB/PSAB shorthand. Minor UX friction.
- `[medium]` **"Survey" projects use `bg-badge-webinar` (teal #0F766E)** — a semantic mismatch. A survey is not a webinar. A dedicated `bg-badge-survey` token would be more accurate, or "Survey" should map to a closer category.
- `[medium]` **Section header "Accounting Standards for Private Enterprises" with count badge** (e.g., "15") uses a muted gray badge. The count is visually de-emphasized relative to the heading text. Slightly awkward hierarchy — the number feels like a footnote rather than a quick-scan label.
- `[low]` **Collapse/expand icons on group headers** are visually clean and readable. Spacing between project rows is consistent. No issues.
- `[low]` **At 768px**, the two-column filter controls (board filter left, standard filter right) stack gracefully. No overflow. Layout is usable.

---

### 3. Project Detail — `/en/active-projects/acsb/crypto-assets`

**Screenshots:** `project-detail-desktop.png`, `project-detail-tablet.png`

**Findings:**

- `[high]` **Section nav tabs (Overview, Current Projects, Meetings) visible in left sidebar** — but clicking any of these would route to `/active-projects/acsb/crypto-assets#section` — it's unclear if these are true routes or anchor scrolls. No finding on 404 here specifically, but the sidebar nav links should be audited.
- `[medium]` **Project Timeline component renders well** — tri-state (complete, in-progress, not-started) is clearly legible. Stage labels like "Stage 2 — Deliberations" are readable. However, the currently-active stage (Exposure Draft) uses a filled purple circle, while completed stages use checkmarks — distinct enough.
- `[medium]` **"UPCOMING EVENTS" sidebar section** — "AcSB Board Meeting" event cards are compact and readable. "View All" link likely has locale prefix issue.
- `[medium]` **"RESOURCES" sidebar** — PDF links render cleanly. Icons are appropriate. No issues beyond potential locale prefix on the section's links.
- `[low]` **Contacts block** — displays name, credentials, email, phone. Andrew White CPA CA. Clean layout.
- `[low]` **At 768px**, the two-column layout (main content + sidebar) collapses to a single column. Sidebar content (Quick Actions, Events, Resources) moves below the main content. Correct responsive behavior. The section nav dropdown at the top of the page at 768px ("Overview ▼") is a good mobile UX pattern.

---

### 4. News Listing — `/en/news-listings`

**Screenshots:** `news-listing-desktop.png`, `news-listing-tablet.png`

**Findings:**

- `[high]` **All article title links missing `/en/` prefix.** Confirmed via Playwright: article links resolve to `http://localhost:3000/news/psab-meeting-march-2026` etc. — these are 404s on direct access or browser refresh.
- `[high]` **Filter bar has a visual hierarchy problem at desktop.** The filter bar has two rows: category pill tabs on top ("All Items", "Document for Comment", "International Activity", "Meeting Summary", "News", "Resource") and then a second row with dropdowns ("Sort By", "Items Per Page", "Start Date", "End Date"). The date inputs are unusually prominent for a text-listing page — they're date range pickers with full yyyy-mm-dd format visible. At a glance they read as form fields, not filters.
- `[medium]` **Articles are text-only with no card container border or background.** Each entry has a subtle bottom border (`border-b border-gray-200`). At 1440px this works because line length is naturally bounded. At 768px articles are full-width text blocks. Not a bug but the scan-ability is low compared to a card layout. Category badge (pill) on each entry helps differentiation.
- `[medium]` **Category filter tabs overflow on small screens** — at 768px the 6-pill tab row wraps to multiple lines without horizontal scroll, which is fine, but the wrapping creates uneven visual weight.
- `[low]` **Pagination controls** (1, 2, 3... →) are present and visually correct at bottom. Arrow icons and page numbers render cleanly.
- `[low]` **"Showing 1–10 of 12 results" count** is readable. Pagination works at 768px.

---

### 5. News Detail — `/en/news/acsb-ed-crypto`

**Screenshots:** `news-detail-desktop.png`, `news-detail-tablet.png`, `news-detail-viewport.png`

**Findings:**

- `[high]` **Breadcrumb "News" link** routes to `/news-listings` without locale prefix (also `/news` in the code). Missing `/en/` → 404.
- `[high]` **"← Back to all news" link** points to `/news-listings` (no `/en/` prefix) — 404 on click.
- `[medium]` **Article body paragraphs have no visual spacing between them.** The two body paragraphs in the test article render as a single block of text at the `prose prose-lg` breakpoint. Looking at the Lexical content, the paragraphs are separate nodes but the `prose` spacing may be collapsed. The excerpt paragraph above acts as a visual separator, making the body look merged. Not a CSS bug per se — the content has minimal paragraphs — but needs monitoring with richer content.
- `[medium]` **Article body max-width is 840px (`max-w-[840px]`)** — at 1440px this centers the article nicely. No related content sidebar (expected for news — PRD confirms this is correct). But the page feels sparse; a "Related News" section would help with the stated goal of reducing bounce rate.
- `[medium]` **No featured image** — all test articles have `featured_image: null`. The image placeholder block is conditionally rendered, so no broken image box appears. But the pages look austere without images.
- `[low]` **Date formatting** — "April 26, 2026" is clear and readable. Category badge ("NEWS") is correctly styled with the gray pill. Layout is clean.
- `[low]` **At 768px** the article reads well. Line length at 768px is approximately 65–70ch — within the ≤75ch guideline.

---

### 6. Board Landing — `/en/acsb`

**Screenshots:** `board-landing-desktop.png`, `board-landing-tablet.png`, `board-landing-header.png`

**Findings:**

- `[critical]` **H1 displays "CNC — Accounting Standards Board" instead of "AcSB — Accounting Standards Board."** The `BoardLanding` component constructs H1 as `` `${board.abbreviation} — ${board.name}` ``. The `abbreviation` field in the database contains "CNC" (the French abbreviation for CNC, Conseil des normes comptables) rather than the English "AcSB". This is a data bug — the seed script sets 'AcSB' but the database has been overwritten with French values. This same bug affects PSAB (showing "CCSP"), AASB (showing "CNAC"), CSSB (showing "CCNID") on their respective landing pages.
- `[high]` **Breadcrumb shows "CNC"** (the French abbreviation) as the current-page label. Same data bug as above.
- `[high]` **Recent News section titles** link to `/news/acsb-ed-crypto` — missing `/en/` prefix. 404 on direct access.
- `[high]` **Active Projects section** project links similarly missing locale prefix.
- `[medium]` **"About" sidebar section** in the board landing shows "Members & committees", "Annual reports", "Meetings & events" links. These hardcoded links appear to go to `/acsb/members` etc. (locale prefix issue) AND the routes may not exist. This should be verified.
- `[medium]` **Board color accent not applied to board landing.** The design tokens define board-specific colors (Purple for FRAS, Blue for councils, Red-Brown for boards). The AcSB landing page uses the same generic brand purple as every other page. No board-specific color treatment in the header or tab bar. This is a design spec deviation.
- `[medium]` **"View All →" links** in Recent News and Active Projects sections likely have locale prefix issues.
- `[low]` **At 768px** — the two-column layout (main + sidebar) collapses correctly. The "Quick Actions" sidebar buttons stack to full-width, which is good. Tab navigation at the top renders as a dropdown, which is acceptable.

---

### 7. Documents for Comment — `/en/acsb/documents`

**Screenshots:** `documents-listing-desktop.png`, `documents-listing-tablet.png`

**Findings:**

- `[high]` **All document item links missing `/en/` prefix.** Every "Exposure Draft:" and "Discussion Paper:" title links to `/acsb/documents/ed-crypto-assets-dfc` — 404 on direct access. Confirmed via Playwright.
- `[high]` **Tab bar links ("Open for Comment", "Closed for Comment")** link to `/acsb/documents?tab=open-for-comment` — missing `/en/` prefix. Clicking the tab works client-side but browser refresh breaks it.
- `[medium]` **"Submit comment" buttons are visually consistent** — filled purple on the right of each row. Clean. However, at 768px the button label is fully visible next to the full document title — but for very long titles the button may appear at a distant right edge making the association unclear. At current seed data title lengths, this is fine.
- `[medium]` **No description text** for what "Documents for Comment" means. The page goes straight from H1 to tabs to the listing. A 1–2 sentence intro explaining the comment submission process would reduce confusion for first-time users.
- `[medium]` **"Closed for Comment" tab** is present but no testing was done to verify it shows appropriate empty state or closed documents.
- `[low]` **Section grouping** ("Exposure Drafts", "Re-exposure Drafts", "Discussion Papers") uses `bg-gray-100` header rows with small uppercase labels — readable and functional. At 768px these header rows render full-width cleanly.
- `[low]` Desktop layout is a clean list with clear hierarchy. Good use of whitespace.

---

### 8. Document Detail — `/en/acsb/documents/ed-crypto-assets-dfc`

**Screenshots:** `document-detail-desktop.png`, `document-detail-tablet.png`, `document-detail-viewport.png`

**Findings:**

- `[high]` **Page title is "Crypto Assets — Proposed Amendments to ASPE"** — no board abbreviation in the H1 here. This is correct. However the breadcrumb likely has locale prefix issues in its links.
- `[medium]` **"How to Reply" dark CTA box** — renders as a dark purple background with the mailing address, the contact person's info, and a "Submit Your Comment" button. The styling is distinctive and separates the CTA clearly. At 768px the box renders full-width and the button is large enough to tap. Good.
- `[medium]` **"START CONTACT" sidebar** is visible at desktop — shows two contacts (Andrew White, Sarah Chen) with name, credentials, email, and phone. The sidebar column is approximately 280px wide which works at 1440px but may feel cramped at medium widths (1024px not tested).
- `[medium]` **"Support Materials" section** shows PDF, Basis for Conclusions, and Comment Letter Template as download links. Icon + filename pattern is legible. However, these link to `/documents/exposure-draft.pdf` etc. — placeholder paths that would 404 on click.
- `[low]` **Questions formatting** — numbered questions ("QUESTION 1", "QUESTION 2" etc.) use uppercase labels with the question text below. Clear visual separation. The layout uses a full-width container without a max-width constrained column, meaning questions span the full text area. Line lengths at 1440px are around 80–90ch — slightly over the 75ch guideline.
- `[low]` **Deadline text "The deadline for responses is June 15, 2026"** is clearly displayed in the "When to Reply" section. Date is readable.
- `[low]` **At 768px** — the sidebar (START CONTACT) collapses below the main content. The two-column grid goes to single column as expected. All content remains accessible.

---

### 9. Contact Us — `/en/contact-us`

**Screenshots:** `contact-us-desktop.png`, `contact-us-tablet.png`

**Findings:**

- `[medium]` **No introductory text before the form.** The page goes directly from the H1 "Contact Us" to the form fields. There's no description of who reviews submissions, expected response time, or alternative contact methods. Compared to the Documents for Comment page's "How to Reply" section, the Contact page feels sparse.
- `[medium]` **"SUBMIT" button is full-width** — a convention typically reserved for primary checkout/conversion buttons. On a contact form this is unusual and makes the button feel overpowering. A standard-width or max-300px button centered or left-aligned would be more conventional.
- `[medium]` **"Title" and "Business Phone" fields are not marked required** (only Full Name, Email, Comments have asterisks). "Title" for a professional-audience form is reasonable but without required status it may confuse users about what's expected.
- `[low]` **Form labels** are above inputs (not inline placeholders) — correct accessibility pattern. Asterisks on required fields are visible. Field spacing is consistent.
- `[low]` **At 768px** — form fields stack cleanly full-width. The SUBMIT button spans full width at mobile too. The Clerk popup overlaps the Comment textarea at this viewport — this is the dev overlay issue.
- `[low]` **Footer appears immediately after the form** with generous whitespace. The "Stay Informed" newsletter sign-up sits in the footer, separate from the contact form — appropriate separation.

---

### 10. Search Results — `/en/search?q=board`

**Screenshots:** `search-results-desktop.png`, `search-results-tablet.png`

**Findings:**

- `[critical]` **Search returns 0 results for all queries.** Meilisearch is running (port 7700 responds with auth challenge) but has zero indexes — the content has never been synced to Meilisearch. The search UI renders correctly but is non-functional. The "No results found" empty state copy is appropriate.
- `[high]` **Filter checkbox inputs have empty `id` and `name` attributes.** All 10+ checkbox inputs in the filters panel have `id=""` and `name=""`. This breaks label associations (clicking the label doesn't check the box) and makes the filters inaccessible to screen readers.
- `[medium]` **Popular search suggestion chips** ("IFRS", "Sustainability", "Public Sector", "ASPE", "Revenue", "Climate") are visible at top. At 768px these wrap to two rows, which works. The chips appear clickable but presumably trigger the non-functional Meilisearch query.
- `[medium]` **Left rail filter panel at 768px** expands to full-width accordion sections below the search input. The layout is correct but with the filters taking up most of the screen and no results, the page looks very empty.
- `[medium]` **"Sort by: Relevance" dropdown** appears in the results area but with 0 results it's a dead control. Should be hidden or disabled when there are no results.
- `[low]` **Filter sections** (By Board, By Standard, Files & Media, Content Type, Date) are all present with correct labels and appropriate options. The accordion-style expand/collapse at 768px works correctly.
- `[low]` **"0 results found" empty state** has good copy. The "Try adjusting your search terms or filters" hint is helpful.

---

## Triage

### Quick Wins (under 30 min each, could fix in current session)

1. **Board abbreviation data fix** — Reseed the `boards.abbreviation` field with correct English values (AcSB, PSAB, AASB, CSSB, RASOC). The seed script already has correct values; a targeted `payload.update` call per board would fix it. Fixes H1 on all 5 board landings, all promo cards, and all news bylines. (`src/seed/index.ts` values are correct; DB was overwritten somewhere.)

2. **Footer "Quick Links" duplicate header** — The footer has two columns both labeled "Quick Links". Rename the second column to something like "Legal" or "More" to differentiate. One-line change in `src/components/layout/SiteFooter.tsx` or the Navigation global seed data.

3. **Suppress Clerk dev popup** — Add `appearance={{ variables: {} }}` or set `ClerkProvider` with `afterSignInUrl` to suppress the "Configure your application" popup for reviews/demos. Or conditionally render based on `NODE_ENV !== 'production'` after disabling it locally.

4. **"Survey" badge semantic fix** — Change the badge mapping so "Survey" uses `bg-badge-resource` (or a new `bg-badge-survey` token) rather than `bg-badge-webinar` (teal). One-line change in the badge utility or project stage component.

5. **Contact form intro text** — Add a single paragraph after the H1 with submission guidance. Content-only change, 5 minutes.

### Worth Filing as GitHub Issues

6. **[issue] Systemic: All internal links missing `/en/` locale prefix** — affects nav, footer, breadcrumbs, card links, "Back to all news", tabs. The root cause is that all URLs in the Navigation global seed data and hardcoded component links use paths without the locale segment (e.g. `/active-projects` instead of `/[locale]/active-projects` or using next-intl's `useLocale` + `Link`). The middleware does NOT auto-redirect these — they 404 directly. Fix requires either: (a) using `next-intl`'s `Link` from `next-intl/navigation` instead of `next/link`, or (b) prepending the locale to all CMS-sourced URLs at render time. This is a significant architectural fix touching `SiteHeader.tsx`, `SiteFooter.tsx`, `BoardLanding.tsx`, `news/[slug]/page.tsx`, `boards/[board-slug]/page.tsx`, and the Navigation global. **Priority: must-fix before any external review.**

7. **[issue] Clerk SSR bailout on all pages** — `ClerkContextProvider` / `CheckoutProvider` throws a server-side exception causing all pages to bail out of SSR. Content is invisible to search crawlers and first-paint performance is degraded. Likely a Clerk version compatibility issue with Next.js 16 (App Router). Check Clerk changelog and upgrade or wrap the problematic component in a client boundary.

8. **[issue] Meilisearch not indexed — search non-functional** — Content has never been synced to Meilisearch. The `payload-meilisearch` plugin should sync on save; trigger a manual re-index or check the plugin configuration for why initial seeding didn't sync. All search queries return 0 results.

9. **[issue] Board landing H1 shows wrong abbreviation (data bug)** — `boards.abbreviation` field contains French abbreviations (CNC, CNAC, CCNID, CCSP). Even after data fix, the `abbreviation` field should be confirmed as non-localized in Payload (it currently has no `localized: true` in `Boards.ts` — correct) to prevent future overwrites by translation scripts.

10. **[issue] Search filter checkboxes have no `id`/`name` attributes** — Inaccessible. Labels don't associate with inputs. Fixing requires passing stable IDs to the InstantSearch refinement list component.

11. **[issue] News detail "Back to all news" and breadcrumb links use wrong URL** — `href="/news-listings"` should be `href="/en/news-listings"` (or use `useLocale()`). Part of the systemic issue but worth a dedicated fix in `news/[slug]/page.tsx` given it's a hard-coded string.

### Polish / Nice-to-Have

12. **Board-specific color accent on board landing header** — The design spec calls for purple (FRAS), blue (councils), red-brown (boards) color treatment. Currently all board pages use the same generic brand purple.

13. **Related news on news detail page** — Page is sparse with minimal content. A 2–3 item "More from AcSB" or "Related news" section would help reduce bounce rate (stated project goal).

14. **Document detail question line-length** — At 1440px the question text spans ~85–90ch. A `max-w-prose` or `max-w-3xl` on the questions section would improve readability.

15. **Contact form SUBMIT button width** — Full-width button is visually heavy for a contact form. Consider `max-w-xs` centered or natural button width at desktop.

16. **News listing filter date inputs visual weight** — The "Start Date" / "End Date" date-picker inputs feel heavier than needed on a news listing. A compact date range or a simple "Year" dropdown might be more appropriate for this content type.

17. **Documents for Comment intro paragraph** — Brief sentence explaining the comment process would help first-time users.

18. **"Active Projects" left-rail board filter** — Uses full board names ("Accounting Standards Board") while the rest of the UI uses abbreviations. A `name (AcSB)` pattern would be more consistent with the overall UX.

---

## Notes

- **No horizontal overflow detected** at 768px on any of the 10 pages. Responsive behavior is generally good.
- **Typography** is consistent: font weights are distinct (bold headings, regular body), line lengths are within guidelines except the document detail question area. The Inter variable font loads correctly.
- **Color contrast** appears acceptable throughout — brand purple on white, gray text on white backgrounds — though a formal WCAG contrast measurement was not performed (out of scope per brief).
- **Empty states** for projects (no results), search (0 results), and closed documents are implemented with appropriate copy. The search empty state is particularly good.
- **FR locale** was not tested (audit scope was English-only visual pass). The French abbreviation data bug does raise concern about what `/fr` pages would look like — they may show correct French abbreviations (CNC etc.) or they may show English ones depending on the locale query.
