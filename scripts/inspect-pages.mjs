/**
 * @description
 * Step 3: Page Inspector — deep inspection of sample pages using Playwright.
 *
 * Based on actual DOM analysis of frascanada.ca, the site uses:
 * - Sitecore CMS with ASP.NET WebForms IDs (maincontent_N_xxx) — NOT data-sc-* attributes
 * - A shared page scaffold: #breadcrumb-container, #second-title-container,
 *   #second-navigation-container, #main-title-container
 * - Content-zone wrappers: .purple-info-container, .new-meetings-news-container,
 *   .rte-wrapper, #biography-container, .detail-content, .contactus-form, etc.
 * - Bootstrap 3 grid (col-sm-*, col-xs-*, col-md-*)
 * - OneTrust cookie consent overlay (ot-* classes — noise, filtered out)
 *
 * For each page this script extracts:
 * 1. Metadata (title, description, OG, canonical, hreflang)
 * 2. Page scaffold — which shared sections are present and their content
 * 3. Content zone — the actual unique content structure below the scaffold
 * 4. Heading hierarchy — full H1-H6 tree (key for understanding content structure)
 * 5. Sub-navigation tabs — the second-navigation links
 * 6. Breadcrumb path
 * 7. Sitecore element IDs — ASP.NET control IDs revealing CMS field names
 * 8. Content-specific CSS classes — filtering out Bootstrap/OneTrust noise
 * 9. Screenshot
 *
 * @dependencies
 * - playwright: Browser automation
 *
 * @notes
 * - Rate-limited with 2-3s delays between pages
 * - Screenshots saved to .ai-reports/dogfood-frascanada/screenshots/{page-type}/
 * - Outputs data/page-inspections.json
 */

import { chromium } from 'playwright';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const SCREENSHOTS_DIR = join(ROOT, '.ai-reports', 'dogfood-frascanada', 'screenshots');

/**
 * Delay helper for rate limiting.
 */
function delay(min = 2000, max = 3000) {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Sanitize a string for use as a filename.
 */
function sanitizeFilename(str) {
  return str.replace(/[^a-zA-Z0-9_-]/g, '_').replace(/_+/g, '_').substring(0, 80);
}

/**
 * Extract metadata — title, description, OG tags, canonical, hreflang, all meta tags.
 */
async function extractMetadata(page) {
  return page.evaluate(() => {
    const getMeta = (name) => {
      const el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      return el ? el.getAttribute('content') : null;
    };

    const hreflangLinks = [];
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
      hreflangLinks.push({
        lang: link.getAttribute('hreflang'),
        href: link.getAttribute('href'),
      });
    });

    const allMeta = [];
    document.querySelectorAll('meta').forEach((meta) => {
      const name = meta.getAttribute('name') || meta.getAttribute('property') || meta.getAttribute('http-equiv');
      const content = meta.getAttribute('content');
      if (name && content) allMeta.push({ name, content });
    });

    return {
      title: document.title,
      description: getMeta('description'),
      canonical: document.querySelector('link[rel="canonical"]')?.href || null,
      hreflang: hreflangLinks,
      og: {
        title: getMeta('og:title'),
        description: getMeta('og:description'),
        image: getMeta('og:image'),
        type: getMeta('og:type'),
        url: getMeta('og:url'),
      },
      twitter: {
        card: getMeta('twitter:card'),
        title: getMeta('twitter:title'),
        description: getMeta('twitter:description'),
        image: getMeta('twitter:image'),
      },
      generator: getMeta('generator'),
      allMeta,
    };
  });
}

/**
 * Extract the page scaffold — the shared structural sections that appear on every page.
 * Returns which scaffold sections are present and their text content.
 */
async function extractScaffold(page) {
  return page.evaluate(() => {
    const scaffold = {};

    // Breadcrumb container
    const bc = document.querySelector('#breadcrumb-container');
    if (bc) {
      const links = [...bc.querySelectorAll('a')].map(a => ({
        text: a.textContent.trim(),
        href: a.href,
      }));
      const lastSpan = bc.querySelector('span:last-child, li:last-child');
      scaffold.breadcrumbs = {
        present: true,
        path: links,
        currentPage: lastSpan ? lastSpan.textContent.trim() : null,
      };
    } else {
      scaffold.breadcrumbs = { present: false };
    }

    // Second title — the board/section name shown above the sub-nav
    const secondTitle = document.querySelector('#second-title-container');
    if (secondTitle) {
      const titleEl = secondTitle.querySelector('#maincontent_1_sectionTitle, .h2, h2');
      scaffold.sectionTitle = {
        present: true,
        text: titleEl ? titleEl.textContent.trim() : secondTitle.textContent.trim().substring(0, 100),
      };
    } else {
      scaffold.sectionTitle = { present: false };
    }

    // Second navigation — the sub-nav tabs (About, Committees, Projects, etc.)
    const secondNav = document.querySelector('#second-navigation-container');
    if (secondNav) {
      const navContent = secondNav.querySelector('.second-navigation-content');
      const links = [...(navContent || secondNav).querySelectorAll('a')].map(a => ({
        text: a.textContent.trim(),
        href: a.href,
        isActive: a.classList.contains('active') || a.parentElement?.classList.contains('active'),
      }));
      scaffold.subNavigation = {
        present: true,
        tabs: links,
        activeTab: links.find(l => l.isActive)?.text || null,
      };
    } else {
      scaffold.subNavigation = { present: false };
    }

    // Main title container — the H1 area
    const mainTitle = document.querySelector('#main-title-container');
    if (mainTitle) {
      const h1 = mainTitle.querySelector('h1') || document.querySelector('h1');
      scaffold.pageTitle = {
        present: true,
        text: h1 ? h1.textContent.trim() : mainTitle.textContent.trim().substring(0, 100),
      };
    } else {
      // Fallback — grab H1 from anywhere
      const h1 = document.querySelector('h1');
      scaffold.pageTitle = {
        present: !!h1,
        text: h1 ? h1.textContent.trim() : null,
      };
    }

    return scaffold;
  });
}

/**
 * Extract the content zone — the unique content structure below the shared scaffold.
 * This is the meat of each page — the part that differs by page type.
 *
 * Returns a tree of content blocks with their wrapper classes, IDs, grid layout,
 * and a text preview.
 */
async function extractContentZone(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main#main-content') || document.querySelector('main');
    if (!main) return { error: 'No main element found' };

    // Skip the shared scaffold sections — we captured those above
    const scaffoldIds = ['breadcrumb-container', 'second-title-container',
      'second-navigation-container', 'main-title-container'];

    // Noise classes to filter out
    const noisePattern = /^(ot-|onetrust|hydrated$|aspNet|clearfix$|sr-only$)/;

    function describeBlock(el, depth = 0, maxDepth = 4) {
      if (depth > maxDepth) return null;
      const tag = el.tagName?.toLowerCase();
      if (!tag || ['script', 'style', 'noscript', 'link', 'meta', 'br', 'hr'].includes(tag)) return null;

      const id = el.id || '';
      const allClasses = (typeof el.className === 'string') ? el.className.trim() : '';
      // Filter noise classes
      const meaningfulClasses = allClasses.split(/\s+/)
        .filter(c => c && !noisePattern.test(c))
        .join(' ');

      // Get Sitecore control ID info
      const scId = id.match(/maincontent_\d+_(\w+)/) ? id : null;

      // Get text content preview (only for leaf nodes or nodes with few children)
      let textPreview = null;
      if (el.children.length === 0) {
        textPreview = el.textContent?.trim().substring(0, 100) || null;
      } else if (el.children.length <= 2) {
        // Get direct text nodes only
        const directText = [...el.childNodes]
          .filter(n => n.nodeType === 3)
          .map(n => n.textContent.trim())
          .filter(t => t)
          .join(' ')
          .substring(0, 100);
        if (directText) textPreview = directText;
      }

      // Get grid layout info
      const gridMatch = allClasses.match(/col-(xs|sm|md|lg)-(\d+)/g);
      const gridLayout = gridMatch ? gridMatch.join(' ') : null;

      // Recurse into children
      const children = [];
      for (const child of el.children) {
        const desc = describeBlock(child, depth + 1, maxDepth);
        if (desc) children.push(desc);
      }

      // Skip empty wrapper divs with only Bootstrap grid classes
      if (tag === 'div' && !id && !scId && children.length === 1 &&
          meaningfulClasses.match(/^(container|row|col-)/) && !textPreview) {
        return children[0]; // Flatten — return the child directly
      }

      return {
        tag,
        id: id || undefined,
        scId: scId || undefined,
        classes: meaningfulClasses || undefined,
        grid: gridLayout || undefined,
        text: textPreview || undefined,
        childCount: el.children.length,
        children: children.length > 0 ? children : undefined,
      };
    }

    // Collect content blocks — direct children of main that aren't scaffold
    const contentBlocks = [];
    for (const child of main.children) {
      if (scaffoldIds.includes(child.id)) continue;
      // Skip OneTrust overlay
      if (child.id === 'onetrust-consent-sdk') continue;
      if (child.className && typeof child.className === 'string' && child.className.includes('onetrust')) continue;

      const block = describeBlock(child, 0, 4);
      if (block) contentBlocks.push(block);
    }

    return { contentBlocks };
  });
}

/**
 * Extract the full heading hierarchy — H1 through H6.
 * Excludes headings from the OneTrust cookie overlay.
 */
async function extractHeadings(page) {
  return page.evaluate(() => {
    const headings = [];
    document.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6').forEach(h => {
      // Skip OneTrust cookie consent headings
      if (h.closest('#onetrust-consent-sdk, .onetrust-pc-dark-filter, [id*="onetrust"]')) return;

      headings.push({
        level: parseInt(h.tagName.substring(1)),
        tag: h.tagName,
        text: h.textContent.trim().substring(0, 120),
        id: h.id || undefined,
        classes: (typeof h.className === 'string' && h.className.trim()) ? h.className.trim() : undefined,
        parentId: h.parentElement?.id || undefined,
        parentClasses: (typeof h.parentElement?.className === 'string')
          ? h.parentElement.className.trim().split(/\s+/).filter(c => !c.startsWith('ot-')).join(' ').substring(0, 60)
          : undefined,
      });
    });
    return headings;
  });
}

/**
 * Extract Sitecore-specific element IDs — these reveal CMS field names and rendering slots.
 * Pattern: maincontent_N_fieldName
 */
async function extractSitecoreIds(page) {
  return page.evaluate(() => {
    const elements = [];
    document.querySelectorAll('[id*="maincontent"]').forEach(el => {
      elements.push({
        id: el.id,
        tag: el.tagName.toLowerCase(),
        classes: (typeof el.className === 'string') ? el.className.trim().substring(0, 80) : '',
        textPreview: el.textContent?.trim().substring(0, 80) || '',
        childCount: el.children.length,
      });
    });
    return elements;
  });
}

/**
 * Extract content-specific CSS classes — filtering out Bootstrap, OneTrust, and global nav noise.
 * Only looks inside the <main> content area.
 */
async function extractContentClasses(page) {
  return page.evaluate(() => {
    const noisePattern = /^(col-|row$|container$|hidden-|visible-|pull-|push-|text-|bg-|btn$|form-control|input-|fa-|fas$|far$|fab$|ot-|onetrust|hydrated$|aspNet|clearfix$|sr-only$|d-none|d-flex|d-block|active$|disabled$|section$|h[1-6]$)/;

    const classes = new Map();
    const main = document.querySelector('main#main-content') || document.querySelector('main');
    if (!main) return [];

    // Only look at content area, skip header/footer within main
    main.querySelectorAll('*').forEach(el => {
      // Skip OneTrust
      if (el.closest('#onetrust-consent-sdk')) return;
      // Skip header/nav/footer duplicates inside main
      if (el.closest('header, footer')) return;

      if (!el.className || typeof el.className !== 'string') return;
      el.classList.forEach(cls => {
        if (cls.length < 3 || noisePattern.test(cls)) return;
        if (!classes.has(cls)) classes.set(cls, { count: 0, tags: new Set(), contexts: new Set() });
        const data = classes.get(cls);
        data.count++;
        data.tags.add(el.tagName.toLowerCase());
        // Track which section IDs this class appears under
        const parentSection = el.closest('[id]');
        if (parentSection?.id) data.contexts.add(parentSection.id);
      });
    });

    return [...classes.entries()]
      .map(([cls, data]) => ({
        class: cls,
        count: data.count,
        tags: [...data.tags],
        contexts: [...data.contexts].slice(0, 5),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
  });
}

/**
 * Extract structured data (JSON-LD, microdata).
 */
async function extractStructuredData(page) {
  return page.evaluate(() => {
    const jsonLd = [];
    document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
      try {
        jsonLd.push(JSON.parse(script.textContent));
      } catch {
        jsonLd.push({ _raw: script.textContent.substring(0, 500), _parseError: true });
      }
    });

    const microdata = [];
    document.querySelectorAll('[itemscope]').forEach((el) => {
      microdata.push({
        itemtype: el.getAttribute('itemtype'),
        properties: [...el.querySelectorAll('[itemprop]')].map((prop) => ({
          name: prop.getAttribute('itemprop'),
          content: prop.getAttribute('content') || prop.textContent?.substring(0, 100),
        })),
      });
    });

    return { jsonLd, microdata };
  });
}

/**
 * Main — reads page-types.json, inspects sample pages, outputs results.
 */
async function main() {
  console.log('=== FRAS Canada Page Inspector (v2) ===\n');

  // Read page types data
  const inputPath = join(DATA_DIR, 'page-types.json');
  let pageTypes;
  try {
    pageTypes = JSON.parse(readFileSync(inputPath, 'utf-8'));
  } catch (err) {
    console.error(`Error reading ${inputPath}: ${err.message}`);
    console.error('Run classify-pages.mjs first.');
    process.exit(1);
  }

  // Collect all sample URLs with their page type
  const samplesToInspect = [];
  for (const [type, data] of Object.entries(pageTypes)) {
    for (const url of data.samples) {
      samplesToInspect.push({ pageType: type, url });
    }
  }

  console.log(`Inspecting ${samplesToInspect.length} sample pages across ${Object.keys(pageTypes).length} page types\n`);

  // Launch browser
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const inspections = [];

  try {
    for (let i = 0; i < samplesToInspect.length; i++) {
      const { pageType, url } = samplesToInspect[i];
      console.log(`[${i + 1}/${samplesToInspect.length}] Inspecting (${pageType}): ${url}`);

      try {
        const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        const statusCode = response?.status() || 0;

        if (statusCode >= 400) {
          console.log(`  → HTTP ${statusCode}, skipping`);
          inspections.push({ pageType, url, error: `HTTP ${statusCode}`, timestamp: new Date().toISOString() });
          await delay();
          continue;
        }

        // Wait for lazy content
        await page.waitForTimeout(1000);

        // Extract all data
        const [metadata, scaffold, contentZone, headings, sitecoreIds, contentClasses, structuredData] = await Promise.all([
          extractMetadata(page),
          extractScaffold(page),
          extractContentZone(page),
          extractHeadings(page),
          extractSitecoreIds(page),
          extractContentClasses(page),
          extractStructuredData(page),
        ]);

        // Take screenshot
        const screenshotDir = join(SCREENSHOTS_DIR, sanitizeFilename(pageType));
        mkdirSync(screenshotDir, { recursive: true });
        const screenshotName = sanitizeFilename(new URL(url).pathname) + '.png';
        const screenshotPath = join(screenshotDir, screenshotName);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        const inspection = {
          pageType,
          url,
          statusCode,
          timestamp: new Date().toISOString(),
          metadata,
          scaffold,
          contentZone,
          headings,
          sitecoreIds,
          contentClasses,
          structuredData,
          screenshotPath: screenshotPath.replace(ROOT + '/', ''),
        };

        inspections.push(inspection);

        // Print a useful summary for this page
        const tabCount = scaffold.subNavigation?.tabs?.length || 0;
        const blockCount = contentZone?.contentBlocks?.length || 0;
        const headingCount = headings?.length || 0;
        const scIdCount = sitecoreIds?.length || 0;
        console.log(`  → OK | H1: "${scaffold.pageTitle?.text?.substring(0, 40)}" | ${tabCount} tabs | ${blockCount} content blocks | ${headingCount} headings | ${scIdCount} SC IDs`);

        await delay();
      } catch (err) {
        console.log(`  → Error: ${err.message}`);
        inspections.push({ pageType, url, error: err.message, timestamp: new Date().toISOString() });
        await delay(1000, 2000);
      }
    }
  } finally {
    await browser.close();
  }

  // Write output
  const outputPath = join(DATA_DIR, 'page-inspections.json');
  writeFileSync(outputPath, JSON.stringify(inspections, null, 2));

  // Print summary
  const successful = inspections.filter((i) => !i.error).length;
  const failed = inspections.filter((i) => i.error).length;
  console.log(`\n=== Page Inspection Complete ===`);
  console.log(`Inspected: ${successful} pages`);
  console.log(`Failed: ${failed} pages`);
  console.log(`Output: ${outputPath}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
