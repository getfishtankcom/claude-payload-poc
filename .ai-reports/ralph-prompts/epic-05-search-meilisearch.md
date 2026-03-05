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
