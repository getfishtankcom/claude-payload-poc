# Ralph Loop Prompt Templates — FRAS Canada

## Execution Order

Ralph loops should be run in this order. Approval gates (marked with gate) require human review before proceeding.

### Phase 1 (59 tasks)

| # | Prompt File | Epics | Tasks | Gate? |
|---|------------|-------|-------|-------|
| 1 | `epic-00-scaffold-design-system.md` | Epic 0 | 6 | GATE |
| 2 | `epic-01-cms-collections.md` | Epic 1 | 11 | GATE |
| 3 | `epic-02-03-layout-atomic.md` | Epics 2+3 | 12 | — |
| 4 | `epic-04-homepage.md` | Epic 4 | 5 | — |
| 5 | `epic-05-search-meilisearch.md` | Epic 5 | 6 | GATE |
| 6 | `epic-06-07-08-09-board-project-listings.md` | Epics 6-9 | 13 | — |
| 7 | `epic-10-integration-polish.md` | Epic 10 | 6 | — |

### Phase 2 (73 tasks)

| # | Prompt File | Epics | Tasks | Gate? |
|---|------------|-------|-------|-------|
| 8 | `epic-11-phase2-collections.md` | Epic 11 | 13 | — |
| 9 | `epic-12-13-14-content-people-standards.md` | Epics 12-14 | 16 | — |
| 10 | `epic-15-16-documents-listings.md` | Epics 15-16 | 15 | — |
| 11 | `epic-17-20-forms-auth-gaps.md` | Epics 17+20 | 18 | GATE (auth) |
| 12 | `epic-18-i18n.md` | Epic 18 | 5 | GATE |
| 13 | `epic-21-phase2-polish.md` | Epic 21 | 6 | — |

### Custom Admin Panel (39 tasks)

| # | Prompt File | Epics | Tasks | Gate? |
|---|------------|-------|-------|-------|
| 14 | `epic-22-admin-foundation.md` | Epic 22 | 8 | GATE |
| 15 | `epic-23-content-tree.md` | Epic 23 | 6 | — |
| 16 | `epic-24-media-library.md` | Epic 24 | 9 | — |
| 17 | `epic-25-26-page-builder.md` | Epics 25+26 | 12 | GATE |
| 18 | `epic-27-workbox.md` | Epic 27 | 6 | — |

**Dependency chain:** Epic 22 (foundation) -> Epic 23 (tree) + Epic 24 (media, parallel with 23) -> Epics 25+26 (page builder, needs media picker from 24) -> Epic 27 (workbox, needs workflow from 22)

## How to Run a Ralph Loop

### Interactive (in current session):
```
/ralph-loop "$(cat .ai-reports/ralph-prompts/epic-00-scaffold-design-system.md)" --completion-promise "EPIC 0 COMPLETE" --max-iterations 20
```

### Headless (CLI):
```bash
cat .ai-reports/ralph-prompts/epic-00-scaffold-design-system.md | claude-code --continue
```

## Approval Gates

At each GATE, the loop stops and the user must:
1. Review all files created/modified
2. Run the full validation suite for that epic
3. Approve or request changes
4. Only then start the next Ralph loop

### Gate Table

| Gate | Epic | What to Review |
|------|------|---------------|
| Epic 0 | Design System | Tokens, primitives, Tailwind config |
| Epic 1 | CMS Collections | Field structures, relationships, seed data |
| Epic 5 | Meilisearch | Index config, search UI, facets |
| Epic 17 | Auth | Aptify integration, session handling |
| Epic 18 | i18n | Locale routing, EN/FR switching |
| Epic 22 | Admin Foundation | Workflow transitions, RBAC, locking, dashboard widgets |
| Epics 25+26 | Page Builder | Template zones, toolbox DnD, props drawer, canvas iframe communication |

## Success Criteria (Global)

A Ralph loop is considered successful when:
- All tasks in the epic are marked `[x]` in MASTER_TODO.md
- `npx tsc --noEmit` passes (zero TypeScript errors)
- `npm run dev` starts without errors
- All validation commands in MASTER_TODO.md pass
- AUDIT_LOG.md is updated with the completed work
- The `<promise>` tag is output
