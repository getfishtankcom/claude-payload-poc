/**
 * @description
 * Extracts EN→FR URL slug mapping from page inspection hreflang data.
 * Builds a comprehensive mapping table of all section/board/path slugs.
 *
 * @notes
 * - Reads from data/page-inspections.json (hreflang pairs)
 * - Also reads data/sitemap-urls.json to find additional FR URLs
 * - Outputs JSON mapping and markdown report
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const REPORTS_DIR = join(ROOT, '.ai-reports', 'dogfood-frascanada');

// Read inspection data for hreflang pairs
const inspections = JSON.parse(readFileSync(join(DATA_DIR, 'page-inspections.json'), 'utf-8'));

// Collect all EN→FR URL pairs from hreflang
const pairs = [];
for (const insp of inspections) {
  if (insp.error) continue;
  const hreflang = insp.metadata?.hreflang;
  if (!hreflang || hreflang.length === 0) continue;

  const enUrl = hreflang.find(h => h.lang === 'x-default' || h.lang === 'en')?.href;
  const frUrl = hreflang.find(h => h.lang === 'fr')?.href;

  if (enUrl && frUrl) {
    pairs.push({ en: enUrl, fr: frUrl });
  }
}

console.log(`Found ${pairs.length} EN→FR URL pairs from hreflang\n`);

// Extract slug segments and build mapping
const segmentMap = new Map(); // EN segment → FR segment at each position

for (const { en, fr } of pairs) {
  try {
    const enPath = new URL(en).pathname.replace(/^\/en\//, '').replace(/\/$/, '');
    const frPath = new URL(fr).pathname.replace(/^\/fr\//, '').replace(/\/$/, '');

    const enSegs = enPath.split('/').filter(Boolean);
    const frSegs = frPath.split('/').filter(Boolean);

    // Map each segment position
    const maxLen = Math.min(enSegs.length, frSegs.length);
    for (let i = 0; i < maxLen; i++) {
      const enSeg = enSegs[i];
      const frSeg = frSegs[i];
      if (enSeg !== frSeg) {
        const key = `${i}:${enSeg}`;
        if (!segmentMap.has(key)) {
          segmentMap.set(key, { en: enSeg, fr: frSeg, position: i, count: 0, examples: [] });
        }
        const entry = segmentMap.get(key);
        entry.count++;
        if (entry.examples.length < 2) {
          entry.examples.push({ en: en, fr: fr });
        }
      }
    }
  } catch (e) {
    // skip malformed URLs
  }
}

// Deduplicate by EN slug (position-independent for common segments)
const slugMap = new Map();
for (const [, entry] of segmentMap) {
  const existing = slugMap.get(entry.en);
  if (!existing || entry.count > existing.count) {
    slugMap.set(entry.en, entry);
  }
}

// Sort by category
const boards = [];
const sections = [];
const paths = [];
const misc = [];

const KNOWN_BOARDS_EN = ['acsb', 'psab', 'aasb', 'cssb', 'aspe'];
const KNOWN_SECTIONS_EN = ['ifrsstandards', 'public-sector', 'nfpos', 'cass', 'sustainability',
  'pensions', 'csqc', 'other', 'public-sector-international'];
const KNOWN_COUNCILS_EN = ['rasoc', 'acsoc', 'aasoc'];

for (const [enSlug, entry] of slugMap) {
  if (KNOWN_BOARDS_EN.includes(enSlug)) boards.push(entry);
  else if (KNOWN_SECTIONS_EN.includes(enSlug)) sections.push(entry);
  else if (KNOWN_COUNCILS_EN.includes(enSlug)) misc.push(entry); // councils
  else if (entry.position === 0) misc.push(entry); // top-level
  else paths.push(entry); // sub-path segments
}

// Build output
const mapping = {
  boards: boards.map(e => ({ en: e.en, fr: e.fr, count: e.count })),
  sections: sections.map(e => ({ en: e.en, fr: e.fr, count: e.count })),
  councils: misc.filter(e => KNOWN_COUNCILS_EN.includes(e.en)).map(e => ({ en: e.en, fr: e.fr, count: e.count })),
  topLevel: misc.filter(e => !KNOWN_COUNCILS_EN.includes(e.en)).map(e => ({ en: e.en, fr: e.fr, count: e.count })),
  pathSegments: paths.map(e => ({ en: e.en, fr: e.fr, position: e.position, count: e.count })),
};

// Write JSON
writeFileSync(join(DATA_DIR, 'fr-slug-mapping.json'), JSON.stringify(mapping, null, 2));

// Generate markdown report
let md = `# FRAS Canada — EN→FR URL Slug Mapping\n\n`;
md += `**Source:** ${pairs.length} hreflang pairs from page inspections\n`;
md += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n`;

md += `## Boards (EN → FR)\n\n`;
md += `| EN Slug | FR Slug | Seen |\n|---------|---------|------|\n`;
for (const b of boards.sort((a, b) => a.en.localeCompare(b.en))) {
  md += `| ${b.en} | ${b.fr} | ${b.count}× |\n`;
}

md += `\n## Standards/Guidance Sections (EN → FR)\n\n`;
md += `| EN Slug | FR Slug | Seen |\n|---------|---------|------|\n`;
for (const s of sections.sort((a, b) => a.en.localeCompare(b.en))) {
  md += `| ${s.en} | ${s.fr} | ${s.count}× |\n`;
}

md += `\n## Oversight Councils (EN → FR)\n\n`;
md += `| EN Slug | FR Slug | Seen |\n|---------|---------|------|\n`;
for (const c of mapping.councils.sort((a, b) => a.en.localeCompare(b.en))) {
  md += `| ${c.en} | ${c.fr} | ${c.count}× |\n`;
}

md += `\n## Top-Level Pages (EN → FR)\n\n`;
md += `| EN Slug | FR Slug | Seen |\n|---------|---------|------|\n`;
for (const t of mapping.topLevel.sort((a, b) => a.en.localeCompare(b.en))) {
  md += `| ${t.en} | ${t.fr} | ${t.count}× |\n`;
}

md += `\n## Path Segments (EN → FR)\n\n`;
md += `These are sub-path segments that differ between EN and FR URLs.\n\n`;
md += `| EN Segment | FR Segment | Position | Seen |\n|------------|------------|----------|------|\n`;
for (const p of paths.sort((a, b) => a.en.localeCompare(b.en))) {
  md += `| ${p.en} | ${p.fr} | ${p.position} | ${p.count}× |\n`;
}

// Add full URL pair examples
md += `\n## Full URL Pair Examples\n\n`;
md += `First 20 hreflang pairs showing complete EN→FR URL mapping:\n\n`;
md += `| EN URL | FR URL |\n|--------|--------|\n`;
for (const pair of pairs.slice(0, 20)) {
  const enPath = new URL(pair.en).pathname;
  const frPath = new URL(pair.fr).pathname;
  md += `| ${enPath} | ${frPath} |\n`;
}

writeFileSync(join(REPORTS_DIR, 'fr-slug-mapping.md'), md);

console.log('=== FR Slug Mapping Complete ===');
console.log(`Boards: ${boards.length}`);
console.log(`Sections: ${sections.length}`);
console.log(`Councils: ${mapping.councils.length}`);
console.log(`Top-level: ${mapping.topLevel.length}`);
console.log(`Path segments: ${paths.length}`);
console.log(`\nJSON: ${join(DATA_DIR, 'fr-slug-mapping.json')}`);
console.log(`Report: ${join(REPORTS_DIR, 'fr-slug-mapping.md')}`);
