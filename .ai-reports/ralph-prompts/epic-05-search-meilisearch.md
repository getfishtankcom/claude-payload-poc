# Ralph Loop Prompt — Epic 5: CMS Data Integration & Search

## Your Mission

Wire all Phase 1 UI components (Epics 2-4) to Payload CMS data, introduce block schemas for the page builder architecture, and build the full Meilisearch search experience. This epic retroactively eliminates hardcoded content from Epics 2-4 and establishes the CMS-first data pattern for all subsequent epics.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules (especially canonical collection names + component architecture rules)
2. `.ai-reports/MASTER_TODO.md` — find Epic 5 tasks (5.1–5.11)
3. `.ai-reports/BUILD_PLAN.md` — Epic 5 task details
4. `.ai-reports/wireframe-specs.md` — Search Modal + Search Results wireframes
5. `.ai-reports/research-search-solutions.md` — Meilisearch decision rationale
6. `.ai-reports/PRD.md` — Section 4.6 (Search), Section 10 (Integrations), homepage global spec
7. `src/payload-types.ts` — generated Payload types (regenerate with `npx payload generate:types` if stale)

## CMS Data Pattern (MANDATORY)

All page content MUST come from Payload CMS. Follow this pattern:

1. **Page route (server component):** Fetch data via typed helpers from `src/lib/payload-helpers.ts` or direct `payload.find()` / `payload.findGlobal()` calls
2. **Pass data as props:** Never fetch CMS data inside presentational components
3. **No hardcoded content:** Component props must NOT have default values for user-facing text. The only acceptable defaults are empty states ("No items found")
4. **Typed props:** Component interfaces must match Payload collection/global field shapes (use generated types from `payload-types.ts`)
5. **Empty states:** Handle missing CMS data with fallback UI (skeleton or "No data" message), NOT fallback text
6. **Canonical names:** Use `document-for-comment` (not consultations), `resources` (not documents), `events` (not meetings)
7. **Exception:** Form field labels, button labels like "Submit", and structural UI text ("Showing X of Y") are acceptable hardcoded strings — these are UI chrome, not CMS content

Example:
```tsx
// Page route (server component)
import { getHomepage, getLatestNews } from '@/lib/payload-helpers'

export default async function HomePage() {
  const [homepage, news] = await Promise.all([getHomepage(), getLatestNews(3)])
  return <HeroCTA heading={homepage.hero_heading} description={homepage.hero_subtitle} />
}

// Presentational component — NO default content values
interface HeroCTAProps {
  heading: string
  description: string
}
export function HeroCTA({ heading, description }: HeroCTAProps) { ... }
```

## What to Build

### CMS Integration (5.1–5.6) — run first

#### 5.1 Create Payload block schemas
- Create `src/blocks/` directory with block schema files:
  - `HeroBlock.ts` — heading, subtitle, search_enabled (boolean), background (enum: gradient, solid, image)
  - `CTABlock.ts` — heading, description, button_label, button_url, variant (enum: light, dark, purple)
  - `RichTextBlock.ts` — content (richText field)
  - `NewsGridBlock.ts` — heading, news_count (number, default 3), show_view_all (boolean)
  - `BrowseByStandardBlock.ts` — heading, categories (array: title, standards relationship)
  - `ContentBlock.ts` — heading, content (richText), sidebar_type (enum: none, staff_contact, section_nav)
- Export blocks array from `src/blocks/index.ts`
- Each block uses `Block` type from `payload/types`
- Path: `src/blocks/`

#### 5.2 Create `<BlockRenderer />` component
- Maps `blockType` string → React component
- Type registry in `src/components/blocks/block-registry.ts`
- `<BlockRenderer blocks={blocks} />` iterates and renders
- Handles unknown block types gracefully (logs warning, renders nothing)
- Co-located story file with mixed block types
- Path: `src/components/blocks/`

#### 5.3 Create typed CMS fetch helpers
- File: `src/lib/payload-helpers.ts`
- Helpers:
  - `getHomepage()` — fetches `homepage` global
  - `getNavigation()` — fetches `navigation` global
  - `getFooter()` — fetches `footer` global
  - `getLatestNews(limit: number)` — fetches `news` collection sorted by date desc
  - `getUpcomingEvents(limit: number)` — fetches `events` collection filtered by future dates
  - `getStandardsByCategory()` — fetches `standards` grouped by category
- All helpers return typed results using generated `payload-types.ts`
- Import `getPayload` from `payload` for server-side access
- Update `homepage` global to include a `blocks` array field (for page builder architecture)

#### 5.4 Wire SiteHeader + MegaMenu to `navigation` global
- Root layout (`src/app/(frontend)/layout.tsx`) fetches `navigation` global via `getNavigation()`
- Pass navigation data as props to `<SiteHeader />`
- SiteHeader passes relevant data to `<MegaMenu />` and `<MobileMenu />`
- Remove ALL hardcoded navigation items from SiteHeader/MegaMenu/MobileMenu
- Navigation structure comes entirely from CMS data
- Handle missing/empty nav data with sensible empty state

#### 5.5 Wire SiteFooter to `footer` global
- Root layout fetches `footer` global via `getFooter()`
- Pass footer data as props to `<SiteFooter />`
- Remove ALL hardcoded footer links, board lists, and text content
- Footer columns, boards links, quick links, newsletter config from CMS
- Handle missing/empty footer data with sensible empty state

#### 5.6 Wire homepage route to CMS data
- `src/app/(frontend)/page.tsx` fetches homepage global + news + events + standards via helpers
- Pass data as props to all homepage section components
- Remove ALL hardcoded content strings from Epic 4 components:
  - Hero heading ("Canada's Official Hub...") → from `homepage.hero_heading`
  - Hero subtitle → from `homepage.hero_subtitle`
  - "New to FRAS?" text → from `homepage.cta_block`
  - News items → from `getLatestNews(3)`
  - Events → from `getUpcomingEvents(5)`
  - Standards grid → from `getStandardsByCategory()`
- Add empty state handling for all sections

### Search (5.7–5.11)

#### 5.7 Meilisearch infrastructure
- `docker-compose.yml` with Meilisearch service (v1.x, port 7700)
- Install: `meilisearch`, `@meilisearch/instant-meilisearch`, `react-instantsearch`
- Install: `payload-meilisearch` plugin
- Configure in `payload.config.ts`:
  - Plugin config with Meilisearch host/API key from env
  - Searchable collections: projects, news, document-for-comment, resources, events, pages
  - `afterChange` hooks for auto-sync
- Bilingual indexes: `{collection}_en`, `{collection}_fr`
- Filterable attributes: board, standard, content_type, file_type, date
- Searchable attributes: title, body, excerpt
- Add `MEILISEARCH_HOST` and `MEILISEARCH_API_KEY` to `.env.example`

#### 5.8 `<SearchModal />`
- Full-screen overlay (Headless UI `<Dialog>`)
- Large search input: "Projects, meetings, documents, and more."
- Recent tags section (pill chips via `<TagChip />`)
- Popular tags section (from `search-config` global)
- Search + Cancel buttons
- Mobile: same layout, stacked tags
- Path: `src/components/search/search-modal.tsx`

#### 5.9 `<FilterSidebar />` + `<SearchResultCard />`
- **FilterSidebar:**
  - 5 collapsible accordion sections (Headless UI `<Disclosure>`)
  - By Board: checkboxes (CSSB, AcSB, PSAB, AASB)
  - By Standard: grouped checkboxes
  - Files & Media: checkboxes (All, PDF, Word, Video)
  - Content Type: checkboxes (Project, News, Doc for Comment, Resource, etc.)
  - Date: radio buttons (Last 30d, 3mo, 1yr, All time)
  - Active filter count badges, "Clear All" link
  - Desktop: sidebar | Mobile: collapsible accordion above results
  - Wire to Meilisearch `<RefinementList>` widgets
  - Path: `src/components/search/filter-sidebar.tsx`
- **SearchResultCard:**
  - Content type badge + board name + date
  - Title (linked heading)
  - Description (truncated)
  - File info when applicable
  - CTA link varies by content type
  - Path: `src/components/search/search-result-card.tsx`

#### 5.10 Search Results page
- Route: `src/app/(frontend)/search/page.tsx`
- `<InstantSearch>` wrapper from `react-instantsearch`
- `searchClient` from `@meilisearch/instant-meilisearch`
- 2-column layout: FilterSidebar + results list
- `<SearchBox>`, `<Hits>` (rendering SearchResultCard), `<Pagination>`, `<Stats>`
- Sort by dropdown (Relevance, Date)
- 'use client' directive (InstantSearch requires client-side)

#### 5.11 Document extraction pipeline
- Install: `pdf-parse`, `mammoth`
- Create extraction utility: `src/lib/document-extraction.ts`
- `afterChange` hook on `resources` collection:
  - If file is PDF → extract text with `pdf-parse`
  - If file is .docx → extract text with `mammoth`
  - Index extracted text in Meilisearch (not stored in Payload DB)
- Handle errors gracefully (skip unreadable, log warnings)

## Validation

```bash
# CMS Integration
npx tsc --noEmit  # TypeScript clean
ls src/blocks/*.ts | wc -l  # ≥ 6 block schema files
grep -rn "hardcoded\|TODO" src/components/layout/  # should return 0 matches
grep -rn "New to FRAS\|Canada's Official Hub" src/app/ src/components/  # 0 outside seed data

# Meilisearch running
docker compose up -d meilisearch
curl -s http://localhost:7700/health | grep -q "available"

# Search page loads
npm run dev
# Visit http://localhost:3000/search — page renders without errors
# Visit http://localhost:3000 — homepage renders CMS data (or empty states)
# Change data in /admin → frontend updates on refresh

npx storybook build --quiet  # Storybook compiles
```

## Workflow

**CMS Integration first, then Search:**

1. **5.1** → Block schemas (foundation for page builder)
2. **5.2** → BlockRenderer component
3. **5.3** → CMS fetch helpers + homepage global update
4. **5.4 + 5.5** (parallel) → Wire header + footer to globals
5. **5.6** → Wire homepage to CMS data
6. **5.7** → Meilisearch infrastructure
7. **5.8 + 5.9** (parallel) → Search components
8. **5.10** → Search results page
9. **5.11** → Document extraction pipeline
10. When ALL `[x]`: update AUDIT_LOG.md, output:

```
<promise>EPIC 5 COMPLETE</promise>
```

## IMPORTANT

- This is an APPROVAL GATE epic — CMS wiring pattern + Meilisearch config reviewed before dependent epics
- Block schemas establish the page builder architecture used in Epics 25-26 (admin panel)
- Use `payload-meilisearch` plugin — don't build custom sync hooks
- `react-instantsearch` widgets handle most search UI — don't reinvent
- Search page MUST be a client component ('use client')
- Docker Compose for local dev, production deployment is separate concern
- If `payload-meilisearch` plugin doesn't exist or doesn't work, fall back to custom `afterChange` hooks + direct Meilisearch JS client
- Use canonical collection names: `document-for-comment` (NOT consultations), `resources` (NOT documents), `events` (NOT meetings)
- After wiring components to CMS data, verify NO hardcoded user-facing text remains in Epic 2-4 components (except UI chrome like "Submit", "Read More →")

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-05
```

Config: `scripts/self-test-configs/epic-05.json`
See exit protocol for handling failures vs warnings.

### Storybook Stories

For EVERY component built in this epic, create a co-located story file:

- File: `ComponentName.stories.tsx` next to `ComponentName.tsx`
- Format: CSF3 with `satisfies Meta<typeof Component>` and `tags: ['autodocs']`
- Title hierarchy: `Category/ComponentName` (e.g., `Layout/SiteHeader`, `UI/Button`, `Board/SectionNav`)
- Required stories per component:
  - Default (all default props)
  - Each variant (if component has variants)
  - Mobile viewport (`parameters: { viewport: { defaultViewport: 'mobile' } }`)
  - Edge case (empty data, long text, error state)
- Use mock data from `src/__mocks__/cms-data.ts` for CMS-driven components — extend the mock file if needed
- For compound components (e.g., Card with Card.Header, Card.Body), show all slot combinations

**Validation:** `npx storybook build --quiet` must exit 0

---

## EXIT PROTOCOL (MANDATORY — applies to every Ralph loop)

### Per-Task Completion

A task is DONE when ALL of these pass. Do not skip any.

1. Every acceptance criteria checkbox in MASTER_TODO.md is satisfied
2. Every validation command listed for the task exits with code 0
3. `npx tsc --noEmit` passes (zero TypeScript errors)
4. Task status updated to `[x]` in MASTER_TODO.md
5. Git commit created: `feat(epic-N): task N.M — [short description]`

### Per-Task Failure (3-strike rule)

If a task fails validation:
1. First attempt: diagnose root cause, fix, re-validate
2. Second attempt: try alternative approach, re-validate
3. Third attempt: mark task `[!]` with reason, move to next task
4. Do NOT loop endlessly — 3 attempts max per task

### Per-Epic Completion

When ALL tasks in the epic are `[x]`:

1. Run full validation suite:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. If both pass:
   - Update `.ai-reports/AUDIT_LOG.md` with:
     - Date (run `date '+%Y-%m-%d'`)
     - Type: BUILD
     - Epic number and name
     - All tasks completed
     - Files created/modified (list them)
     - Any deviations from spec
   - Create summary git commit: `feat(epic-N): [epic description] — all tasks complete`
   - Output EXACTLY this (the runner script watches for it):
     ```
     <promise>EPIC N COMPLETE</promise>
     ```
3. If build fails: treat as a task failure, apply 3-strike rule to the build fix

### Blocked Exit

When you cannot proceed:

1. Mark current task `[!]` in MASTER_TODO.md with reason
2. Try remaining tasks in the epic (skip blocked ones)
3. When no more tasks can be attempted, output EXACTLY:
   ```
   <promise>EPIC N BLOCKED: [one-line reason]</promise>
   ```

### HARD STOPS (abort the entire loop immediately)

Output `<promise>EPIC N ABORTED: [reason]</promise>` if ANY of these occur:
- Dev server won't start after 3 fix attempts
- Unresolvable dependency conflict (e.g., peer dep hell)
- Task requires output from a GATE epic not yet approved
- More than 5 structural TypeScript errors (not typos — architectural issues)
- Database connection fails and cannot be recovered
- You detect you're in an infinite loop (same error 3+ times)

### What NOT To Do

- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT mark tasks `[x]` before validation passes
- Do NOT skip reading MASTER_TODO.md at the start — always check current state
- Do NOT retry the same failing approach more than 3 times
- Do NOT install packages not specified in the build plan without documenting why
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push` — the runner script handles that after human review
