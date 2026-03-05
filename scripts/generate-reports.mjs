/**
 * @description
 * Step 4: Report Generator — reads all JSON data files and generates
 * structured markdown reports for the FRAS Canada site inventory.
 *
 * Generates:
 * 1. Main report (.ai-reports/dogfood-frascanada/report.md) — overview with all sections
 * 2. Page types reference (.ai-reports/dogfood-frascanada/page-types.md) — detailed taxonomy
 * 3. Component registry (.ai-reports/dogfood-frascanada/components.md) — component inventory
 *
 * @dependencies
 * - None (pure data processing and file I/O)
 *
 * @notes
 * - Reads from data/sitemap-urls.json, data/page-types.json, data/page-inspections.json
 * - Updates the existing report.md skeleton with populated data
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');
const REPORTS_DIR = join(ROOT, '.ai-reports', 'dogfood-frascanada');

/**
 * Safely read and parse a JSON file, returning null on failure.
 * @param {string} filename - File name within DATA_DIR
 * @returns {object|null} Parsed data or null
 */
function readData(filename) {
  const path = join(DATA_DIR, filename);
  try {
    return JSON.parse(readFileSync(path, 'utf-8'));
  } catch {
    console.warn(`Warning: Could not read ${path}`);
    return null;
  }
}

/**
 * Build a sitemap tree structure from URL list for display.
 * Groups URLs by their path segments to show site hierarchy.
 *
 * @param {Array} urls - Array of URL entry objects
 * @returns {object} Nested tree structure with counts
 */
function buildSiteTree(urls) {
  const tree = {};
  for (const entry of urls) {
    try {
      const path = new URL(entry.url).pathname;
      const segments = path.split('/').filter(Boolean);
      let node = tree;
      for (const seg of segments) {
        if (!node[seg]) node[seg] = { _count: 0, _children: {} };
        node[seg]._count++;
        node = node[seg]._children;
      }
    } catch { /* skip malformed URLs */ }
  }
  return tree;
}

/**
 * Render a site tree as indented markdown.
 * @param {object} tree - Tree from buildSiteTree
 * @param {number} depth - Current indentation depth
 * @param {number} maxDepth - Maximum depth to render
 * @returns {string} Formatted markdown string
 */
function renderTree(tree, depth = 0, maxDepth = 3) {
  if (depth >= maxDepth) return '';
  let output = '';
  const entries = Object.entries(tree).sort(([a], [b]) => a.localeCompare(b));
  for (const [name, data] of entries) {
    const indent = '  '.repeat(depth);
    const childCount = Object.keys(data._children).length;
    output += `${indent}- **/${name}** (${data._count} pages)`;
    if (childCount > 0 && depth < maxDepth - 1) {
      output += '\n' + renderTree(data._children, depth + 1, maxDepth);
    } else {
      output += '\n';
    }
  }
  return output;
}

/**
 * Generate the main report.md with all sections populated.
 *
 * @param {Array} sitemapUrls - Raw URL data
 * @param {object} pageTypes - Page type classification data
 * @param {Array} inspections - Page inspection data
 * @returns {string} Complete markdown report
 */
function generateMainReport(sitemapUrls, pageTypes, inspections) {
  const date = new Date().toISOString().split('T')[0];
  const totalUrls = sitemapUrls?.length || 0;
  const enUrls = sitemapUrls?.filter((u) => u.lang === 'en').length || 0;
  const frUrls = sitemapUrls?.filter((u) => u.lang === 'fr').length || 0;
  const typeCount = pageTypes ? Object.keys(pageTypes).length : 0;
  const inspectionCount = inspections?.filter((i) => !i.error).length || 0;

  let md = `# Site Discovery Report: FRAS Canada

| Field | Value |
|-------|-------|
| **Date** | ${date} |
| **App URL** | https://www.frascanada.ca/ |
| **Session** | frascanada |
| **Scope** | Full site discovery — sitemap, page types, component inventory, data/metadata structure |

## Summary

| Metric | Count |
|--------|-------|
| Total URLs Discovered | ${totalUrls} |
| EN Pages | ${enUrls} |
| FR Pages | ${frUrls} |
| Page Types Identified | ${typeCount} |
| Pages Inspected | ${inspectionCount} |

---

## 1. Sitemap & Navigation Structure

`;

  // Section 1: Sitemap tree
  if (sitemapUrls && sitemapUrls.length > 0) {
    const tree = buildSiteTree(sitemapUrls);
    md += `### Site Hierarchy (top 3 levels)\n\n`;
    md += renderTree(tree, 0, 3);

    // URL counts per top-level section
    md += `\n### URL Counts by Section\n\n`;
    md += `| Section | Count |\n|---------|-------|\n`;
    const sections = {};
    for (const entry of sitemapUrls) {
      try {
        const path = new URL(entry.url).pathname;
        const topLevel = '/' + (path.split('/').filter(Boolean)[0] || 'root');
        sections[topLevel] = (sections[topLevel] || 0) + 1;
      } catch { /* skip */ }
    }
    for (const [section, count] of Object.entries(sections).sort((a, b) => b[1] - a[1])) {
      md += `| ${section} | ${count} |\n`;
    }
  } else {
    md += `_No sitemap data available._\n`;
  }

  // Section 2: Page type taxonomy
  md += `\n---\n\n## 2. Page Types / Templates\n\n`;
  if (pageTypes) {
    md += `| Page Type | Total | EN | FR | Sample URL |\n`;
    md += `|-----------|-------|----|----|------------|\n`;
    const sorted = Object.entries(pageTypes).sort((a, b) => b[1].count - a[1].count);
    for (const [type, data] of sorted) {
      const sample = data.samples[0] || '—';
      const sampleDisplay = sample.length > 60 ? '...' + sample.substring(sample.length - 57) : sample;
      md += `| ${type} | ${data.count} | ${data.enCount} | ${data.frCount} | ${sampleDisplay} |\n`;
    }
    md += `\n_See [page-types.md](page-types.md) for detailed reference._\n`;
  } else {
    md += `_No page type data available._\n`;
  }

  // Section 3: Component / Content Block Inventory (v2 data shape)
  md += `\n---\n\n## 3. Component / Content Block Inventory\n\n`;
  if (inspections && inspections.length > 0) {
    const successful = inspections.filter(i => !i.error);

    // Aggregate content block wrappers across page types
    const blockClasses = new Map(); // wrapper class -> Set of page types
    for (const insp of successful) {
      for (const block of insp.contentZone?.contentBlocks || []) {
        const cls = block.classes || block.id || `<${block.tag}>`;
        if (!blockClasses.has(cls)) blockClasses.set(cls, new Set());
        blockClasses.get(cls).add(insp.pageType);
      }
    }

    md += `### Content Block Wrappers\n\n`;
    md += `These are the top-level content containers found inside \`<main>\`, below the shared scaffold.\n\n`;
    md += `| Wrapper | Found On Page Types |\n|---------|--------------------|\n`;
    for (const [cls, types] of [...blockClasses.entries()].sort((a, b) => b[1].size - a[1].size)) {
      md += `| \`${cls.substring(0, 60)}\` | ${[...types].join(', ')} |\n`;
    }

    // Aggregate Sitecore control IDs — extract the field name suffix
    const scFieldNames = new Map(); // field name -> Set of page types
    for (const insp of successful) {
      for (const el of insp.sitecoreIds || []) {
        const match = el.id.match(/maincontent_\d+_(.+)/);
        if (match) {
          // Strip GUIDs to get the meaningful field name
          const fieldName = match[1].replace(/[a-f0-9]{32}/g, '*').replace(/_\d+_/g, '_N_');
          if (!scFieldNames.has(fieldName)) scFieldNames.set(fieldName, new Set());
          scFieldNames.get(fieldName).add(insp.pageType);
        }
      }
    }

    md += `\n### Sitecore CMS Field IDs\n\n`;
    md += `ASP.NET control IDs reveal CMS rendering slots and field names.\n\n`;
    md += `| Field Pattern | Found On Page Types |\n|---------------|--------------------|\n`;
    for (const [field, types] of [...scFieldNames.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 30)) {
      md += `| \`${field.substring(0, 60)}\` | ${[...types].join(', ')} |\n`;
    }

    // Aggregate content-specific CSS classes
    const allContentClasses = new Map(); // class -> Set of page types
    for (const insp of successful) {
      for (const cls of insp.contentClasses || []) {
        if (!allContentClasses.has(cls.class)) allContentClasses.set(cls.class, new Set());
        allContentClasses.get(cls.class).add(insp.pageType);
      }
    }

    md += `\n### Content CSS Classes (${allContentClasses.size} unique)\n\n`;
    md += `Meaningful classes inside content zones (Bootstrap/OneTrust noise filtered).\n\n`;
    md += `| Class | Found On Page Types |\n|-------|--------------------|\n`;
    for (const [cls, types] of [...allContentClasses.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 30)) {
      md += `| \`.${cls}\` | ${[...types].join(', ')} |\n`;
    }

    // Sub-navigation tab patterns
    md += `\n### Sub-Navigation Patterns\n\n`;
    const tabPatterns = new Map(); // tab count -> page types
    for (const insp of successful) {
      const tabCount = insp.scaffold?.subNavigation?.tabs?.length || 0;
      if (tabCount > 0) {
        const tabs = insp.scaffold.subNavigation.tabs.map(t => t.text).join(', ');
        if (!tabPatterns.has(tabs)) tabPatterns.set(tabs, new Set());
        tabPatterns.get(tabs).add(insp.pageType);
      }
    }
    md += `| Tab Pattern | Page Types |\n|-------------|------------|\n`;
    for (const [tabs, types] of tabPatterns.entries()) {
      md += `| ${tabs} | ${[...types].join(', ')} |\n`;
    }

    md += `\n_See [components.md](components.md) for full registry._\n`;
  } else {
    md += `_No inspection data available._\n`;
  }

  // Section 4: Metadata audit
  md += `\n---\n\n## 4. Data & Metadata Structure\n\n`;
  if (inspections && inspections.length > 0) {
    md += `### Metadata Coverage by Page Type\n\n`;
    md += `| Page Type | Title | Description | Canonical | OG Tags | JSON-LD | Hreflang |\n`;
    md += `|-----------|-------|-------------|-----------|---------|---------|----------|\n`;

    // Group inspections by page type
    const byType = {};
    for (const insp of inspections) {
      if (insp.error) continue;
      if (!byType[insp.pageType]) byType[insp.pageType] = [];
      byType[insp.pageType].push(insp);
    }

    for (const [type, insps] of Object.entries(byType).sort()) {
      const hasTitle = insps.every((i) => i.metadata?.title);
      const hasDesc = insps.every((i) => i.metadata?.description);
      const hasCanonical = insps.every((i) => i.metadata?.canonical);
      const hasOg = insps.every((i) => i.metadata?.og?.title);
      const hasJsonLd = insps.some((i) => i.structuredData?.jsonLd?.length > 0);
      const hasHreflang = insps.some((i) => i.metadata?.hreflang?.length > 0);

      const check = (v) => (v ? 'Yes' : '**Missing**');
      md += `| ${type} | ${check(hasTitle)} | ${check(hasDesc)} | ${check(hasCanonical)} | ${check(hasOg)} | ${check(hasJsonLd)} | ${check(hasHreflang)} |\n`;
    }

    // Generator / CMS info
    const generators = new Set();
    for (const insp of inspections) {
      if (insp.metadata?.generator) generators.add(insp.metadata.generator);
    }
    if (generators.size > 0) {
      md += `\n### CMS / Generator\n\n`;
      for (const gen of generators) {
        md += `- ${gen}\n`;
      }
    }
  } else {
    md += `_No metadata data available._\n`;
  }

  // Section 5: Issues
  md += `\n---\n\n## 5. Issues Found During Exploration\n\n`;
  if (inspections && inspections.length > 0) {
    const issues = [];

    for (const insp of inspections) {
      if (insp.error) {
        issues.push({ severity: 'High', type: 'Page Error', detail: `${insp.url} — ${insp.error}`, pageType: insp.pageType });
      }
      if (!insp.error && insp.metadata) {
        if (!insp.metadata.description) {
          issues.push({ severity: 'Medium', type: 'Missing Meta Description', detail: insp.url, pageType: insp.pageType });
        }
        if (!insp.metadata.canonical) {
          issues.push({ severity: 'Low', type: 'Missing Canonical', detail: insp.url, pageType: insp.pageType });
        }
        if (!insp.metadata.og?.title) {
          issues.push({ severity: 'Low', type: 'Missing OG Tags', detail: insp.url, pageType: insp.pageType });
        }
        if (!insp.metadata.hreflang || insp.metadata.hreflang.length === 0) {
          issues.push({ severity: 'Medium', type: 'Missing Hreflang', detail: insp.url, pageType: insp.pageType });
        }
      }
    }

    if (issues.length > 0) {
      // Update summary counts
      const critical = issues.filter((i) => i.severity === 'Critical').length;
      const high = issues.filter((i) => i.severity === 'High').length;
      const medium = issues.filter((i) => i.severity === 'Medium').length;
      const low = issues.filter((i) => i.severity === 'Low').length;

      md += `| Severity | Count |\n|----------|-------|\n`;
      md += `| Critical | ${critical} |\n`;
      md += `| High | ${high} |\n`;
      md += `| Medium | ${medium} |\n`;
      md += `| Low | ${low} |\n`;
      md += `| **Total** | **${issues.length}** |\n\n`;

      md += `### Issue Details\n\n`;
      for (const issue of issues) {
        md += `- **[${issue.severity}]** ${issue.type}: ${issue.detail}\n`;
      }
    } else {
      md += `No issues found.\n`;
    }
  } else {
    md += `_No inspection data to audit._\n`;
  }

  md += `\n---\n\n_Report generated on ${date} by FRAS Canada Site Inventory Pipeline._\n`;

  return md;
}

/**
 * Generate page-types.md — detailed page type reference with all URLs.
 *
 * @param {object} pageTypes - Page type classification data
 * @param {Array} inspections - Page inspection data
 * @returns {string} Markdown content
 */
function generatePageTypesReport(pageTypes, inspections) {
  let md = `# FRAS Canada — Page Type Reference\n\n`;
  md += `_Generated: ${new Date().toISOString().split('T')[0]}_\n\n`;
  md += `## Overview\n\n`;

  if (!pageTypes) {
    md += `_No page type data available._\n`;
    return md;
  }

  md += `Total page types identified: **${Object.keys(pageTypes).length}**\n\n`;

  const sorted = Object.entries(pageTypes).sort((a, b) => b[1].count - a[1].count);

  for (const [type, data] of sorted) {
    md += `---\n\n### ${type}\n\n`;
    md += `- **Total URLs:** ${data.count} (EN: ${data.enCount}, FR: ${data.frCount})\n`;

    // Include v2 inspection data if available
    const relatedInspections = inspections?.filter((i) => i.pageType === type && !i.error) || [];
    if (relatedInspections.length > 0) {
      const insp = relatedInspections[0];
      md += `- **Sample Title:** ${insp.metadata?.title || 'N/A'}\n`;
      // Breadcrumbs from scaffold
      if (insp.scaffold?.breadcrumbs?.path?.length > 0) {
        const bcPath = insp.scaffold.breadcrumbs.path.map(b => b.text).join(' > ');
        md += `- **Breadcrumb Pattern:** ${bcPath}\n`;
      }
      // Section title
      if (insp.scaffold?.sectionTitle?.text) {
        md += `- **Section Title:** ${insp.scaffold.sectionTitle.text}\n`;
      }
      // Sub-nav tabs
      if (insp.scaffold?.subNavigation?.tabs?.length > 0) {
        const tabs = insp.scaffold.subNavigation.tabs.map(t => t.text).join(', ');
        md += `- **Sub-Nav Tabs (${insp.scaffold.subNavigation.tabs.length}):** ${tabs}\n`;
      }
      // Content blocks
      const blockCount = insp.contentZone?.contentBlocks?.length || 0;
      if (blockCount > 0) {
        const blockTypes = insp.contentZone.contentBlocks.map(b => b.classes || b.id || `<${b.tag}>`).join(', ');
        md += `- **Content Blocks (${blockCount}):** ${blockTypes}\n`;
      }
      // Heading count
      const headingCount = insp.headings?.length || 0;
      md += `- **Headings:** ${headingCount}\n`;
      // Sitecore IDs
      const scCount = insp.sitecoreIds?.length || 0;
      md += `- **Sitecore Control IDs:** ${scCount}\n`;
    }

    md += `\n**Sample URLs:**\n\n`;
    for (const url of data.samples) {
      md += `- ${url}\n`;
    }

    // Show first 10 URLs if there are more
    if (data.urls.length > data.samples.length) {
      md += `\n<details><summary>All ${data.urls.length} URLs</summary>\n\n`;
      for (const url of data.urls.slice(0, 50)) {
        md += `- ${url}\n`;
      }
      if (data.urls.length > 50) {
        md += `- ... and ${data.urls.length - 50} more\n`;
      }
      md += `\n</details>\n`;
    }

    md += `\n`;
  }

  return md;
}

/**
 * Generate components.md — full component registry from inspection data.
 *
 * @param {Array} inspections - Page inspection data
 * @returns {string} Markdown content
 */
function generateComponentsReport(inspections) {
  let md = `# FRAS Canada — Component Registry\n\n`;
  md += `_Generated: ${new Date().toISOString().split('T')[0]}_\n\n`;

  if (!inspections || inspections.length === 0) {
    md += `_No inspection data available._\n`;
    return md;
  }

  const successful = inspections.filter((i) => !i.error);

  // Shared Page Scaffold
  md += `## Shared Page Scaffold\n\n`;
  md += `Every page on frascanada.ca shares this structural scaffold inside \`<main#main-content>\`:\n\n`;
  md += `| Section | ID / Selector | Purpose |\n|---------|---------------|----------|\n`;
  md += `| Breadcrumbs | \`#breadcrumb-container\` | Path navigation (hidden on mobile) |\n`;
  md += `| Section Title | \`#second-title-container\` | Board/section name (e.g. "AcSB") |\n`;
  md += `| Sub-Navigation | \`#second-navigation-container\` | Tab navigation (About, Meetings, etc.) |\n`;
  md += `| Page Title | \`#main-title-container\` | H1 page title |\n`;
  md += `| Content Zone | _(varies by page type)_ | Unique content below scaffold |\n\n`;

  // Content Block Wrappers
  md += `## Content Block Wrappers\n\n`;
  md += `These are the top-level content containers found in the content zone.\n\n`;
  const blockUsage = new Map();
  for (const insp of successful) {
    for (const block of insp.contentZone?.contentBlocks || []) {
      const key = block.classes || block.id || `<${block.tag}>`;
      if (!blockUsage.has(key)) blockUsage.set(key, { types: new Set(), structure: block });
      blockUsage.get(key).types.add(insp.pageType);
    }
  }
  md += `| Wrapper | Page Types | Child Structure |\n|---------|-----------|----------------|\n`;
  for (const [key, data] of [...blockUsage.entries()].sort((a, b) => b[1].types.size - a[1].types.size)) {
    const childSummary = data.structure.children
      ? data.structure.children.map(c => c.classes || c.tag).join(', ')
      : `${data.structure.childCount} children`;
    md += `| \`.${key.substring(0, 50)}\` | ${[...data.types].join(', ')} | ${childSummary.substring(0, 60)} |\n`;
  }

  // Sitecore CMS Control IDs
  md += `\n## Sitecore CMS Control IDs\n\n`;
  md += `ASP.NET WebForms IDs reveal CMS rendering slots. Pattern: \`maincontent_N_fieldName\`\n\n`;
  const scFields = new Map();
  for (const insp of successful) {
    for (const el of insp.sitecoreIds || []) {
      const match = el.id.match(/maincontent_\d+_(.+)/);
      if (!match) continue;
      const raw = match[1];
      // Simplify GUID-heavy names
      const simplified = raw.replace(/[a-f0-9]{32}/g, '{guid}').replace(/_\d+_/g, '_N_');
      if (!scFields.has(simplified)) scFields.set(simplified, { types: new Set(), examples: [] });
      const data = scFields.get(simplified);
      data.types.add(insp.pageType);
      if (data.examples.length < 2) {
        data.examples.push({ fullId: el.id, tag: el.tag, text: el.textPreview });
      }
    }
  }
  md += `| Field Pattern | Tag | Page Types | Example Content |\n|--------------|-----|-----------|----------------|\n`;
  for (const [field, data] of [...scFields.entries()].sort((a, b) => b[1].types.size - a[1].types.size)) {
    const ex = data.examples[0];
    md += `| \`${field.substring(0, 50)}\` | \`${ex.tag}\` | ${[...data.types].join(', ')} | ${(ex.text || '').substring(0, 40)} |\n`;
  }

  // Content CSS Classes
  md += `\n## Content CSS Classes\n\n`;
  md += `Meaningful classes inside content zones (Bootstrap/OneTrust/nav noise filtered).\n\n`;
  const classUsage = new Map();
  for (const insp of successful) {
    for (const cls of insp.contentClasses || []) {
      if (!classUsage.has(cls.class)) classUsage.set(cls.class, new Set());
      classUsage.get(cls.class).add(insp.pageType);
    }
  }
  md += `| Class | Page Types |\n|-------|------------|\n`;
  for (const [cls, types] of [...classUsage.entries()].sort((a, b) => b[1].size - a[1].size).slice(0, 50)) {
    md += `| \`.${cls}\` | ${[...types].join(', ')} |\n`;
  }

  // Per-Page Inspection Details
  md += `\n## Per-Page Inspection Details\n\n`;
  for (const insp of successful) {
    md += `### ${insp.pageType}: ${insp.url}\n\n`;
    md += `- **H1:** ${insp.scaffold?.pageTitle?.text || 'N/A'}\n`;
    md += `- **Section Title:** ${insp.scaffold?.sectionTitle?.text || 'N/A'}\n`;
    md += `- **Sub-Nav Tabs:** ${insp.scaffold?.subNavigation?.tabs?.length || 0}\n`;
    md += `- **Content Blocks:** ${insp.contentZone?.contentBlocks?.length || 0}\n`;
    md += `- **Headings:** ${insp.headings?.length || 0}\n`;
    md += `- **Sitecore IDs:** ${insp.sitecoreIds?.length || 0}\n`;
    md += `- **Content Classes:** ${insp.contentClasses?.length || 0}\n`;
    if (insp.screenshotPath) {
      md += `- **Screenshot:** ${insp.screenshotPath}\n`;
    }

    // Show heading hierarchy
    if (insp.headings?.length > 0) {
      md += `\n**Heading Hierarchy:**\n\n`;
      for (const h of insp.headings) {
        const indent = '  '.repeat(h.level - 1);
        md += `${indent}- ${h.tag}: ${h.text}\n`;
      }
    }

    // Show content block structure
    if (insp.contentZone?.contentBlocks?.length > 0) {
      md += `\n**Content Blocks:**\n\n`;
      for (const block of insp.contentZone.contentBlocks) {
        md += `- \`${block.classes || block.id || block.tag}\``;
        if (block.children) {
          md += ` → ${block.children.map(c => c.classes || c.tag).join(', ')}`;
        }
        md += `\n`;
      }
    }

    md += `\n`;
  }

  return md;
}

/**
 * Main — reads all data files and generates reports.
 */
function main() {
  console.log('=== FRAS Canada Report Generator ===\n');

  // Read all data files
  const sitemapUrls = readData('sitemap-urls.json');
  const pageTypes = readData('page-types.json');
  const inspections = readData('page-inspections.json');

  // Generate and write reports
  const mainReport = generateMainReport(sitemapUrls, pageTypes, inspections);
  const mainReportPath = join(REPORTS_DIR, 'report.md');
  writeFileSync(mainReportPath, mainReport);
  console.log(`Written: ${mainReportPath}`);

  const pageTypesReport = generatePageTypesReport(pageTypes, inspections);
  const pageTypesPath = join(REPORTS_DIR, 'page-types.md');
  writeFileSync(pageTypesPath, pageTypesReport);
  console.log(`Written: ${pageTypesPath}`);

  const componentsReport = generateComponentsReport(inspections);
  const componentsPath = join(REPORTS_DIR, 'components.md');
  writeFileSync(componentsPath, componentsReport);
  console.log(`Written: ${componentsPath}`);

  console.log(`\n=== Reports Generated Successfully ===`);
}

main();
