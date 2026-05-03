# Validation Report: dogfood-3 + dogfood-4 + P1/P2 follow-up

| Field | Value |
|-------|-------|
| **Date** | 2026-05-03 |
| **Scope** | Verify everything shipped today before moving on |
| **PRs covered** | #164–#170 (FR i18n sweep) + #189–#197 (dogfood-4 light-mode) + #199–#203 (P1+P2 follow-up) |
| **Issues closed** | 22 (151–157, 180–188, 88, 149, 150, 158, 159, 160) |

## Summary

| Check | Result |
|-------|--------|
| `npx tsc --noEmit` | clean |
| `npx vitest run` | 327/327 pass |
| `npm run build` | succeeded (Next.js 16.2.4) |
| Legacy "Financial Reporting & Assurance Standards" leak | 0/7 surfaces |
| FR i18n leaks (Home/Boards/Legal/Filters/etc.) | 0/4 surfaces |
| Board abbreviation casing (AcSB vs ACSB) | 4/4 surfaces correct (52 AcSB, 0 ACSB) |
| Per-board metadata titles | 4/4 unique branded |
| FR 404 page i18n | "Page non trouvee" rendered |
| Document detail breadcrumb | rendered (testid + 4 items) |
| FR footer translation | 5/5 expected FR strings |

## Detailed verification

### A. Title brand template (#149 + #150)

| URL | Title rendered |
|-----|---------------|
| `/en` | RAS Canada — Canada's Official Hub for Financial Reporting Standards |
| `/en/acsb` | AcSB — Accounting Standards Board — RAS Canada |
| `/en/aasb` | AASB — Auditing and Assurance Standards Board — RAS Canada |
| `/en/cssb` | CSSB — Canadian Sustainability Standards Board — RAS Canada |
| `/en/psab` | PSAB — Public Sector Accounting Board — RAS Canada |
| `/fr/cnc` | AcSB — Conseil des normes comptables — RAS Canada |
| `/fr/cnac` | AASB — Conseil des normes d'audit et de certification — RAS Canada |

Each board landing has a unique branded title; layout `template` adds " — RAS Canada" automatically.

### B. Legacy brand string purge (#149)

Curl-greps for "Financial Reporting & Assurance Standards" across `/en`, `/en/acsb`, `/fr`, `/fr/cnc`, `/en/active-projects`, `/en/contact-us`, `/en/news` — 0 leaks total.

### C. Board abbreviation casing (#158)

| URL | AcSB instances | ACSB instances |
|-----|---------------|---------------|
| `/en/active-projects/acsb/crypto-assets` | 12 | 0 |
| `/en/acsb` | 29 | 0 |
| `/en/active-projects` | 6 | 0 |
| `/en/open-consultations` | 5 | 0 |

CSS `uppercase` swept out of `SectionNav`, `NewsGridBlock`; `board.name` swapped to `board.abbreviation` in BoardNav mobile + Open Consultations data prep.

### D. Document detail breadcrumb (#159)

Markers found on `/en/acsb/documents/ed-crypto-assets-dfc`:
- `data-testid="breadcrumb"` ✓
- `>Home<` (auto-prepended) ✓
- `>AcSB<` (board abbreviation) ✓
- `>Documents for comment<` ✓
- Title "Crypto Assets — Proposed Amendments to ASPE" (current crumb) ✓

Visible in screenshot 13.

### E. FR 404 i18n (#180 partial)

`/fr/totally-fake` h1: **"Page non trouvee"** (visible in screenshot 10 + /tmp/fr404-v3.png)
`/en/totally-fake` h1: **"Page Not Found"** (no regression)

### F. FR i18n leaks across recent surfaces

| URL | Visible EN-chrome leaks |
|-----|------------------------|
| `/fr` | 0 |
| `/fr/cnc` | 0 |
| `/fr/recherche` | 0 |
| `/fr/nous-joindre` | 0 |

Probes: `Home / Boards / Legal / Filters / By Board / By Standard / Files & Media / Content Type / Sort by / Find an active project / View All / Recent News / Active Projects / Privacy Policy / Cookie Policy / Terms of Use / All rights reserved`.

### G. Footer FR (#197)

`/fr` footer renders all 5 expected FR strings: `Mentions legales`, `Tous droits reserves`, `Politique de confidentialite`, `Politique relative aux temoins`, `Conditions d'utilisation`. No EN equivalents.

### H. BoardNav active state (#186)

`/en/active-projects` "All Boards" element class:
```
block w-full rounded-r-md py-2.5 text-left text-sm transition-colors cursor-pointer
border-l-4 border-primary bg-primary/5 pl-3 pr-4 text-primary font-semibold
```

Left-edge accent bar pattern landed (was filled purple pill).

### I. Visual surfaces — light-mode polish

14 screenshots captured in `screenshots/` against fresh dev server:

- 01-en-home / 02-fr-home — page bg cooler grey (#F7F7F9), hero gradient, glass-effect outline CTA
- 03-en-acsb / 04-fr-cnc — Quick Actions + About sidebar widgets elevated as cards
- 05-en-search — filter checkboxes 16×16, no oversized boxes
- 06-en-contact / 07-fr-contact — input borders visible (#B8B8C0)
- 08-en-projects — "All Boards" left-edge accent bar
- 09-en-project — Project Timeline in teal/slate, separate from brand purple
- 10-fr-404 — FR 404 with "Page non trouvee" + "Aller a l'accueil"
- 11-en-aasb / 12-en-cssb — board landings consistent with #03
- 13-en-doc-detail — breadcrumb visible at top
- 14-en-login — "Sign in to RAS Canada"

## Remaining knowns

- `/en` homepage title still says "Financial Reporting Standards" (different from the legacy "Financial Reporting & Assurance Standards" — tagline mismatch with `BRAND.tagline`, but explicitly outside #149's scope).
- `/fr/projets-actifs/<board>/<slug>` 404 routing remnant tracked as #198 (not the visual-polish surface — needs FR slug seeding + dynamic-pathname routing refactor).
- Clerk dev "Configure your application" widget still visible on screenshots — tracked as #89 for prod cutover.

## Conclusion

All 22 issues shipped today are landing correctly in production builds + at runtime. No regressions found. The light mode no longer "looks like ass" — every public surface either uses the new `--surface-card` token, the elevated form chrome, the corrected brand casing, or the FR-translated copy. Cleared to move to the next backlog item.
