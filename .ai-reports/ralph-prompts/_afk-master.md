# AFK Master Prompt — Admin Platform Layers 0–5

You are running an AFK Ralph loop. Work through admin platform layers sequentially. Each iteration, do the smallest amount of work that makes forward progress, then exit. The harness will feed this prompt back to you and you will see your prior work in the files and git history.

## Order of operations (every iteration)

1. **Find current position.** Read `.ai-reports/MASTER_TODO.md` and find the FIRST incomplete (`[ ]` or `[~]`) task in the lowest-numbered layer (0 → 5). That is your target task.
2. **Load the layer prompt.** Read `.ai-reports/ralph-prompts/layer-0N-*.md` matching the active layer. Treat its rules as authoritative for that layer.
3. **Read the project rules.** `CLAUDE.md` (project) overrides defaults. Especially: never modify `.env`, only `.env.example`. Update `.ai-reports/AUDIT_LOG.md` after significant changes.
4. **Invoke the right skill.** Per the layer prompt's "Skills to Invoke" section. For Payload work prefer `payload-super`. For UI work invoke `/ui`. For tests use `javascript-testing-patterns`.
5. **Mark task `[~]`** in MASTER_TODO.md before starting.
6. **Do the work.** Write/edit files. Run validation commands listed for that task.
7. **Validate.** Run the per-task validation block. If `npx tsc --noEmit` fails, fix it before proceeding.
8. **Mark task `[x]`** in MASTER_TODO.md only after validation passes.
9. **Commit.** `git commit -m "feat(layer-N): task N.M — <short description>"` — never `git push`, never `--no-verify`.
10. **Exit.** Done for this iteration.

## Three-strike rule (per task)

If the same task fails validation twice in a row, on the third attempt mark it `[!]` with a one-line reason in MASTER_TODO.md and move to the next task. Do not infinite-loop on a single task.

## Layer gates

Stop at gates and output the layer-completion promise. Do NOT cross a gate without human approval.

| Layer | Tasks | Gate |
|---|---|---|
| 0 — Foundation | 14 | GATE after all 14 tasks. Output `<promise>LAYER 0 COMPLETE</promise>` and stop. |
| 1 — Registry | 4 | Continue to Layer 2 automatically when complete. |
| 2 — Quick Wins | 6 | Continue to Layer 3 automatically. |
| 3 — Medium Lifts | 5 | Continue to Layer 4 automatically. |
| 4 — Big Builds | 4 | GATE after task 4.1, GATE after task 4.4. Output `<promise>LAYER 4 GATE: 4.1 COMPLETE</promise>` or `<promise>LAYER 4 COMPLETE</promise>` and stop. |
| 5 — Polish | 3 | GATE after each task. Output `<promise>LAYER 5 TASK 5.N COMPLETE</promise>` and stop. After 5.3, output `<promise>ALL LAYERS COMPLETE</promise>`. |

## Hard stops (output abort + stop)

Output `<promise>AFK ABORTED: <reason></promise>` and stop if any of these occur:
- Dev server cannot start after 3 fix attempts in a row.
- A dependency upgrade is irrecoverable (lockfile conflict, peer-dep deadlock).
- More than 5 structural TypeScript errors that aren't typos.
- Database connection cannot be recovered.
- The same error appears 3+ iterations in a row (you are looping).
- Destructive action required that exceeds auto-mode safety (e.g. dropping a prod DB, force-pushing).

## What NOT to do

- Do NOT skip reading MASTER_TODO.md at the start of each iteration.
- Do NOT mark tasks `[x]` before validation passes.
- Do NOT modify `.env` — only `.env.example`.
- Do NOT run `git push`, `git reset --hard`, `git clean -f`, or `--no-verify`.
- Do NOT cross a gate without an explicit `<promise>LAYER N COMPLETE</promise>` and stop.
- Do NOT install packages outside the layer prompt's listed installs without recording why in MASTER_TODO.md.
- Do NOT batch many tasks per iteration — one task per iteration is fine; smaller is better.

## End-state success

When all tasks across layers 0–5 are `[x]` AND every layer's validation gate passed:

1. Update `.ai-reports/AUDIT_LOG.md` with a final summary entry.
2. Output exactly: `<promise>ALL LAYERS COMPLETE</promise>`
