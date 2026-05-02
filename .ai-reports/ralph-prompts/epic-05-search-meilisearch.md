# Ralph Loop Prompt — Epic 5: CMS Data Integration & Search

## Your Mission

Wire all Phase 1 UI components (Epics 2-4) to Payload CMS data, introduce block schemas and hero system following the official Payload website template pattern, and build the full Meilisearch search experience. This epic retroactively eliminates hardcoded content from Epics 2-4 and establishes the CMS-first data pattern for all subsequent epics.

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
  return (
    <>
      <RenderHero {...homepage.hero} />
      <RenderBlocks blocks={homepage.layout} />
    </>
  )
}
```

## Payload Block Architecture (from official website template)

**CRITICAL:** Follow the official Payload CMS website template patterns exactly. Reference: `payloadcms/payload/templates/website`

### Directory Structure
```
src/
  blocks/
    CTABlock/
      config.ts           # Block schema (slug, interfaceName, fields)
      Component.tsx        # React rendering component
    ContentBlock/
      config.ts
      Component.tsx
    NewsGridBlock/
      config.ts
      Component.tsx
    BrowseByStandardBlock/
      config.ts
      Component.tsx
    RichTextBlock/
      config.ts
      Component.tsx
    RenderBlocks.tsx       # Block type → component mapper
  heros/
    config.ts             # Hero group field (type select + variant fields)
    RenderHero.tsx         # Hero type → component mapper
    HighImpact/
      index.tsx           # Gradient hero with search bar (homepage)
    LowImpact/
      index.tsx           # Simple text hero (interior pages)
  fields/
    link.ts               # Reusable link() factory function
    linkGroup.ts           # Reusable linkGroup() factory function
```

### Key Patterns
1. **Hero is NOT a block** — it's a `type: 'group'` field with a `type` select (`none`, `highImpact`, `lowImpact`). Separate from the `layout` blocks field.
2. **Each block = directory** with `config.ts` (schema) + `Component.tsx` (renderer), NOT flat files.
3. **Every block config has:** `slug`, `interfaceName` (for generated types), `fields`, and optional `labels`.
4. **Rich text uses Lexical editor** — `lexicalEditor()` with `FixedToolbarFeature()`, `InlineToolbarFeature()`, and optionally `HeadingFeature({ enabledHeadingSizes: [...] })`.
5. **`link()` and `linkGroup()` factory functions** — reusable field definitions used across blocks (CTA links, content links, hero links). Uses `deepMerge` for per-instance overrides.
6. **Pages/globals use tabs:** Hero tab + Content tab (with `layout` blocks field) + SEO tab.
7. **`RenderBlocks`** — simple `slug → Component` mapping object, iterates blocks array, spreads props.
8. **`RenderHero`** — same pattern as RenderBlocks but for the hero `type` discriminator.
9. **`admin: { initCollapsed: true }`** on blocks array for compact admin UX.
10. **Conditional fields** use `admin: { condition: (_, siblingData) => ... }`.

### Block Config Template
```ts
import type { Block } from 'payload'
import { FixedToolbarFeature, HeadingFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { linkGroup } from '@/fields/linkGroup'

export const CTABlock: Block = {
  slug: 'cta',
  interfaceName: 'CTABlock',
  labels: { singular: 'Call to Action', plural: 'Calls to Action' },
  fields: [
    {
      name: 'richText',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
    },
    linkGroup({ appearances: ['default', 'outline'], overrides: { maxRows: 2 } }),
  ],
}
```

### RenderBlocks Template
```tsx
import type { Page } from '@/payload-types'
const blockComponents = {
  cta: CTABlock,
  content: ContentBlock,
  newsGrid: NewsGridBlock,
  browseByStandard: BrowseByStandardBlock,
  richText: RichTextBlock,
}
export const RenderBlocks: React.FC<{ blocks: Page['layout'][0][] }> = ({ blocks }) => {
  if (!blocks?.length) return null
  return blocks.map((block, i) => {
    const Block = blockComponents[block.blockType]
    if (!Block) return null
    return <div className="my-16" key={i}><Block {...block} /></div>
  })
}
```

## What to Build

### CMS Integration (5.1–5.6) — run first

#### 5.1 Create block schemas, hero system, and reusable fields

**Reusable fields** in `src/fields/`:
- `link.ts` — `link()` factory function returning a group field with internal/external link toggle, label, newTab checkbox, optional appearance select. Supports `overrides` param via `deepMerge`.
- `linkGroup.ts` — `linkGroup()` factory wrapping `link()` in an array field. Supports `appearances` and `overrides` params.

**Hero system** in `src/heros/`:
- `config.ts` — `hero` group field with:
  - `type` select: `none`, `highImpact` (gradient + search bar for homepage), `lowImpact` (simple text for interior pages)
  - `richText` (Lexical editor with heading features)
  - `links` via `linkGroup()`
  - `media` upload (conditional: only for `highImpact`)
  - `search_enabled` boolean (conditional: only for `highImpact` — controls whether hero search bar appears)
- `RenderHero.tsx` — maps `type` → hero variant component
- `HighImpact/index.tsx` — gradient hero with rich text, links, optional search bar (homepage)
- `LowImpact/index.tsx` — simple text hero with rich text and links (interior pages)

**Block schemas** in `src/blocks/` — each block is a **directory** with `config.ts` + `Component.tsx`:
- `CTABlock/` — rich text + linkGroup, variant select (light, dark, purple)
- `ContentBlock/` — columns array (size select + rich text + optional link per column), matching Payload template Content block pattern
- `RichTextBlock/` — single rich text field (Lexical)
- `NewsGridBlock/` — heading (text), news_count (number, default 3), show_view_all (boolean), populateBy (collection auto or manual selection)
- `BrowseByStandardBlock/` — heading (text), categories relationship to standards collection

**Every `config.ts` MUST have:** `slug`, `interfaceName`, `fields`. Use `lexicalEditor()` with `FixedToolbarFeature()` + `InlineToolbarFeature()` for all rich text fields.

**Export:** `src/blocks/index.ts` exports the blocks array for use in collection/global configs.

#### 5.2 Create `<RenderBlocks />` and update Pages collection + Homepage global

**`src/blocks/RenderBlocks.tsx`:**
- Slug → Component mapping object (NOT a registry file — keep it simple like the template)
- Iterates `blocks` array, looks up `block.blockType`, spreads block as props
- Unknown block types return `null` (no crash)
- Wraps each block in a spacing div
- Co-located `.stories.tsx` with mixed block types

**Update `src/collections/Pages.ts`:**
- Add tabs structure: Hero tab (using `hero` field from `src/heros/config.ts`), Content tab (with `layout` field of `type: 'blocks'`), SEO tab (existing meta group)
- Register all blocks from `src/blocks/index.ts` on the `layout` field
- Add `admin: { initCollapsed: true }` on the layout blocks field
- Keep existing `slug`, `title`, `sidebar_type` fields
- Add `publishedAt` date field in sidebar

**Update `src/globals/Homepage.ts`:**
- Add tabs structure: Hero tab (using `hero` field), Content tab (with `layout` blocks field)
- Keep `homepage` as a **global** (singleton — only one homepage)
- Migrate existing flat fields (`hero_heading`, `hero_subtitle`, `cta_*`, `browse_by_standard`) into the hero group + blocks layout
- The hero `richText` field replaces `hero_heading` + `hero_subtitle`
- CTA content moves to a CTABlock in the layout
- Browse by Standard moves to a BrowseByStandardBlock in the layout
- Newsletter text stays as a standalone field (it's in the footer global, not a block)

**Regenerate types:** Run `npx payload generate:types` after schema changes.

#### 5.3 Create typed CMS fetch helpers
- File: `src/lib/payload-helpers.ts`
- Helpers:
  - `getHomepage()` — fetches `homepage` global (now returns hero + layout blocks)
  - `getNavigation()` — fetches `navigation` global
  - `getFooter()` — fetches `footer` global
  - `getPageBySlug(slug: string)` — fetches from `pages` collection by slug (returns hero + layout)
  - `getLatestNews(limit: number)` — fetches `news` collection sorted by date desc
  - `getUpcomingEvents(limit: number)` — fetches `events` collection filtered by future dates
  - `getStandardsByCategory()` — fetches `standards` grouped by category
- All helpers use `getPayload` from `payload` + `configPromise` from `@payload-config`
- All return typed results using generated `payload-types.ts`

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
- `src/app/(frontend)/page.tsx` fetches homepage global via `getHomepage()`
- Uses `<RenderHero {...homepage.hero} />` for the hero section
- Uses `<RenderBlocks blocks={homepage.layout} />` for page body
- Also fetches news + events + standards for dynamic blocks (NewsGridBlock fetches its own data server-side, like the Payload template's ArchiveBlock)
- Remove ALL hardcoded content strings from Epic 4 components
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
# Block architecture
find src/blocks -name "config.ts" | wc -l  # ≥ 5 block directories
find src/blocks -name "Component.tsx" | wc -l  # matches config.ts count
ls src/heros/config.ts src/heros/RenderHero.tsx  # hero system exists
ls src/fields/link.ts src/fields/linkGroup.ts  # reusable fields exist
ls src/blocks/RenderBlocks.tsx  # block renderer exists

# CMS Integration
npx tsc --noEmit  # TypeScript clean
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

1. **5.1** → Block schemas + hero system + reusable fields (foundation)
2. **5.2** → RenderBlocks + update Pages collection + Homepage global
3. **5.3** → CMS fetch helpers
4. **5.4 + 5.5** (parallel) → Wire header + footer to globals
5. **5.6** → Wire homepage to CMS data using RenderHero + RenderBlocks
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
- **Follow the official Payload website template** (`payloadcms/payload/templates/website`) for block/hero architecture
- Hero is a GROUP FIELD, not a block — it lives above the blocks layout
- Each block is a DIRECTORY (config.ts + Component.tsx), not a flat file
- `interfaceName` on every block config for generated TypeScript types
- All richText fields use `lexicalEditor()` with `FixedToolbarFeature()` + `InlineToolbarFeature()`
- Use `link()` and `linkGroup()` reusable field factories — don't duplicate link field definitions
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
