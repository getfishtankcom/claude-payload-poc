# Skill: Self-Test

Run Playwright-based self-tests for Ralph Wiggum loop verification.

## Usage

```
/self-test <epic-id>
```

Example: `/self-test epic-04`

## What It Does

Runs automated visual and structural verification against the dev server:

1. Starts the dev server if not already running
2. Loads the per-epic config from `scripts/self-test-configs/<epic>.json`
3. For each page defined in the config:
   - Takes screenshots at 3 breakpoints (390px, 768px, 1440px)
   - Runs structural DOM checks (selector exists, text contains)
   - Captures console errors
   - Runs interaction tests (click, keyboard, focus)
   - Optionally runs axe-core a11y checks
4. Generates a report to `.ai-reports/screenshots/ralph-verification/<epic>/report.md`
5. Returns exit code 0 (pass/warn) or 1 (structural failure)

## Options

- `--port <number>` — custom dev server port (default: 3000)
- `--no-server` — skip server lifecycle (use if dev server is already running)

## When to Use

- After completing all tasks in a UI-building epic (part of exit protocol)
- To verify visual rendering at different breakpoints
- To check that components have correct DOM structure
- Before outputting `<promise>EPIC N COMPLETE</promise>`

## Epic Config Files

Located in `scripts/self-test-configs/`. Epics without configs (0, 1, 11) are non-UI and skip self-testing.

## Severity Levels

- **block** — structural failure, must be fixed (causes exit code 1)
- **warn** — visual warning, logged for human review (exit code 0)

## Implementation

The test runner lives at `scripts/self-test.mjs` and uses the `playwright` package (already in devDeps).
