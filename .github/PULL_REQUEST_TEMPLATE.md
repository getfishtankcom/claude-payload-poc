## Summary

<!-- 1-3 bullets. What changed and why. -->

## Linked issue

Closes #<!-- issue number -->

## Layer / scope

<!-- e.g., admin-shell-v2 / Layer 0 / Task 0.4 — tree-as-permanent-left-rail -->

## Test plan

- [ ] `tsc --noEmit` clean
- [ ] `vitest run` passes
- [ ] `npm run build` clean
- [ ] `storybook build` clean (if components changed)
- [ ] Manual check in browser at `/admin/...`
- [ ] axe-core check on affected admin pages (if UI changed)

## Screenshots / video

<!-- For UI changes. Drag-and-drop. -->

## Checklist

- [ ] Branch is named per `CONTRIBUTING.md` (`feat/`, `fix/`, `chore/`, `docs/`)
- [ ] Commits follow conventional commits format
- [ ] No `.env` modifications (only `.env.example`)
- [ ] `.ai-reports/AUDIT_LOG.md` updated if significant
- [ ] No `--no-verify` used to bypass hooks

🤖 Generated with [Claude Code](https://claude.com/claude-code)
