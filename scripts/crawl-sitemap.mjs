/**
 * @description
 * Step 1: Sitemap Harvester — crawls frascanada.ca to collect all site URLs.
 *
 * Strategy:
 * 1. Try fetching /sitemap.xml via Playwright (browser context bypasses 403)
 * 2. Parse XML for <url><loc> entries, handle nested <sitemap> sub-sitemaps
 * 3. If sitemap is blocked/empty, fall back to recursive link discovery from /en homepage
 * 4. Deduplicate, tag each URL with language (en/fr) and path pattern
 *
 * @dependencies
 * - playwright: Browser automation for bypassing bot detection
 *
 * @notes
 * - EN-only crawl for initial inventory (FR uses same templates)
 * - Rate-limited with 2-3s delays between page loads
 * - Outputs data/sitemap-urls.json
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const BASE_URL = 'https://www.frascanada.ca';

// Ensure data directory exists
mkdirSync(DATA_DIR, { recursive: true });

/**
 * Delay helper — pauses execution for a random interval to avoid WAF triggers.
 * @param {number} min - Minimum delay in ms
 * @param {number} max - Maximum delay in ms
 */
function delay(min = 2000, max = 3000) {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Detect the language of a URL based on its path.
 * @param {string} url - Full URL
 * @returns {'en' | 'fr' | 'unknown'}
 */
function detectLang(url) {
  try {
    const path = new URL(url).pathname.toLowerCase();
    if (path.startsWith('/en')) return 'en';
    if (path.startsWith('/fr')) return 'fr';
    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Extract the path pattern from a URL (first 2-3 segments after language prefix).
 * Used for grouping URLs by page type later.
 * @param {string} url - Full URL
 * @returns {string} Path pattern like "/en/acsb/projects"
 */
function extractPathPattern(url) {
  try {
    const path = new URL(url).pathname;
    const segments = path.split('/').filter(Boolean);
    // Return first 3 segments max for pattern grouping
    return '/' + segments.slice(0, 3).join('/');
  } catch {
    return '/unknown';
  }
}

/**
 * Parse XML content and extract URL entries.
 * Handles both sitemap index files (with <sitemap> entries) and
 * regular sitemaps (with <url> entries).
 *
 * @param {string} xmlContent - Raw XML string
 * @returns {{ urls: Array<{loc: string, lastmod?: string, priority?: string}>, subSitemaps: string[] }}
 */
function parseXml(xmlContent) {
  const urls = [];
  const subSitemaps = [];

  // Extract sub-sitemaps from sitemap index
  const sitemapMatches = xmlContent.matchAll(/<sitemap>\s*<loc>([^<]+)<\/loc>/g);
  for (const match of sitemapMatches) {
    subSitemaps.push(match[1].trim());
  }

  // Extract URL entries
  const urlBlockRegex = /<url>([\s\S]*?)<\/url>/g;
  let urlMatch;
  while ((urlMatch = urlBlockRegex.exec(xmlContent)) !== null) {
    const block = urlMatch[1];
    const locMatch = block.match(/<loc>([^<]+)<\/loc>/);
    const lastmodMatch = block.match(/<lastmod>([^<]+)<\/lastmod>/);
    const priorityMatch = block.match(/<priority>([^<]+)<\/priority>/);

    if (locMatch) {
      urls.push({
        loc: locMatch[1].trim(),
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : undefined,
        priority: priorityMatch ? priorityMatch[1].trim() : undefined,
      });
    }
  }

  return { urls, subSitemaps };
}

/**
 * Attempt to fetch and parse the sitemap.xml using Playwright.
 * @param {import('playwright').Page} page
 * @returns {Promise<Array<{url: string, lastmod?: string, priority?: string, lang: string, pathPattern: string}>>}
 */
async function fetchSitemap(page) {
  console.log('[sitemap] Navigating to /sitemap.xml ...');
  const allUrls = [];
  const visited = new Set();

  // Queue of sitemap URLs to process
  const queue = [`${BASE_URL}/sitemap.xml`];

  while (queue.length > 0) {
    const sitemapUrl = queue.shift();
    if (visited.has(sitemapUrl)) continue;
    visited.add(sitemapUrl);

    console.log(`[sitemap] Fetching: ${sitemapUrl}`);
    try {
      const response = await page.goto(sitemapUrl, {
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      if (!response || response.status() >= 400) {
        console.log(`[sitemap] Got status ${response?.status()} for ${sitemapUrl}`);
        continue;
      }

      // Get the page content — Playwright renders XML as HTML, so we need the raw text
      const content = await page.evaluate(() => {
        // Try to get raw XML source from the page
        const serializer = new XMLSerializer();
        return serializer.serializeToString(document);
      });

      const { urls, subSitemaps } = parseXml(content);
      console.log(`[sitemap] Found ${urls.length} URLs, ${subSitemaps.length} sub-sitemaps in ${sitemapUrl}`);

      for (const entry of urls) {
        allUrls.push({
          url: entry.loc,
          lastmod: entry.lastmod,
          priority: entry.priority,
          lang: detectLang(entry.loc),
          pathPattern: extractPathPattern(entry.loc),
        });
      }

      // Add sub-sitemaps to the queue
      for (const sub of subSitemaps) {
        queue.push(sub);
      }

      if (queue.length > 0) await delay(1000, 2000);
    } catch (err) {
      console.log(`[sitemap] Error fetching ${sitemapUrl}: ${err.message}`);
    }
  }

  return allUrls;
}

/**
 * Fallback: Discover URLs by crawling the site's navigation links.
 * Starts from the EN homepage and follows internal links up to a max depth.
 *
 * @param {import('playwright').Page} page
 * @param {number} maxPages - Maximum number of pages to visit
 * @returns {Promise<Array<{url: string, lang: string, pathPattern: string}>>}
 */
async function discoverLinks(page, maxPages = 2000) {
  console.log('[fallback] Starting link discovery from homepage...');
  const discovered = new Map(); // url -> entry
  const queue = [`${BASE_URL}/en`];
  const visited = new Set();
  let pagesVisited = 0;

  // First, try to extract all nav links from the homepage
  console.log('[fallback] Navigating to /en to extract navigation...');
  await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle', timeout: 30000 });
  await delay();

  // Extract all internal links from the page (includes hreflang for FR mapping)
  const extractLinks = async () => {
    return page.evaluate((baseUrl) => {
      const links = [];
      // Standard anchor links
      document.querySelectorAll('a[href]').forEach((a) => {
        const href = a.href;
        if (href.startsWith(baseUrl) && !href.includes('#') && !href.match(/\.(pdf|jpg|png|gif|svg|css|js|ashx|zip|doc|docx|xls|xlsx)(\?|$)/i)) {
          links.push(href.split('?')[0]);
        }
      });
      // Hreflang links — captures FR counterpart URLs
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
        const href = link.href;
        if (href.startsWith(baseUrl)) {
          links.push(href.split('?')[0]);
        }
      });
      return [...new Set(links)];
    }, BASE_URL);
  };

  // Get initial links from homepage
  const initialLinks = await extractLinks();
  console.log(`[fallback] Found ${initialLinks.length} links on homepage`);
  for (const link of initialLinks) {
    if (!discovered.has(link)) {
      queue.push(link);
    }
  }

  // BFS through the site, but focus on EN pages only
  while (queue.length > 0 && pagesVisited < maxPages) {
    const url = queue.shift();
    const normalizedUrl = url.replace(/\/$/, ''); // Strip trailing slash

    if (visited.has(normalizedUrl)) continue;
    // Only crawl EN pages for initial inventory
    if (!normalizedUrl.startsWith(`${BASE_URL}/en`)) {
      // Still record FR pages we find, just don't crawl them
      if (normalizedUrl.startsWith(`${BASE_URL}/fr`) && !discovered.has(normalizedUrl)) {
        discovered.set(normalizedUrl, {
          url: normalizedUrl,
          lang: 'fr',
          pathPattern: extractPathPattern(normalizedUrl),
        });
      }
      continue;
    }

    visited.add(normalizedUrl);
    pagesVisited++;

    if (pagesVisited % 10 === 0) {
      console.log(`[fallback] Visited ${pagesVisited} pages, queue: ${queue.length}, discovered: ${discovered.size}`);
    }

    // Record this URL
    discovered.set(normalizedUrl, {
      url: normalizedUrl,
      lang: detectLang(normalizedUrl),
      pathPattern: extractPathPattern(normalizedUrl),
    });

    try {
      await page.goto(normalizedUrl, { waitUntil: 'networkidle', timeout: 20000 });
      const links = await extractLinks();
      for (const link of links) {
        const norm = link.replace(/\/$/, '');
        if (!visited.has(norm) && !discovered.has(norm)) {
          queue.push(norm);
          // Pre-register so we don't add duplicates to queue
          discovered.set(norm, {
            url: norm,
            lang: detectLang(norm),
            pathPattern: extractPathPattern(norm),
          });
        }
      }
      await delay();
    } catch (err) {
      console.log(`[fallback] Error visiting ${normalizedUrl}: ${err.message}`);
    }
  }

  return [...discovered.values()];
}

/**
 * Main execution — orchestrates sitemap fetch with fallback to link discovery.
 */
async function main() {
  console.log('=== FRAS Canada Sitemap Harvester ===\n');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox'],
  });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  let urls = [];

  try {
    // Step 1: Try sitemap.xml
    urls = await fetchSitemap(page);

    // Step 2: If sitemap yielded too few results, fall back to link discovery
    if (urls.length < 20) {
      console.log(`\n[sitemap] Only found ${urls.length} URLs from sitemap — falling back to link discovery\n`);
      const discoveredUrls = await discoverLinks(page, 2000);
      // Merge: keep sitemap data where available, add discovered URLs
      const urlMap = new Map(urls.map((u) => [u.url.replace(/\/$/, ''), u]));
      for (const entry of discoveredUrls) {
        const key = entry.url.replace(/\/$/, '');
        if (!urlMap.has(key)) {
          urlMap.set(key, entry);
        }
      }
      urls = [...urlMap.values()];
    }
  } finally {
    await browser.close();
  }

  // Deduplicate by normalized URL
  const seen = new Set();
  const deduped = [];
  for (const entry of urls) {
    const key = entry.url.replace(/\/$/, '').toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      deduped.push(entry);
    }
  }

  // Sort by URL for stable output
  deduped.sort((a, b) => a.url.localeCompare(b.url));

  // Write output
  const outputPath = join(DATA_DIR, 'sitemap-urls.json');
  writeFileSync(outputPath, JSON.stringify(deduped, null, 2));

  // Print summary
  const enCount = deduped.filter((u) => u.lang === 'en').length;
  const frCount = deduped.filter((u) => u.lang === 'fr').length;
  const otherCount = deduped.filter((u) => u.lang === 'unknown').length;
  console.log(`\n=== Sitemap Harvest Complete ===`);
  console.log(`Total URLs: ${deduped.length}`);
  console.log(`  EN: ${enCount}`);
  console.log(`  FR: ${frCount}`);
  console.log(`  Other: ${otherCount}`);
  console.log(`Output: ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
