# FRAS Canada — PoC Site

## Project Overview
Greenfield rebuild of frascanada.ca (currently Sitecore ASP.NET WebForms).
**Target stack:** Next.js 15 (App Router) + Payload CMS 3.x + PostgreSQL + Tailwind CSS v4 + Meilisearch

**Current phase:** Discovery & planning COMPLETE. Phase 1 implementation starting.

### What is FRAS?
**Financial Reporting and Standards** — the standard-setting body for all accountants across Canada. Organizationally it has 2 boards (AcSB, AASB) + 2 councils (PSAB, CSSB) + 1 oversight council (RASOC). FRAS is the umbrella for all of them. The site is being rebranded from FRAS to **RAS** (Regulatory and Accounting Standards).

### Project Goals
- **Reduce homepage bounce rate** — currently massive. Homepage needs to drive traffic to resources & stories.
- **Content author flexibility** — CMS editors should be able to curate what appears on the homepage and board pages.
- **Highlight top news/content** — flexible approach to featuring content. Carousel component is a nice-to-have.
- **Better content discoverability** — centralized listing pages with faceted filtering replace board-siloed navigation.
- **WCAG 2.1 AA** compliance required.
- **No major brand deviations** — stay consistent with current brand standards.
- **Brand font:** Official is **Arial** (2017 brand guidelines), live site uses **Roboto**, wireframes use **Inter**. Design team decides.
- **Board-specific colors:** Purple #601F5B (FRAS), Blue #00438C (councils), Red-Brown #983232 (boards). See `sitecore-dump-analysis.md` Section 4.2.
- **French brand names:** FRAS→NIFC, AcSB→CNC, PSAB→CCSP, AASB→CNAC, AASOC→CSNAC, AcSOC→CSNC.

### Users (6 validated personas from UX research)
- **Amanda** — Board member/vice-chair (PSAB). Regular user. Sends project links to colleagues.
- **Chris** — Board member/vice-chair (AcSB). Uses Google over FRAS search. Tracks decisions + exposure drafts.
- **Melissa** — Manager, National Account Standards. Weekly user. Submits comments, reviews meeting summaries.
- **Mohamed** — Accountant, 10+ years policy. Monthly user. Prefers Deloitte IAS Plus for layout.
- **Philip** — CFO, 30+ years. Newsletter-driven. Checks volunteer opportunities.
- **Shari** — Lecturer, U of Waterloo. Frequent user. References standards, reviews meeting notes, accesses podcasts.

Also: financial reporting professionals, auditors, students, sustainability standards stakeholders (CSSB).

### Traffic Patterns
Most traffic comes from **direct links** (social media, newsletters) — not organic search. The homepage is a navigation hub, not the primary landing page. The pages users are linked to directly (news, documents, project updates) matter more than the homepage itself.

## Documentation Map

### Discovery (verified)
- **Site discovery:** `.ai-reports/dogfood-frascanada/site-discovery-verified.md` — 17 templates, ~30 components, 12 content types, 11 standards sections (triple-validated)
- **Verification evidence:** `.ai-reports/page-template-verification.md` — raw data for all 17 templates across 26+ pages
- **Component registry:** `.ai-reports/dogfood-frascanada/components.md` — 190 CSS class prefixes
- **URL registry:** `.ai-reports/dogfood-frascanada/url-registry.md` — 894 URLs, 16 page types
- **Screenshots:** `.ai-reports/screenshots/` + `.ai-reports/dogfood-frascanada/screenshots/`

### Design
- **Phase 1 wireframes (Figma):** `.ai-reports/wireframe-specs.md` — 20 frames (Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search, Nav/Footer)
- **Phase 2 wireframes (ASCII):** `.ai-reports/dogfood-frascanada/wireframe-specs-phase2.md` — 13 gap templates with desktop + mobile layouts, field specs, CMS mapping
- **Design tokens:** `.ai-reports/dogfood-frascanada/design-tokens.md` — colors, typography, spacing, CSS custom properties
- **Gap analysis:** `.ai-reports/dogfood-frascanada/wireframe-vs-live-gap-analysis.md` — wireframe vs live site reconciliation

### Planning
- **Phase 1 PRD:** `.ai-reports/PRD.md` — 6 wireframed page types + search + global nav/footer
- **Phase 2 PRD:** `.ai-reports/PRD-phase2.md` — 13 gap templates (standards, documents, news, meetings, members, committees, contact, auth, jobs)
- **Phase 1 Build Plan:** `.ai-reports/BUILD_PLAN.md` — 11 epics (0-10), 58 tasks
- **Phase 2 Build Plan:** `.ai-reports/BUILD_PLAN-phase2.md` — 9 epics (11-18, 20-21; Epic 19 reserved), 73 tasks
- **Master TODO:** `.ai-reports/MASTER_TODO.md` — spec-driven task list with acceptance criteria, validation commands, Ralph loop stop conditions
- **Content Migration:** `.ai-reports/dogfood-frascanada/content-migration-strategy.md` — Phase 3 extraction, transformation, redirect strategy

### Research (Notion-sourced)
- **Notion cross-reference:** `.ai-reports/dogfood-frascanada/notion-research-cross-reference.md` — gaps found comparing Notion specs against PRDs
- **Notion component specs:** `.ai-reports/dogfood-frascanada/notion-component-specs.md` — field-level specs from 53 Notion sub-pages
- **Consolidated gaps report:** `.ai-reports/consolidated-gaps-report.md` — all gaps, architecture corrections, open questions
- **Translation PRD:** `.ai-reports/PRD-translation.md` — AI-assisted bilingual workflow
- **Search research:** `.ai-reports/research-search-solutions.md` — Meilisearch selection rationale
- **Sitecore admin research:** `.ai-reports/research-sitecore-admin-interface.md` — Sitecore UX patterns for Payload CMS design
- **Documentation audit:** `.ai-reports/DOCUMENTATION_AUDIT.md` — 76-issue audit, all fixed
- **Sitecore dump analysis:** `.ai-reports/sitecore-dump-analysis.md` — 6 journey maps, survey data, branding guidelines, opportunity mapping, IA cross-reference

### Pipeline
- **Automated crawl:** `scripts/` — Playwright crawler, classifier, inspector, report generator
- **Crawl data:** `data/` — raw page inspections, classifications
- **Crawl report:** `.ai-reports/dogfood-frascanada/report.md` + `page-types.md`

### Meta
- **Audit log:** `.ai-reports/AUDIT_LOG.md` — full change history

## MCP Integrations
- **Notion** — Claude AI integration (search, fetch, create, update pages)
- **Slack** — Claude AI integration for channel search, history, replies
- **Figma** — Claude AI integration (design context, screenshots, metadata)
- **Chrome DevTools** — Browser inspection, screenshots, performance analysis
- **Claude in Chrome** — Browser automation (preferred for verification tasks)
- **Context7** — Documentation lookups (use before web search)

## Payload CMS Skills (Installed)

Four Payload-specific skills are installed and auto-trigger on Payload work. **Use these instead of guessing patterns.**

| Skill | When It Triggers | What It Provides |
|-------|-----------------|------------------|
| `payload-super` | Collections, fields, hooks, access control, queries, endpoints, plugins | Full reference library: FIELDS.md, COLLECTIONS.md, HOOKS.md, ACCESS-CONTROL.md, QUERIES.md, ENDPOINTS.md, ADAPTERS.md, ADVANCED.md, PLUGIN-DEVELOPMENT.md. Includes Decision Framework + Quality Checks. |
| `payload` | Same triggers as payload-super (official Payload skill) | Subset of payload-super. Both load automatically — payload-super is preferred. |
| `payload-migrate` | Database migrations, schema changes | Creating, running, rolling back Payload + PostgreSQL migrations |
| `generate-translations` | Adding translation keys to Payload packages | **For Payload repo contributions only** — NOT for our EN/FR content. Ignore for FRAS project work. |

### Key Payload Patterns to Follow (from payload-super)
- **Local API:** Always use `overrideAccess: false` when operating on behalf of a user
- **Hooks:** Always pass `req` to nested operations for transaction integrity
- **Recursive hooks:** Use `context` flags to prevent infinite loops
- **Types:** Import from `payload-types.ts`, use `Access` type for access control functions
- **Collections:** Set meaningful `admin.useAsTitle` on every collection
- **Localization:** Use `localized: true` on text fields that need EN/FR (our i18n approach)

### Ralph Loop Skill Usage
During Ralph loops, the payload-super skill auto-triggers when building collections, hooks, access control, or custom admin views. The skill's reference docs (`~/.claude/skills/payload-super/reference/`) contain authoritative patterns for:
- Collection definitions with drafts/versions (`COLLECTIONS.md`)
- All field types including blocks, arrays, joins (`FIELDS.md`)
- Hook lifecycle patterns with context guards (`HOOKS.md`)
- Row-level access control and RBAC (`ACCESS-CONTROL.md`, `ACCESS-CONTROL-ADVANCED.md`)
- Custom endpoints and API routes (`ENDPOINTS.md`)
- Plugin architecture for reusable extensions (`PLUGIN-DEVELOPMENT.md`)

**Priority order for Payload docs:** payload-super skill reference > Context7 MCP > payloadcms.com/llms-full.txt

## Conventions
- All AI-generated reports, analysis, and documentation go in `.ai-reports/`
- Never modify `.env` files — only `.env.example`
- Use Context7 MCP for documentation queries before web search
- Use Claude in Chrome MCP for browser automation and verification (NOT chrome-devtools)
- Always update `.ai-reports/AUDIT_LOG.md` after significant changes

## Key Facts
- **Live site:** frascanada.ca (Sitecore CMS, ASP.NET WebForms, PostBack pagination)
- **Bilingual:** EN/FR with language switcher
- **Auth:** Aptify DB API (NOT OAuth/SAML — direct API calls, simple member True/False)
- **Search:** Meilisearch (MIT, self-hosted Docker, `payload-meilisearch` plugin, React InstantSearch)
- **Newsletter:** HubSpot Forms API integration
- **CAPTCHA:** ReCaptcha v3 (invisible, `react-google-recaptcha-v3`)
- **Analytics:** GA4 via `@next/third-parties`
- **Cookie consent:** OneTrust
- **5 boards/councils:** AcSB, PSAB, AASB, CSSB, RASOC — each with unique tab/content variations
- **11 standards sections** under IFRS, Sustainability, ASPE (not 12)
- **5 live site bugs documented** in verified report Section 6
- **Total scope:** 131 implementation tasks across 20 epics (Phase 1: 58 tasks, Phase 2: 73 tasks)
- **Content migration:** ~2,700+ content items across 13 types, 894 URL redirects needed

## RASOC Rules
RASOC is an **oversight council**, NOT a standards board. It behaves differently from the 4 boards:
- **NO Board Detail page** — RASOC does not get its own `/rasoc` board landing
- **NO active projects** — excluded from Active Projects listing and board nav sidebar
- **NO search facet** — excluded from "By Board" search filter
- **YES footer** — appears in footer board list (5 total)
- **YES About Us nav** — appears as "Oversight Council" under About Us mega-menu
- **YES volunteer tabs** — appears in volunteer opportunities board tabs (Phase 2)

## Component Architecture Rules (from Notion research)
These are confirmed design decisions from the Fishtank Notion specs. Do not deviate.

### Naming & Deduplication
- `<QuickActions />` = same component for Board Detail sidebar AND Project Detail sidebar (just different content). Do NOT create a separate "Project Actions" component.
- `<SectionNav />` = single component with `variant` prop (`'sidebar'` | `'tabs'`). Covers both left rail vertical nav AND horizontal tab bar.
- `<PromoCardGrid />` = homepage-only one-off. Not a reusable component.

### Search
- **Hero Banner search** is scoped to **Projects only** (not sitewide). Placeholder text should reflect this.
- **Sitewide search** is via the header search icon → search results page with left rail facets.
- **Search modal** is under debate — Notion questions its purpose. May be dropped for direct results navigation.

### Component Behavior
- **Project Timeline:** Configurable up to **7 stages** (wireframe shows 5 as example). Tri-state: complete (checkmark), in-progress (highlighted), not-started (greyed). Authors curate stages.
- **Events Card:** Start Time field is **webinar-only** — conditional display based on event type.
- **Subscribe Banner:** Submits directly to **HubSpot** — not a generic form.
- **News stories:** Currently have **no images** in content. Image fields exist in Sitecore but aren't populated. Carousel component would need an image strategy.

### Members & Auth
- **3 member-only forms** share identical UI: Document For Comment Submission, Event Registration, Volunteer Registration
- All 3 are form → email with attachment. **No storage, no logs.**
- Member check is **simple True/False** via Aptify API. No usergroups, no geo-restrictions, no content gating beyond these 3 forms.
- All other content is freely available to members and non-members alike.
- Login is for: (1) submitting comments to Document for Comment, (2) newsletter preferences management (linked to HubSpot CRM). Login location should stay as-is (users are familiar).

## Canonical Collection Names
During planning, some collections were named differently in Phase 1 vs Phase 2 wireframes. These are the **canonical names to use during implementation:**

| Canonical Name | Replaces | Notes |
|---|---|---|
| `document-for-comment` | `consultations` (Phase 1 name) | More specific — listing data for Documents for Comment |
| `document-detail` | — | Full page content for exposure drafts, consultation papers |
| `resources` | `documents` (Phase 1 name) | Broader scope — articles, guidance, webinars, uploaded files |
| `events` | `meetings` (Phase 2 wireframe name) | Broader scope — `type` enum: meeting, webinar, deadline, decision-summary |
| `contacts` | — | Use `title` field (not `role`), `name` includes credentials (e.g., "Andrew White, CPA, CA") |
| `board-members` | — | Separate from `contacts` — has photo, term dates, role enum |

Do NOT create `consultations`, `documents`, or `meetings` collections — use the canonical names above.

---

## Security Rules

**MANDATORY: Read and follow `SECURITY.md` before writing ANY code that touches auth, database, API routes, or environment variables.** This is non-negotiable. The full security template lives at the project root and covers: secret handling, RLS requirements, service role restrictions, function hardening, pre-merge checks, enforced architecture patterns, and incident response. Every PR must comply.

---

## Ralph Wiggum Loop Workflow

This project uses **Ralph Wiggum loops** for iterative, spec-driven development. Each loop feeds the same prompt repeatedly, with Claude seeing its own previous work in files and git history.

### How Ralph Loops Work Here

1. **Pick an epic** from `MASTER_TODO.md`
2. **Run the Ralph prompt** for that epic (stored in `.ai-reports/ralph-prompts/`)
3. **Each iteration:** Claude reads the prompt, checks MASTER_TODO.md for current status, works on the next incomplete task, validates against acceptance criteria
4. **Stop condition:** When all tasks in the epic pass validation, output `<promise>EPIC N COMPLETE</promise>`
5. **Human approval gate:** User reviews the completed epic before marking it done

### Rules for Ralph Loop Sessions

**BEFORE doing any work:**
1. Read `MASTER_TODO.md` — find the first `[ ]` task in your assigned epic
2. Read the relevant BUILD_PLAN section for full task details
3. Read relevant wireframe specs (`.ai-reports/wireframe-specs.md` or `wireframe-specs-phase2.md`)
4. Read design tokens (`.ai-reports/dogfood-frascanada/design-tokens.md`) if building UI
5. Check dependencies — if a task is `[!]` blocked, skip to next available task

**WHILE working:**
1. Mark current task as `[~]` in MASTER_TODO.md
2. Build the thing — follow acceptance criteria exactly
3. Run validation commands listed in the task
4. If validation passes: mark `[x]` in MASTER_TODO.md
5. If validation fails: fix the issue, re-validate. Do NOT mark complete until passing.
6. Move to next `[ ]` task in the epic

**AFTER completing an epic:**
1. Run ALL validation commands for every task in the epic
2. Verify no TypeScript errors: `npx tsc --noEmit`
3. Verify dev server runs: `npm run dev`
4. Update AUDIT_LOG.md with summary of what was built
5. Output `<promise>EPIC N COMPLETE</promise>`

### Stop Conditions (when to output `<promise>`)

- **Task-level:** All acceptance criteria checkboxes are checked AND validation commands pass
- **Epic-level:** ALL tasks in the epic are `[x]` AND full epic validation passes
- **Blocked:** If you hit a real blocker (missing dependency, unclear spec), mark task `[!]`, add a note, and move on. Output `<promise>EPIC N BLOCKED: [reason]</promise>` if no more tasks are available.

### Approval Gates

These epics require **human review before proceeding** to dependent epics:
- **Epic 0** (Design System) — foundation for everything. User must approve tokens, primitives, Tailwind config.
- **Epic 1** (CMS Collections) — data model for all content. User must approve field structures.
- **Epic 5** (Meilisearch) — search infrastructure. User must approve index configuration.
- **Epic 17** (Auth) — security-critical. User must approve Aptify integration approach.
- **Epic 18** (i18n) — affects all pages. User must approve locale routing strategy.

### Audit Log Recording

After every Ralph loop session (whether completing an epic or hitting a blocker):
1. Update `.ai-reports/AUDIT_LOG.md` with:
   - Date (use `date '+%Y-%m-%d'`)
   - Type: `BUILD`, `FIX`, `BLOCKED`, or `REVIEW`
   - Epic and tasks completed
   - Files created/modified
   - Any issues or deviations from spec
2. Git commit all changes with message: `feat(epic-N): [description]`

### Spec-Driven Design Rules

1. **Wireframe specs are the source of truth** for UI components and layouts
2. **Design tokens** define all visual properties — never hardcode colors, spacing, or typography
3. **PRD** defines data models, relationships, and business logic
4. **BUILD_PLAN** defines task scope and dependencies
5. **MASTER_TODO** defines acceptance criteria and validation
6. If any spec is ambiguous, check the others for context. If still unclear, mark `[!]` and move on.
