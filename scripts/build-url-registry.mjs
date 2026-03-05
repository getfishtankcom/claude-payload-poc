/**
 * @description
 * Builds a URL registry from crawl data, organized for parallel agent processing.
 *
 * Outputs:
 * - data/url-registry.json — master registry with all URLs, page types, and batch assignments
 * - data/batches/ — individual batch files (batch-001.json, batch-002.json, etc.)
 *   each containing ~20 URLs that an agent can independently process
 * - .ai-reports/dogfood-frascanada/url-registry.md — human-readable URL inventory
 *
 * Each batch file contains everything an agent needs:
 * - The URLs to inspect
 * - The page type classification for each
 * - The extraction spec (what data to pull from each page)
 *
 * @dependencies
 * - None (pure data processing)
 *
 * @notes
 * - Batches are grouped by page type for coherent agent context
 * - Batch size of 20 balances agent context window vs. overhead
 * - Each URL gets a unique ID for tracking across agents
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const BATCHES_DIR = join(DATA_DIR, 'batches');
const REPORTS_DIR = join(ROOT, '.ai-reports', 'dogfood-frascanada');

// How many URLs per batch file for agent processing
const BATCH_SIZE = 20;

mkdirSync(BATCHES_DIR, { recursive: true });

/**
 * Main — reads crawl data, builds registry, splits into batches.
 */
function main() {
  console.log('=== Building URL Registry for Parallel Agent Processing ===\n');

  // Read source data
  const urls = JSON.parse(readFileSync(join(DATA_DIR, 'sitemap-urls.json'), 'utf-8'));
  const pageTypes = JSON.parse(readFileSync(join(DATA_DIR, 'page-types.json'), 'utf-8'));
  const inspections = JSON.parse(readFileSync(join(DATA_DIR, 'page-inspections.json'), 'utf-8'));

  // Build a lookup: URL -> page type
  const urlToType = {};
  for (const [type, data] of Object.entries(pageTypes)) {
    for (const url of data.urls) {
      urlToType[url] = type;
    }
  }

  // Track which URLs have already been inspected
  const inspectedUrls = new Set(inspections.filter(i => !i.error).map(i => i.url));

  // Build master registry entries with unique IDs
  const registry = urls.map((entry, idx) => ({
    id: `url-${String(idx + 1).padStart(4, '0')}`,
    url: entry.url,
    lang: entry.lang,
    pathPattern: entry.pathPattern,
    pageType: urlToType[entry.url] || 'unclassified',
    lastmod: entry.lastmod || null,
    priority: entry.priority || null,
    inspected: inspectedUrls.has(entry.url),
  }));

  // Write master registry
  const registryPath = join(DATA_DIR, 'url-registry.json');
  writeFileSync(registryPath, JSON.stringify(registry, null, 2));
  console.log(`Master registry: ${registryPath} (${registry.length} URLs)`);

  // Split into batches, grouped by page type for coherent processing
  // First, group by page type
  const byType = {};
  for (const entry of registry) {
    if (!byType[entry.pageType]) byType[entry.pageType] = [];
    byType[entry.pageType].push(entry);
  }

  // Create batches — keep page types together where possible
  const batches = [];
  let currentBatch = [];
  let currentBatchType = null;

  for (const [type, entries] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    for (const entry of entries) {
      // Start a new batch if current is full or page type changed and batch is >50% full
      if (currentBatch.length >= BATCH_SIZE ||
          (currentBatchType !== type && currentBatch.length > BATCH_SIZE / 2)) {
        if (currentBatch.length > 0) {
          batches.push(currentBatch);
        }
        currentBatch = [];
      }
      currentBatch.push(entry);
      currentBatchType = type;
    }
  }
  // Don't forget the last batch
  if (currentBatch.length > 0) {
    batches.push(currentBatch);
  }

  // Write individual batch files
  const batchManifest = [];
  for (let i = 0; i < batches.length; i++) {
    const batchNum = String(i + 1).padStart(3, '0');
    const batchFile = `batch-${batchNum}.json`;
    const batchPath = join(BATCHES_DIR, batchFile);

    // Summarize page types in this batch
    const typeCounts = {};
    for (const entry of batches[i]) {
      typeCounts[entry.pageType] = (typeCounts[entry.pageType] || 0) + 1;
    }

    const batchData = {
      batchId: `batch-${batchNum}`,
      batchNumber: i + 1,
      totalBatches: batches.length,
      urlCount: batches[i].length,
      pageTypes: typeCounts,
      alreadyInspected: batches[i].filter(e => e.inspected).length,
      needsInspection: batches[i].filter(e => !e.inspected).length,
      extractionSpec: {
        metadata: ['title', 'description', 'canonical', 'hreflang', 'og:*', 'twitter:*', 'generator'],
        components: ['classPrefixes', 'scAttributes', 'componentWrappers', 'sections'],
        structuredData: ['jsonLd', 'microdata'],
        navigation: ['breadcrumbs', 'activeNav', 'sidebarNav'],
        screenshot: { viewport: '1280x800', fullPage: true },
      },
      urls: batches[i],
    };

    writeFileSync(batchPath, JSON.stringify(batchData, null, 2));

    batchManifest.push({
      batchId: batchData.batchId,
      file: batchFile,
      urlCount: batchData.urlCount,
      pageTypes: typeCounts,
      needsInspection: batchData.needsInspection,
    });
  }

  // Write batch manifest (index of all batches)
  const manifestPath = join(DATA_DIR, 'batch-manifest.json');
  writeFileSync(manifestPath, JSON.stringify(batchManifest, null, 2));
  console.log(`Batch manifest: ${manifestPath} (${batches.length} batches)\n`);

  // Generate human-readable URL registry report
  let md = `# FRAS Canada — URL Registry\n\n`;
  md += `_Generated: ${new Date().toISOString().split('T')[0]}_\n\n`;
  md += `## Summary\n\n`;
  md += `| Metric | Value |\n|--------|-------|\n`;
  md += `| Total URLs | ${registry.length} |\n`;
  md += `| Already Inspected | ${inspectedUrls.size} |\n`;
  md += `| Needs Inspection | ${registry.length - inspectedUrls.size} |\n`;
  md += `| Total Batches | ${batches.length} |\n`;
  md += `| Batch Size | ~${BATCH_SIZE} URLs each |\n`;
  md += `| Page Types | ${Object.keys(byType).length} |\n\n`;

  md += `## Batches for Parallel Processing\n\n`;
  md += `Each batch file in \`data/batches/\` can be handed to an independent agent.\n\n`;
  md += `| Batch | URLs | Types | Needs Inspection |\n`;
  md += `|-------|------|-------|------------------|\n`;
  for (const b of batchManifest) {
    const types = Object.keys(b.pageTypes).join(', ');
    md += `| ${b.batchId} | ${b.urlCount} | ${types} | ${b.needsInspection} |\n`;
  }

  md += `\n## URL Inventory by Page Type\n\n`;
  for (const [type, entries] of Object.entries(byType).sort((a, b) => b[1].length - a[1].length)) {
    md += `### ${type} (${entries.length} URLs)\n\n`;
    const inspCount = entries.filter(e => e.inspected).length;
    md += `- Inspected: ${inspCount}/${entries.length}\n\n`;

    // Show all URLs
    md += `<details><summary>All URLs</summary>\n\n`;
    for (const entry of entries) {
      const marker = entry.inspected ? '[x]' : '[ ]';
      md += `- ${marker} \`${entry.id}\` ${entry.url}\n`;
    }
    md += `\n</details>\n\n`;
  }

  const reportPath = join(REPORTS_DIR, 'url-registry.md');
  writeFileSync(reportPath, md);
  console.log(`URL registry report: ${reportPath}`);

  // Print summary
  console.log(`\n=== Registry Built ===`);
  console.log(`Total URLs:           ${registry.length}`);
  console.log(`Already inspected:    ${inspectedUrls.size}`);
  console.log(`Needs inspection:     ${registry.length - inspectedUrls.size}`);
  console.log(`Batches created:      ${batches.length} (${BATCH_SIZE} URLs each)`);
  console.log(`\nTo process with parallel agents, assign each batch file from data/batches/`);
}

main();
