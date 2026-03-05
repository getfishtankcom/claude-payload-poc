# FRAS Canada — SEO Metadata Patterns

**Source:** 90 inspected pages across 35 page types (from `page-inspections.json`)
**Generated:** 2026-03-05

## Executive Summary

The live site has **minimal SEO optimization**. Title tags have no site suffix, Twitter Cards are entirely absent, og:image exists only on the homepage, and ~18% of pages lack meta descriptions. The rebuild should implement proper SEO from scratch.

---

## 1. Title Tag Format

**Live site pattern:** `{Page Title}` — bare title, no site name suffix

Examples:
- `About` (no context of what site)
- `Auditing and Assurance Standards Board`
- `AASB Decision Summary – April 5, 2023` (em dash `–` used within content titles)

**5 pages have no title at all:** 3 sitecore-redirect stubs, 1 future meeting page, 1 malformed URL

**Rebuild recommendation:**
```
{Page Title} | FRAS Canada
{Page Title} | {Board/Section Name} | FRAS Canada  (for board/section pages)
```

---

## 2. Meta Description

**Coverage:** 78/95 pages (82%)

### Patterns by page type:

| Page Type Category | Pattern | Avg Length |
|--------------------|---------|------------|
| Board/council landings | "Get up-to-date information on the [Board]'s latest activities." | 73 chars |
| About pages | Full paragraph about the body's mandate | 150-263 chars |
| Meetings listings | "Find more information on [Board]'s past and upcoming meetings and events." | 107 chars |
| Meeting detail | "The [Council/Board] [met/discussed]… on [Date]…" | 117 chars |
| Document detail | Description of what the exposure draft covers | 156 chars |
| News detail | Can be very long (up to 347 chars — exceeds 160-char limit) | 176 chars |
| Member profiles | Single-sentence personal bio | 68 chars |
| Board subpages | Very short, minimal | 24 chars |
| Static/utility pages | Nearly absent ("copyright" = 3 chars) | 3 chars |

### Missing on:
- Sitecore redirect stubs (expected)
- Auth-gated pages
- Some detail pages (CMS field left blank)
- Static/utility pages (cookie policy, copyright)

**Rebuild recommendation:** Required CMS field for all content types with 120-160 char validation. Auto-generate from excerpt/body as fallback.

---

## 3. Canonical URL

**Pattern:** Canonical = exact page URL (no normalization, no trailing slash variance)

**87/95 pages correct (92%)**

### Anomalies:
| URL | Canonical | Issue |
|-----|-----------|-------|
| `…/~/link.aspx` (×3) | None | Sitecore redirect stubs — should 301 or noindex |
| `…/cssb/meetings-and-events/aug-27-2025` | None | Future/unpublished meeting |
| `…/aspe/projects//en/aspe/…` | None | Malformed double-path URL |
| `…/aspe/projects/acsb-strategic-plan` | `/en/ifrsstandards/projects/acsb-strategic-plan` | **Cross-section canonical** — ASPE version canonicalizes to IFRS Standards |
| `…/rasoc/volunteer-opportunities/apply-to-volunteer` | `/en/my-account/login` | Auth-gated page canonicalizes to login |

**Rebuild recommendation:** Self-referencing canonical on all pages. No cross-section canonicalization. Paginated pages: `rel=canonical` to page 1, or self-referencing with `rel=prev/next`.

---

## 4. Open Graph Tags

| Tag | Coverage | Notes |
|-----|----------|-------|
| og:title | 89/95 (94%) | Mirrors page title |
| og:description | 78/95 (82%) | Mirrors meta description |
| og:image | **1/95 (1%)** | Homepage only — FRAS logo from Sitecore media library |
| og:url | 89/95 (94%) | Matches page URL |
| og:type | 73/95 (77%) | `article` where present; missing on meeting detail, member profiles, document/project detail, homepage |

### og:image URL pattern (homepage only):
```
https://www.frascanada.ca/-/media/frascanada/fras-full_cmyk-horiz.png?rev=870100aae86f4db6947c1b9dcfb75c36
```
Sitecore media library with `rev` cache-busting parameter. No per-page social images exist.

**Rebuild recommendation:**
- Generate og:image per page type (board logo, feature image, or default branded card)
- Set og:type appropriately (`website` for homepage, `article` for news/projects/documents, `profile` for members)
- Ensure og:description always populated

---

## 5. Twitter Card Tags

**Entirely absent across all 95 pages.** Zero implementation.

**Rebuild recommendation:** Implement `twitter:card=summary_large_image` with same title/description/image as OG tags.

---

## 6. Hreflang

**Pattern:** Two links per page:
```html
<link rel="alternate" hreflang="x-default" href="…/en/{path}">
<link rel="alternate" hreflang="fr" href="…/fr/{path}">
```

- `x-default` points to EN version (English is the default/fallback language)
- No explicit `hreflang="en"` — only `x-default` + `fr`
- **87/95 pages have hreflang** — missing on same broken/gated pages as canonical

**Rebuild recommendation:** Add explicit `hreflang="en"` alongside `x-default` + `fr`. Use the FR slug mapping table for URL generation.

---

## 7. Structured Data (JSON-LD)

**Not implemented on any page.** Zero JSON-LD or microdata across the entire site.

**Rebuild recommendation — implement per page type:**

| Page Type | Recommended Schema |
|-----------|--------------------|
| Homepage | `Organization`, `WebSite` with `SearchAction` |
| Board/council landing | `Organization` (sub-org) |
| Member profile | `Person` with `memberOf` |
| Meeting detail | `Event` |
| News detail | `NewsArticle` |
| Project detail | `Article` or custom |
| Document for Comment | `Article` with `datePublished`, `expires` |
| All pages | `BreadcrumbList` |

---

## 8. Generator Meta Tag

**Not present on any page.** Sitecore does not expose a generator tag (common practice).

---

## 9. Robots / Indexing

**Not analyzed in depth** — no `<meta name="robots">` tags were observed in the metadata extraction. The following page types should be `noindex` in rebuild:
- Sitecore redirect stubs
- Login/auth pages
- Search results pages
- Paginated listing pages beyond page 1 (debatable)

---

## Key Recommendations for Rebuild

1. **Title format:** `{Page Title} | {Section} | FRAS Canada` — standardize across all types
2. **Meta description:** Required CMS field with 120-160 char validation + auto-fallback
3. **og:image:** Per-page or per-type social share images (board logo cards, article images)
4. **Twitter Cards:** Implement `summary_large_image` (mirrors OG tags)
5. **JSON-LD:** `Organization`, `BreadcrumbList`, `Event`, `NewsArticle`, `Person` schemas
6. **Hreflang:** Add explicit `en` alongside `x-default` + `fr`
7. **Canonical:** Self-referencing on all pages, `rel=prev/next` for pagination
8. **Robots:** `noindex` on auth, redirect, and search result pages
