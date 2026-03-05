# Ralph Loop Prompt Templates — FRAS Canada

## Quick Start

```bash
# Run a single epic
./scripts/ralph-runner.sh epic-00

# Run all of Phase 1 (stops at each gate for approval)
./scripts/ralph-runner.sh phase1

# Run two epics in parallel
./scripts/ralph-runner.sh parallel epic-12-14 epic-15-16

# Check status of all loops
./scripts/ralph-runner.sh status

# Approve a gate and merge to develop
./scripts/ralph-runner.sh approve epic-00
```

## Execution Order

Ralph loops run in this order. Approval gates (GATE) require human review before the next epic starts.

### Phase 1 (59 tasks)

| # | Prompt File | Epics | Tasks | Gate? | Parallel? |
|---|------------|-------|-------|-------|-----------|
| 1 | `epic-00-scaffold-design-system.md` | Epic 0 | 6 | GATE | — |
| 2 | `epic-01-cms-collections.md` | Epic 1 | 11 | GATE | — |
| 3 | `epic-02-03-layout-atomic.md` | Epics 2+3 | 12 | — | — |
| 4 | `epic-04-homepage.md` | Epic 4 | 5 | — | — |
| 5 | `epic-05-search-meilisearch.md` | Epic 5 | 6 | GATE | — |
| 6 | `epic-06-07-08-09-board-project-listings.md` | Epics 6-9 | 13 | — | — |
| 7 | `epic-10-integration-polish.md` | Epic 10 | 6 | — | — |

### Phase 2 (73 tasks)

| # | Prompt File | Epics | Tasks | Gate? | Parallel? |
|---|------------|-------|-------|-------|-----------|
| 8 | `epic-11-phase2-collections.md` | Epic 11 | 13 | — | — |
| 9 | `epic-12-13-14-content-people-standards.md` | Epics 12-14 | 16 | — | with #10 |
| 10 | `epic-15-16-documents-listings.md` | Epics 15-16 | 15 | — | with #9 |
| 11 | `epic-17-20-forms-auth-gaps.md` | Epics 17+20 | 18 | GATE | with #12 |
| 12 | `epic-18-i18n.md` | Epic 18 | 5 | GATE | with #11 |
| 13 | `epic-21-phase2-polish.md` | Epic 21 | 6 | — | — |

### Custom Admin Panel (39 tasks)

| # | Prompt File | Epics | Tasks | Gate? | Parallel? |
|---|------------|-------|-------|-------|-----------|
| 14 | `epic-22-admin-foundation.md` | Epic 22 | 8 | GATE | — |
| 15 | `epic-23-content-tree.md` | Epic 23 | 6 | — | with #16 |
| 16 | `epic-24-media-library.md` | Epic 24 | 9 | — | with #15 |
| 17 | `epic-25-26-page-builder.md` | Epics 25+26 | 12 | GATE | — |
| 18 | `epic-27-workbox.md` | Epic 27 | 6 | — | — |

## How It Works

### Runner Script (`scripts/ralph-runner.sh`)

The runner handles everything:
1. Creates a git worktree + branch (`ralph/epic-XX`) from `develop`
2. Creates an isolated Postgres DB (`fras_ralph_epic_XX`)
3. Copies `.env` and updates `DATABASE_URI` for isolation
4. Runs `npm install` in the worktree
5. Launches Claude headless with the prompt + exit protocol
6. Iterates up to 30 times (re-feeds same prompt, Claude checks its own work)
7. Watches for `<promise>` tags to detect completion/blocked/aborted
8. Logs everything to `.ai-reports/ralph-logs/`

### Running Overnight

```bash
# Start Phase 1 and go to sleep
# It will run epic-00, stop at gate, and wait for your approval
./scripts/ralph-runner.sh phase1

# After waking up, check status
./scripts/ralph-runner.sh status

# Review the work in the worktree
cd ../fras-ralph/epic-00
git log --oneline
npm run build  # verify it builds

# Approve and continue
cd /path/to/fras
./scripts/ralph-runner.sh approve epic-00
./scripts/ralph-runner.sh phase1  # picks up where it left off
```

### Parallel Execution

Some epics can run simultaneously (different worktrees, different DBs):

```bash
# Phase 2 parallel pairs (runner handles this automatically)
./scripts/ralph-runner.sh phase2

# Or manually run specific parallels
./scripts/ralph-runner.sh parallel epic-12-14 epic-15-16
```

**Parallel pairs:**
- Epics 12-14 || 15-16 (content pages || document pages)
- Epics 17+20 || 18 (auth+gaps || i18n)
- Epic 23 || 24 (content tree || media library)

### Interactive Mode (in current Claude session)

```
/ralph-loop "$(cat .ai-reports/ralph-prompts/epic-00-scaffold-design-system.md)" --completion-promise "EPIC 0 COMPLETE" --max-iterations 20
```

## Approval Gates

At each GATE, the sequence halts and you must:
1. Review all files created/modified in the worktree
2. Run `npx tsc --noEmit && npm run build` in the worktree
3. Approve (`./scripts/ralph-runner.sh approve epic-XX`) or reject
4. The runner merges the branch to `develop` on approval

| Gate | Epic | What to Review |
|------|------|---------------|
| Epic 0 | Design System | Tokens, primitives, Tailwind config |
| Epic 1 | CMS Collections | Field structures, relationships, seed data |
| Epic 5 | Meilisearch | Index config, search UI, facets |
| Epic 17 | Auth | Aptify integration, session handling |
| Epic 18 | i18n | Locale routing, EN/FR switching |
| Epic 22 | Admin Foundation | Workflow transitions, RBAC, locking, dashboard widgets |
| Epics 25+26 | Page Builder | Template zones, toolbox DnD, props drawer |

## Exit Protocol

Every prompt includes `_exit-protocol.md` which defines:

- **Per-task:** 3-strike rule — fix twice, then mark `[!]` blocked
- **Per-epic:** `<promise>EPIC N COMPLETE</promise>` when ALL tasks pass
- **Blocked:** `<promise>EPIC N BLOCKED: [reason]</promise>` when stuck
- **Aborted:** `<promise>EPIC N ABORTED: [reason]</promise>` for hard failures
- **Hard stops:** unrecoverable DB/build failures, infinite loops, missing gate dependencies

## Files

| File | Purpose |
|------|---------|
| `_exit-protocol.md` | Shared stop/success conditions (appended to all prompts) |
| `epic-*.md` | Per-epic Ralph loop prompts |
| `README.md` | This file |
| `../ralph-logs/` | Output logs from headless runs |

## Permissions

The allowlist in `.claude/settings.local.json` covers all Ralph loop operations:
- File tools (Read/Write/Edit/Glob/Grep)
- npm/npx/node/python3
- Git (safe operations only — push/reset/clean are DENIED)
- Docker compose (for DB management)
- Standard Unix tools (ls, mkdir, grep, sed, etc.)
- Context7 MCP (documentation lookups)

Explicitly **denied:** `rm -rf`, `git push`, `git reset --hard`, `git clean`, `docker rm/rmi/system`
