#!/usr/bin/env node
// Appends the vertical-slice issues checklist to parent epic #1 in cg-fishtank/claude-payload-poc.
// Reads .ai-reports/admin-shell-v2-issue-map.json + the original PRD body and produces a
// new body with a Vertical-slice issues section grouped by layer.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO = 'cg-fishtank/claude-payload-poc';
const PARENT = 1;
const MAP = JSON.parse(readFileSync('.ai-reports/admin-shell-v2-issue-map.json', 'utf8'));

const LAYER_GROUPS = [
  {
    layer: 0,
    title: 'Layer 0 — Shell foundations',
    keys: [
      'L0-brand-tokens',
      'L0-admin-shell',
      'L0-routes',
      'L0-tree-spine',
      'L0-action-bar',
      'L0-language-switcher',
      'L0-tailwind-source',
      'L0-auth-bridge',
    ],
  },
  {
    layer: 1,
    title: 'Layer 1 — Field renderer primitives',
    keys: [
      'L1-form-provider',
      'L1-text-field',
      'L1-number-field',
      'L1-select-field',
      'L1-date-field',
      'L1-checkbox-radio-toggle',
      'L1-relationship-field',
      'L1-upload-field',
      'L1-rich-text-field',
      'L1-array-field',
      'L1-blocks-field',
      'L1-join-field',
      'L1-layout-primitives',
      'L1-localized-field-wrapper',
      'L1-section-chrome',
    ],
  },
  {
    layer: 2,
    title: 'Layer 2 — Move existing custom views into shell',
    keys: ['L2-migrate-views'],
  },
  {
    layer: 3,
    title: 'Layer 3 — Native Pages edit view (kills iframe)',
    keys: ['L3-pages-edit'],
  },
  {
    layer: 4,
    title: 'Layer 4 — Native edit views, top 4 collections',
    keys: ['L4-news-edit', 'L4-projects-edit', 'L4-boards-edit', 'L4-docs-edit'],
  },
  {
    layer: 5,
    title: 'Layer 5 — List views',
    keys: [
      'L5-data-table',
      'L5-pages-list',
      'L5-news-list',
      'L5-projects-list',
      'L5-events-list',
      'L5-generic-mounts',
    ],
  },
  {
    layer: 6,
    title: 'Layer 6 — Remaining edit views + globals',
    keys: ['L6-remaining-collections', 'L6-globals'],
  },
  {
    layer: 7,
    title: 'Layer 7 — Branded auth pages',
    keys: ['L7-login', 'L7-forgot', 'L7-reset', 'L7-account'],
  },
  {
    layer: 8,
    title: 'Layer 8 — Cutover',
    keys: ['L8-payload-backdoor', 'L8-retire-cms', 'L8-final-cleanup'],
  },
];

const checklist = LAYER_GROUPS.map((g) => {
  const items = g.keys
    .map((k) => `- [ ] #${MAP[k]}`)
    .join('\n');
  return `### ${g.title}\n\n${items}`;
}).join('\n\n');

const prdBody = readFileSync('.ai-reports/PRD-admin-shell-v2.md', 'utf8');

const newBody = `${prdBody}

---

## Vertical-slice issues (auto-generated)

44 issues filed via /prd-to-issues, grouped by layer. Each issue carries \`area:admin-shell\`, \`ralph\`, layer label (\`layer-0\` … \`layer-8\`), and type label (\`feat\` or \`chore\`). Ralph loops can pick any unblocked \`[ ]\` issue.

${checklist}

---

## Issue map

See \`.ai-reports/admin-shell-v2-issue-map.json\` for the key → issue-number map used by the create + fix-bodies scripts.
`;

const tmpfile = join(tmpdir(), `parent-epic-body-${Date.now()}.md`);
writeFileSync(tmpfile, newBody);

try {
  execSync(`gh issue edit ${PARENT} --repo ${REPO} --body-file ${tmpfile}`, {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  console.log(`✓ Parent epic #${PARENT} updated with ${Object.keys(MAP).length}-item checklist.`);
} finally {
  try { unlinkSync(tmpfile); } catch {}
}
