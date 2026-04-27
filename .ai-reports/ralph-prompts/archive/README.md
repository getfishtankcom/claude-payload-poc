# Archived Ralph Loop Prompts

These are the original epic-based prompts for the Custom Admin Panel (Epics 22–27).

They have been superseded by the layer-based prompts in the parent directory (`layer-00` through `layer-05`).

## Why Archived?

The admin panel work was originally planned as 6 sequential epics (22–27). After completing Epics 22–27, a second pass was planned to add incremental improvements. The layer-based approach reorganizes this second pass into a more logical progression:

- **Layer 0** covers hardening work that spans multiple existing epics (upgrade, refactor, tests)
- **Layer 1** expands the component registry started in Epic 25
- **Layer 2–3** adds features that enhance the work from Epics 22–27
- **Layer 4** builds on the page builder foundation from Epics 25–26
- **Layer 5** polishes the entire admin platform before production

## Original Epic Coverage

| Archived Prompt | Original Scope |
|----------------|---------------|
| `epic-22-admin-foundation.md` | Dashboard, sidebar nav, workflow states, locking, language switcher, RBAC |
| `epic-23-content-tree.md` | Content tree view, expand/collapse, gutter icons, context menu, DnD |
| `epic-24-media-library.md` | Media library view, folder tree, upload, grid/list, bulk ops, media picker |
| `epic-25-26-page-builder.md` | Page builder: template system, registry (31 components), canvas, DnD, props drawer |
| `epic-27-workbox.md` | Workbox: workflow dashboard, inline actions, rejection comments, bulk ops |

## Status

All 5 original epic prompts are complete — Epics 22–27 have been implemented. These files are kept for reference only.
