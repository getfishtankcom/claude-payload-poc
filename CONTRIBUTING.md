# Contributing — FRAS Canada

## Development model: trunk-based development

`main` is the trunk. It is **always deployable**. Every change ships through a short-lived branch + pull request.

### Branching

- **Branch off `main`.** Never branch off another feature branch.
- **Short-lived.** Aim for ≤ 3 days from branch to merge. If a slice is bigger than that, split it.
- **Naming convention:**
  - `feat/<short-description>` — new feature work
  - `fix/<short-description>` — bug fixes
  - `chore/<short-description>` — refactors, deps, tooling, infra
  - `docs/<short-description>` — documentation-only changes
  - For Ralph-loop work tied to a layer: `feat/admin-shell-v2/layer-N-<slug>` (the trailing slug helps two parallel worktrees coexist)

### Commits

- Use **conventional commits**: `<type>(<scope>): <subject>` — e.g., `feat(admin-shell): add EditFormProvider with autosave + undo`.
- One logical change per commit. If you find yourself writing "and" in the subject line, split it.
- All commits get the trailer `Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>` when AI-assisted.
- Never `--amend` published commits. Never push with `--no-verify`.

### Pull requests

- Open a PR as soon as the branch has one meaningful commit. Use the PR template.
- PR title = the commit message that will appear on `main` after squash-merge.
- Link the issue the PR closes (`Closes #123`) so the issue auto-closes on merge.
- Required checks (when CI exists): `tsc --noEmit`, `vitest run`, `npm run build`, `storybook build`, `playwright test` (e2e on critical paths).
- Default merge strategy: **squash + merge.** One issue → one branch → one squashed commit on `main`.

### Branch protection

The repo is on a free-tier private plan, so GitHub's branch protection API is unavailable. Trunk discipline is enforced by:
1. Convention (this document)
2. CI checks (when added)
3. PR review on anything touching shared infrastructure

If we move the repo to `getfishtankcom` org or upgrade to Pro, enable branch protection on `main` immediately:
- Require PR before merging
- Require at least 1 approving review
- Require status checks to pass
- Restrict force pushes
- Restrict deletions

### Pre-commit hooks

Husky + lint-staged is wired (see `.husky/`). On every commit:
- Prettier auto-formats staged files
- TypeScript runs against the staged change set

If a hook fails, **fix the underlying issue and create a new commit**. Never `--no-verify` to bypass.

### Issues

- Every meaningful change starts as a GitHub issue using one of the templates in `.github/ISSUE_TEMPLATE/`.
- Issues are labeled by type (`feat` / `fix` / `chore` / `docs`), by area (`admin-shell` / `frontend` / `cms` / `infra`), and by layer when relevant (`layer-0` … `layer-8`).
- Vertical-slice issues delivered by Ralph loops carry the `ralph` label so the loop runner can pick them up.

### Ralph loops

For autonomous work, see `.ai-reports/ralph-prompts/`. Each layer has a prompt; Ralph picks the next `[ ]` task in `MASTER_TODO*.md`, builds it, validates, and outputs `<promise>TASK N.X COMPLETE</promise>` when done.

When a Ralph loop completes a layer:
1. Open a PR for the branch
2. Self-review or request review
3. Squash-merge to `main`
4. Delete the branch

### Documentation

- All AI-generated reports, plans, and analysis live in `.ai-reports/`.
- Never modify `.env` files — only `.env.example`.
- Use Context7 MCP for documentation queries before web search.
- Always update `.ai-reports/AUDIT_LOG.md` after significant changes.

See `CLAUDE.md` for the full Claude Code working agreement and project conventions.
