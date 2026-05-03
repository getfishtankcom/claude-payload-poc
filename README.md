# FRAS Canada — Website Rebuild

Greenfield rebuild of [frascanada.ca](https://www.frascanada.ca) — migrating from Sitecore ASP.NET WebForms to a modern headless CMS stack.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| CMS | Payload CMS 3.x |
| Database | PostgreSQL (via Drizzle ORM) |
| Styling | Tailwind CSS v4 |
| Search | Meilisearch (self-hosted Docker) |
| Auth | Aptify DB API (member True/False) |
| Newsletter | HubSpot Forms API |
| Analytics | GA4 via `@next/third-parties` |
| Cookie Consent | OneTrust |
| CAPTCHA | ReCaptcha v3 |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy env and fill in values
cp .env.example .env

# 3. Start PostgreSQL + Meilisearch (Docker)
docker compose up -d

# 4. Run dev server
npm run dev
```

## Local URLs (recommended Portless setup)

Three services run on `localhost` ports during dev:

| Service       | Default port | Suggested Portless alias |
|---------------|--------------|--------------------------|
| Next dev      | `:3000`      | `https://fras.test`      |
| PostgreSQL    | `:5433`      | (keep direct — native protocol) |
| Meilisearch   | `:7700`      | `https://meili.fras.test` (optional) |

[Portless](https://portless.dev/) is a Mac app that gives you memorable HTTPS subdomains for local services without editing `/etc/hosts`. Once installed:

1. Open Portless and create an app:
   - **Name:** `fras`
   - **Subdomain:** `fras.test` (or `fras.lcl.host` on the public TLD)
   - **Port:** `3000`
2. Optionally add a second app for Meilisearch (`meili.fras.test` → `:7700`).
3. Update `.env` so Next emits the matching `NEXT_PUBLIC_SERVER_URL`:
   ```
   NEXT_PUBLIC_SERVER_URL=https://fras.test
   # NEXT_PUBLIC_MEILISEARCH_HOST=https://meili.fras.test  (only if you proxied Meili too)
   ```
4. Restart `npm run dev`. The browser bar now reads `https://fras.test/en` instead of `localhost:3000`.

PostgreSQL stays as `localhost:5433` because the wire protocol isn't HTTP — Portless can't proxy it.

**Not on Mac?** Use [Caddy](https://caddyserver.com/) with a similar reverse-proxy config — same idea, different toolchain.

## Project Structure

```
fras/
├── src/                    # Application source (Next.js + Payload)
│   ├── app/                # Next.js App Router pages
│   ├── collections/        # Payload CMS collection definitions
│   ├── components/         # React components
│   ├── globals/            # Payload CMS globals
│   └── lib/                # Shared utilities
├── .ai-reports/            # Documentation, PRDs, specs (see below)
├── data/                   # Crawl data, Sitecore dump analysis
├── scripts/                # Site inventory pipeline (Playwright)
├── CLAUDE.md               # AI agent instructions + project rules
├── SECURITY.md             # Security rules (mandatory reading)
└── .env.example            # Environment variable template
```

## Documentation

All planning, research, and specifications live in `.ai-reports/`. This is the single source of truth for what we're building and why.

### Start Here

| Document | Path | What It Covers |
|----------|------|---------------|
| **Phase 1 PRD** | `.ai-reports/PRD.md` | Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search, Nav/Footer |
| **Phase 2 PRD** | `.ai-reports/PRD-phase2.md` | Standards, Documents, News, Meetings, Members, Committees, Contact, Auth, Jobs (13 templates) |
| **Phase 1 Build Plan** | `.ai-reports/BUILD_PLAN.md` | 11 epics (0-10), 58 tasks with dependencies |
| **Phase 2 Build Plan** | `.ai-reports/BUILD_PLAN-phase2.md` | 9 epics (11-18, 20-21), 73 tasks |
| **Master TODO** | `.ai-reports/MASTER_TODO.md` | Per-task acceptance criteria and validation commands |

### Design & Specs

| Document | Path | What It Covers |
|----------|------|---------------|
| **Phase 1 Wireframes** | `.ai-reports/wireframe-specs.md` | Component specs from Figma — 20 frames |
| **Phase 2 Wireframes** | `.ai-reports/dogfood-frascanada/wireframe-specs-phase2.md` | ASCII wireframes for 13 gap templates |
| **Design Tokens** | `.ai-reports/dogfood-frascanada/design-tokens.md` | Colors, typography, spacing, CSS custom properties |
| **Admin Panel PRD** | `.ai-reports/PRD-admin-panel.md` | Custom Payload admin — content tree, page builder, workflow |

### Research & Discovery

| Document | Path | What It Covers |
|----------|------|---------------|
| **Site Discovery** | `.ai-reports/dogfood-frascanada/site-discovery-verified.md` | 17 templates, ~30 components, 12 content types (triple-validated) |
| **UX Research** | `.ai-reports/sitecore-dump-analysis.md` | 6 user personas, survey data, branding guidelines, opportunity mapping |
| **Notion Specs** | `.ai-reports/dogfood-frascanada/notion-component-specs.md` | Field-level specs from 53 Notion sub-pages |
| **Gaps Report** | `.ai-reports/consolidated-gaps-report.md` | All gaps, architecture corrections, open questions |
| **Search Research** | `.ai-reports/research-search-solutions.md` | Meilisearch selection rationale |
| **Translation PRD** | `.ai-reports/PRD-translation.md` | AI-assisted bilingual workflow |
| **Content Migration** | `.ai-reports/dogfood-frascanada/content-migration-strategy.md` | Phase 3 — ~2,700 items, 894 URL redirects |

### Meta

| Document | Path | What It Covers |
|----------|------|---------------|
| **Audit Log** | `.ai-reports/AUDIT_LOG.md` | Full change history of all documentation |
| **Documentation Audit** | `.ai-reports/DOCUMENTATION_AUDIT.md` | 76-issue cross-doc audit (all fixed) |
| **URL Registry** | `.ai-reports/dogfood-frascanada/url-registry.md` | 894 URLs mapped across 16 page types |

## What is FRAS?

**Financial Reporting & Assurance Standards Canada** — the standard-setting body for all accountants across Canada. The site serves 5 organizational units:

| Unit | Type | Has Board Landing Page |
|------|------|----------------------|
| AcSB (Accounting Standards Board) | Board | Yes |
| AASB (Auditing and Assurance Standards Board) | Board | Yes |
| PSAB (Public Sector Accounting Board) | Council | Yes |
| CSSB (Canadian Sustainability Standards Board) | Council | Yes |
| RASOC (Regulatory and Accounting Standards Oversight Council) | Oversight | No (footer + About Us only) |

The site covers **11 standards sections** (IFRS, Sustainability, CAS, CSQM, CSRS, ASPE, PS, NFP, Pension Plans, and more), each with Projects, Documents for Comment, Effective Dates, and Resources sub-pages.

**Bilingual:** Full EN/FR with language switcher. ~894 URLs across both languages.

## Build Phases

| Phase | Scope | Tasks |
|-------|-------|-------|
| **Phase 1** | Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search, Global Nav/Footer, Design System, CMS Collections | 58 tasks across 11 epics |
| **Phase 2** | Standards, Documents, News, Meetings, Members, Committees, Contact, Auth, Jobs + Admin Panel | 73 tasks across 9 epics |
| **Phase 3** | Content migration (~2,700 items), URL redirects (894), go-live | TBD |

**Total:** 131 implementation tasks across 20 epics.

## Key Architecture Decisions

- **Search:** Meilisearch (not Coveo) — MIT-licensed, self-hosted, faceted bilingual search with React InstantSearch
- **Auth:** Aptify DB API (not OAuth/SAML) — direct API calls, simple member True/False
- **Newsletter:** HubSpot Forms API — Subscribe Banner submits directly to HubSpot
- **Admin Panel:** Extended Payload CMS with custom views — Sitecore-style content tree, template-first page builder, 5-state workflow
- **i18n:** Per-language Meilisearch indices, Next.js locale routing, AI-assisted translation via Claude API

## Security

See [`SECURITY.md`](./SECURITY.md) — mandatory reading before writing any code that touches auth, database, API routes, or environment variables.

## Contributing

1. Read `CLAUDE.md` for project conventions and architecture rules
2. Read `SECURITY.md` for security requirements
3. Check `.ai-reports/MASTER_TODO.md` for current task status
4. Follow the build plan — tasks have dependencies, don't skip ahead
5. All PRs must pass the pre-merge security checks in `SECURITY.md`

## Scripts (Site Inventory Pipeline)

These are for analyzing the existing Sitecore site, not the rebuild:

```bash
npm run crawl      # Discover URLs via Playwright
npm run classify   # Classify pages by template type
npm run inspect    # Deep-inspect page DOM structure
npm run report     # Generate analysis reports
npm run registry   # Build URL registry from crawl data
npm run inventory  # Run full pipeline
```
