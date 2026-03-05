/**
 * @description
 * Step 2: Page Type Classifier — reads sitemap-urls.json and groups URLs
 * into distinct page type categories based on URL path patterns.
 *
 * Classification strategy:
 * - Parse URL paths into segments after the language prefix
 * - Identify board-specific pages (AcSB, PSAB, AASB, CSSB, ASPE)
 * - Detect common patterns: landing, listing, detail, profile, media
 * - Select 2-3 sample URLs per page type for deep inspection
 *
 * @dependencies
 * - None (pure data processing)
 *
 * @notes
 * - Reads from data/sitemap-urls.json
 * - Outputs data/page-types.json
 */

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');

/** Known board slugs used across the site (EN + FR) */
const BOARDS = ['acsb', 'psab', 'aasb', 'cssb', 'aspe',
  /* FR */ 'cnc', 'ccsp', 'cnac', 'ccnid', 'ncecf'];

/**
 * Standards/guidance sections — these follow the same projects/documents/resources
 * sub-page pattern as boards but live under different top-level slugs.
 * Includes both EN and FR slugs.
 */
const SECTIONS = [
  'ifrsstandards', 'public-sector', 'nfpos', 'cass', 'sustainability',
  'pensions', 'csqc', 'other', 'public-sector-international',
  /* FR */ 'normes-ifrs', 'secteur-public', 'ncosblsp', 'nca', 'durabilite',
  'ncrr', 'nccq', 'autres', 'activites-ipsasb',
];

/**
 * Oversight councils — have about, meetings, news, committees, volunteers sub-pages.
 * Note: "rasoc" URL has a typo ("committes" instead of "committees") on the live site.
 * Includes both EN and FR slugs.
 */
const COUNCILS = ['rasoc', 'acsoc', 'aasoc',
  /* FR */ 'csnic', 'csnc', 'csnac'];

/**
 * FR equivalents of common second-level path segments.
 * Used to normalize FR paths for classification.
 */
const FR_SEGMENTS = {
  'projets': 'projects',
  'documents': 'documents',
  'ressources': 'resources',
  'a-propos': 'about',
  'membres': 'members',
  'reunions-et-evenements': 'meetings-and-events',
  'nouvelles': 'news-listings',
  'comites': 'committees',
  'benevoles': 'volunteer-opportunities',
  'dates-entree-en-vigueur': 'effective-dates',
  'nous-joindre': 'contact-us',
};

/**
 * Classify a URL into a page type based on its path structure.
 * Returns a descriptive type string used for grouping.
 *
 * @param {string} url - Full URL
 * @returns {string} Page type classification
 */
function classifyUrl(url) {
  let path;
  try {
    path = new URL(url).pathname.toLowerCase();
  } catch {
    return 'unknown';
  }

  // Remove language prefix to normalize
  const stripped = path.replace(/^\/(en|fr)\//, '/').replace(/\/$/, '');
  const segments = stripped.split('/').filter(Boolean);

  // Sitecore redirect stubs — not real pages
  if (stripped.includes('/~/link.aspx')) {
    return 'sitecore-redirect';
  }

  // Media/asset files
  if (path.includes('/-/media/') || path.match(/\.(ashx|pdf|jpg|png|gif|svg)$/i)) {
    return 'media-asset';
  }

  // Root / homepage
  if (segments.length === 0 || path === '/en' || path === '/fr') {
    return 'homepage';
  }

  const first = segments[0];
  // Normalize FR second-level segments to EN equivalents for classification
  const second = FR_SEGMENTS[segments[1]] || segments[1];
  const third = FR_SEGMENTS[segments[2]] || segments[2];

  // Board pages — check if first segment is a known board
  if (BOARDS.includes(first)) {
    if (!second) return 'board-landing';
    if (second === 'about' && third === 'members') return 'board-member-profile';
    if (second === 'about') return 'board-about';
    if (second === 'projects' && third) return 'board-project-detail';
    if (second === 'projects') return 'board-projects-listing';
    if (second === 'meetings-and-events' && third) return 'board-meeting-detail';
    if (second === 'meetings-and-events') return 'board-meetings-listing';
    if (second === 'standards' || second === 'guidance') return 'board-standards';
    if (second === 'resources') return 'board-resources';
    return 'board-subpage';
  }

  // News and media (FR: nouvelles)
  if (first === 'news-listings' || first === 'news' || first === 'media' || first === 'nouvelles') {
    if (second) return 'news-detail';
    return 'news-listing';
  }

  // Consultation and comment letters
  if (first === 'consultations' || first === 'comment-letters') {
    if (second) return 'consultation-detail';
    return 'consultation-listing';
  }

  // Search
  if (first === 'search') return 'search';

  // Contact (FR: nous-joindre)
  if (first === 'contact' || first === 'contact-us' || first === 'nous-joindre') return 'contact';

  // About section (EN: about, FR: a-propos)
  if (first === 'about' || first === 'a-propos') {
    if (second === 'oversight-councils' || second === 'due-process') return 'governance';
    return 'about';
  }

  // Standards/guidance sections — projects, documents, resources sub-pages
  if (SECTIONS.includes(first)) {
    if (!second) return 'section-landing';
    if (second === 'projects' && third) return 'section-project-detail';
    if (second === 'projects') return 'section-projects-listing';
    if (second === 'documents' && third) return 'section-document-detail';
    if (second === 'documents') return 'section-documents-listing';
    if (second === 'resources' && third) return 'section-resource-detail';
    if (second === 'resources') return 'section-resources-listing';
    return 'section-subpage';
  }

  // Oversight councils — about, meetings, news, committees, volunteers
  if (COUNCILS.includes(first)) {
    if (!second) return 'council-landing';
    if (second === 'about' && third === 'members' && segments[3]) return 'council-member-profile';
    if (second === 'about' && third === 'members') return 'council-members-listing';
    if (second === 'about') return 'council-about';
    if (second === 'meetings-and-events' && third) return 'council-meeting-detail';
    if (second === 'meetings-and-events') return 'council-meetings-listing';
    if (second === 'news-listings' && third) return 'council-news-detail';
    if (second === 'news-listings') return 'council-news-listing';
    // "committes" is a typo on the live site but still a valid route
    if (second === 'committees' || second === 'committes') return 'council-committee';
    if (second === 'volunteer-opportunities') return 'council-volunteer';
    return 'council-subpage';
  }

  // Multi-segment pages that don't match other patterns
  if (segments.length >= 3) return 'deep-content';

  // Default: static/general content page
  return 'static-page';
}

/**
 * Main — reads URL data, classifies, groups, selects samples, outputs results.
 */
function main() {
  console.log('=== FRAS Canada Page Type Classifier ===\n');

  // Read sitemap URLs
  const inputPath = join(DATA_DIR, 'sitemap-urls.json');
  let urls;
  try {
    urls = JSON.parse(readFileSync(inputPath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${inputPath}: ${err.message}`);
    console.error('Run crawl-sitemap.mjs first.');
    process.exit(1);
  }

  console.log(`Loaded ${urls.length} URLs from sitemap data\n`);

  // Classify each URL
  const classified = urls.map((entry) => ({
    ...entry,
    pageType: classifyUrl(entry.url),
  }));

  // Group by page type
  const groups = {};
  for (const entry of classified) {
    if (!groups[entry.pageType]) {
      groups[entry.pageType] = [];
    }
    groups[entry.pageType].push(entry);
  }

  // Build output with sample selection
  const pageTypes = {};
  for (const [type, entries] of Object.entries(groups)) {
    // Select up to 3 EN samples, preferring variety in path depth
    const enEntries = entries.filter((e) => e.lang === 'en');
    const samplePool = enEntries.length > 0 ? enEntries : entries;

    // Pick samples with diverse paths
    const samples = [];
    const seenPatterns = new Set();
    for (const entry of samplePool) {
      const pattern = entry.pathPattern;
      if (!seenPatterns.has(pattern) && samples.length < 3) {
        seenPatterns.add(pattern);
        samples.push(entry.url);
      }
    }
    // Fill remaining sample slots if needed
    if (samples.length < 3) {
      for (const entry of samplePool) {
        if (!samples.includes(entry.url) && samples.length < 3) {
          samples.push(entry.url);
        }
      }
    }

    pageTypes[type] = {
      count: entries.length,
      enCount: entries.filter((e) => e.lang === 'en').length,
      frCount: entries.filter((e) => e.lang === 'fr').length,
      samples,
      urls: entries.map((e) => e.url),
    };
  }

  // Write output
  const outputPath = join(DATA_DIR, 'page-types.json');
  writeFileSync(outputPath, JSON.stringify(pageTypes, null, 2));

  // Print summary
  console.log('Page Type Summary:');
  console.log('─'.repeat(60));
  const sorted = Object.entries(pageTypes).sort((a, b) => b[1].count - a[1].count);
  for (const [type, data] of sorted) {
    console.log(`  ${type.padEnd(30)} ${String(data.count).padStart(5)} URLs  (EN: ${data.enCount}, FR: ${data.frCount})`);
  }
  console.log('─'.repeat(60));
  console.log(`  Total page types: ${Object.keys(pageTypes).length}`);
  console.log(`  Total URLs: ${classified.length}`);
  console.log(`\nOutput: ${outputPath}`);
}

main();
