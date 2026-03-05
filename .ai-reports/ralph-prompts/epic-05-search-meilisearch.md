# Ralph Loop Prompt — Epic 5: Search Experience (Meilisearch)

## Your Mission

Build the full search experience — Meilisearch infrastructure, search modal, filter sidebar, results page, and document extraction pipeline.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 5 tasks
3. `.ai-reports/BUILD_PLAN.md` — Epic 5 task details (5.1–5.6)
4. `.ai-reports/wireframe-specs.md` — Search Modal + Search Results wireframes
5. `.ai-reports/research-search-solutions.md` — Meilisearch decision rationale
6. `.ai-reports/PRD.md` — Section 4.6 (Search), Section 10 (Integrations)

## What to Build

### 5.1 `<SearchModal />`
- Full-screen overlay (Headless UI `<Dialog>`)
- Large search input: "Projects, meetings, documents, and more."
- Recent tags section (pill chips via `<TagChip />`)
- Popular tags section
- Search + Cancel buttons
- Mobile: same layout, stacked tags
- Path: `src/components/search/search-modal.tsx`

### 5.2 `<FilterSidebar />`
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

### 5.3 `<SearchResultCard />`
- Content type badge + board name + date
- Title (linked heading)
- Description (truncated)
- File info when applicable
- CTA link varies by content type
- Path: `src/components/search/search-result-card.tsx`

### 5.4 Search Results page
- Route: `src/app/(frontend)/search/page.tsx`
- `<InstantSearch>` wrapper from `react-instantsearch`
- `searchClient` from `@meilisearch/instant-meilisearch`
- 2-column layout: FilterSidebar + results list
- `<SearchBox>`, `<Hits>` (rendering SearchResultCard), `<Pagination>`, `<Stats>`
- Sort by dropdown (Relevance, Date)
- 'use client' directive (InstantSearch requires client-side)

### 5.5 Meilisearch infrastructure
- `docker-compose.yml` with Meilisearch service (v1.x, port 7700)
- Install: `meilisearch`, `@meilisearch/instant-meilisearch`, `react-instantsearch`
- Install: `payload-meilisearch` plugin
- Configure in `payload.config.ts`:
  - Plugin config with Meilisearch host/API key from env
  - Searchable collections: projects, news, consultations, documents, events, pages
  - `afterChange` hooks for auto-sync
- Bilingual indexes: `{collection}_en`, `{collection}_fr`
- Filterable attributes: board, standard, content_type, file_type, date
- Searchable attributes: title, body, excerpt
- Add `MEILISEARCH_HOST` and `MEILISEARCH_API_KEY` to `.env.example`

### 5.6 Document extraction pipeline
- Install: `pdf-parse`, `mammoth`
- Create extraction utility: `src/lib/document-extraction.ts`
- `afterChange` hook on `documents` collection:
  - If file is PDF → extract text with `pdf-parse`
  - If file is .docx → extract text with `mammoth`
  - Index extracted text in Meilisearch (not stored in Payload DB)
- Handle errors gracefully (skip unreadable, log warnings)

## Validation

```bash
# Meilisearch running
docker compose up -d meilisearch
curl -s http://localhost:7700/health | grep -q "available"

# Search page loads
npm run dev
# Visit http://localhost:3000/search — page renders without errors
# Type a query — results appear (or empty state if no data)
# Filter sidebar toggles work
# Pagination renders

npx tsc --noEmit  # TypeScript clean
```

## Workflow

1. Start with 5.5 (infrastructure) — everything depends on it
2. Then 5.1, 5.2, 5.3 (components — can be parallel)
3. Then 5.4 (page wiring)
4. Then 5.6 (extraction pipeline)
5. When ALL `[x]`: update AUDIT_LOG.md, output:

```
<promise>EPIC 5 COMPLETE</promise>
```

## IMPORTANT

- This is an APPROVAL GATE epic — Meilisearch config reviewed before dependent epics
- Use `payload-meilisearch` plugin — don't build custom sync hooks
- `react-instantsearch` widgets handle most UI — don't reinvent
- Search page MUST be a client component ('use client')
- Docker Compose for local dev, production deployment is separate concern
- If `payload-meilisearch` plugin doesn't exist or doesn't work, fall back to custom `afterChange` hooks + direct Meilisearch JS client

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
