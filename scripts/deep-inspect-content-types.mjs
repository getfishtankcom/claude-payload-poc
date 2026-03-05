/**
 * @description
 * Deep content type inspector — extracts detailed field-level data from
 * pages representing content types with incomplete documentation.
 *
 * Targets:
 * 1. Effective Dates table entries (field structure of each row)
 * 2. Volunteer Opportunities (field structure, categorization)
 * 3. Committee pages (deep structure, staff contacts, sub-committees)
 * 4. Member bio pages (body content structure, which members have bios)
 * 5. Resource detail (PDF vs body, file metadata)
 * 6. Document for Comment - closed state (view comments, support materials)
 * 7. Project detail (related news cardinality, staff contacts, disclaimer)
 * 8. Meeting detail (body content model, terminology per board)
 *
 * @dependencies
 * - playwright
 */

import { chromium } from 'playwright';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DATA_DIR = join(ROOT, 'data');

function delay(min = 2000, max = 3000) {
  const ms = Math.floor(Math.random() * (max - min)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Pages to inspect for each content type gap
const TARGETS = [
  // Effective Dates — need to understand table row structure
  {
    type: 'effective-dates',
    url: 'https://www.frascanada.ca/en/ifrsstandards/effective-dates',
    extract: 'effectiveDatesTable',
  },
  {
    type: 'effective-dates',
    url: 'https://www.frascanada.ca/en/cass/effective-dates',
    extract: 'effectiveDatesTable',
  },
  // Volunteer Opportunities
  {
    type: 'volunteer-opportunity',
    url: 'https://www.frascanada.ca/en/rasoc/volunteer-opportunities',
    extract: 'volunteerListing',
  },
  {
    type: 'volunteer-opportunity',
    url: 'https://www.frascanada.ca/en/aasoc/volunteer-opportunities',
    extract: 'volunteerListing',
  },
  // Committee pages — deep structure
  {
    type: 'committee-detail',
    url: 'https://www.frascanada.ca/en/aasb/committees',
    extract: 'committeeListing',
  },
  {
    type: 'committee-detail',
    url: 'https://www.frascanada.ca/en/rasoc/committes/governance',
    extract: 'committeeDetail',
  },
  {
    type: 'committee-detail',
    url: 'https://www.frascanada.ca/en/acsb/about/committees',
    extract: 'committeeListing',
  },
  // Member bio pages
  {
    type: 'member-bio',
    url: 'https://www.frascanada.ca/en/rasoc/about/members/barb-sundquist',
    extract: 'memberBio',
  },
  {
    type: 'member-bio',
    url: 'https://www.frascanada.ca/en/acsb/about/members',
    extract: 'memberListing',
  },
  // Resource detail — PDF vs body, file metadata
  {
    type: 'resource-detail',
    url: 'https://www.frascanada.ca/en/aspe/resources',
    extract: 'resourceListing',
  },
  {
    type: 'resource-detail',
    url: 'https://www.frascanada.ca/en/cass/resources/lessons-learned-kam-reporting',
    extract: 'resourceDetail',
  },
  {
    type: 'resource-detail',
    url: 'https://www.frascanada.ca/en/sustainability/resources/sasb-resource-page',
    extract: 'resourceDetail',
  },
  // Document for Comment — closed state
  {
    type: 'document-closed',
    url: 'https://www.frascanada.ca/en/ifrsstandards/documents',
    extract: 'documentListing',
  },
  // Project detail — related news, staff contacts, disclaimer
  {
    type: 'project-detail',
    url: 'https://www.frascanada.ca/en/cass/projects/audit-evidence',
    extract: 'projectDetail',
  },
  // Meeting detail — body content structure
  {
    type: 'meeting-detail',
    url: 'https://www.frascanada.ca/en/aasb/meetings-and-events/apr-5-2023',
    extract: 'meetingDetail',
  },
  {
    type: 'meeting-detail',
    url: 'https://www.frascanada.ca/en/acsb/meetings-and-events/2022-02-23',
    extract: 'meetingDetail',
  },
];

/**
 * Generic deep extraction — gets the full content structure for any page.
 * More detailed than the v2 inspector — captures actual text content,
 * link targets, image sources, form fields, table structures.
 */
async function deepExtract(page) {
  return page.evaluate(() => {
    const main = document.querySelector('main#main-content') || document.querySelector('main');
    if (!main) return { error: 'No main element' };

    const scaffoldIds = ['breadcrumb-container', 'second-title-container',
      'second-navigation-container', 'main-title-container'];

    // Get all Sitecore IDs with their full context
    const scIds = [];
    main.querySelectorAll('[id*="maincontent"]').forEach(el => {
      const idMatch = el.id.match(/maincontent_(\d+)_(.+)/);
      scIds.push({
        id: el.id,
        index: idMatch ? idMatch[1] : null,
        fieldName: idMatch ? idMatch[2] : null,
        tag: el.tagName.toLowerCase(),
        text: el.textContent?.trim().substring(0, 200) || '',
        childCount: el.children.length,
        classes: (typeof el.className === 'string') ? el.className.trim().substring(0, 100) : '',
      });
    });

    // Get all tables with their full structure
    const tables = [];
    main.querySelectorAll('table').forEach(table => {
      if (table.closest('#onetrust-consent-sdk')) return;
      const headers = [...table.querySelectorAll('thead th, tr:first-child th')].map(th => th.textContent.trim());
      const rows = [];
      table.querySelectorAll('tbody tr, tr').forEach((tr, i) => {
        if (i === 0 && headers.length > 0) return; // skip header row
        const cells = [...tr.querySelectorAll('td, th')].map(td => ({
          text: td.textContent.trim().substring(0, 150),
          isHeader: td.tagName === 'TH',
          colspan: td.getAttribute('colspan') || null,
          links: [...td.querySelectorAll('a')].map(a => ({
            text: a.textContent.trim().substring(0, 80),
            href: a.href,
          })),
        }));
        if (cells.length > 0) rows.push(cells);
      });
      tables.push({
        headers,
        rowCount: rows.length,
        sampleRows: rows.slice(0, 5), // First 5 rows as samples
        classes: table.className || '',
        parentId: table.closest('[id]')?.id || null,
      });
    });

    // Get all forms
    const forms = [];
    main.querySelectorAll('form').forEach(form => {
      const fields = [];
      form.querySelectorAll('input, select, textarea').forEach(field => {
        fields.push({
          type: field.type || field.tagName.toLowerCase(),
          name: field.name || '',
          id: field.id || '',
          placeholder: field.placeholder || '',
          required: field.required,
          options: field.tagName === 'SELECT' ? [...field.options].map(o => o.textContent.trim()) : undefined,
        });
      });
      forms.push({
        action: form.action || '',
        method: form.method || 'get',
        fields,
        id: form.id || '',
      });
    });

    // Get all links with context (for understanding related content sections)
    const contentLinks = [];
    main.querySelectorAll('a[href]').forEach(a => {
      if (a.closest('#onetrust-consent-sdk, header, footer, #breadcrumb-container, #second-navigation-container')) return;
      const parent = a.closest('[id], [class]');
      contentLinks.push({
        text: a.textContent.trim().substring(0, 100),
        href: a.href,
        parentId: parent?.id || null,
        parentClass: (typeof parent?.className === 'string') ? parent.className.trim().substring(0, 60) : null,
        isButton: a.classList.contains('btn') || a.closest('.btn') !== null,
        isPdf: a.href?.match(/\.(pdf|ashx)/i) !== null,
      });
    });

    // Get all images
    const images = [];
    main.querySelectorAll('img').forEach(img => {
      if (img.closest('#onetrust-consent-sdk, header, footer')) return;
      images.push({
        src: img.src,
        alt: img.alt || '',
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        classes: img.className || '',
        parentId: img.closest('[id]')?.id || null,
      });
    });

    // Get filter pills / tabs within content (not navigation)
    const filterPills = [];
    main.querySelectorAll('.filter-container a, .tab_container .tab_drawer_heading, .nav-pills a, .nav-tabs a').forEach(el => {
      if (el.closest('#second-navigation-container, #onetrust-consent-sdk')) return;
      filterPills.push({
        text: el.textContent.trim(),
        href: el.href || '',
        isActive: el.classList.contains('active') || el.classList.contains('d_active'),
        classes: el.className || '',
      });
    });

    // Get select/dropdown filters
    const dropdowns = [];
    main.querySelectorAll('select').forEach(sel => {
      dropdowns.push({
        id: sel.id || '',
        name: sel.name || '',
        label: sel.closest('label')?.textContent?.trim() || document.querySelector(`label[for="${sel.id}"]`)?.textContent?.trim() || '',
        options: [...sel.options].map(o => ({ value: o.value, text: o.textContent.trim() })),
      });
    });

    // Get rich text content sections
    const rteBlocks = [];
    main.querySelectorAll('.rte-wrapper, .rte, [class*="rich-text"], .detail-content-container').forEach(el => {
      rteBlocks.push({
        classes: el.className || '',
        id: el.id || '',
        headings: [...el.querySelectorAll('h1,h2,h3,h4,h5,h6')].map(h => ({
          level: parseInt(h.tagName[1]),
          text: h.textContent.trim().substring(0, 100),
        })),
        paragraphCount: el.querySelectorAll('p').length,
        listCount: el.querySelectorAll('ul, ol').length,
        linkCount: el.querySelectorAll('a').length,
        imageCount: el.querySelectorAll('img').length,
        textPreview: el.textContent.trim().substring(0, 300),
      });
    });

    // Get staff contact sidebar content
    const staffContacts = [];
    main.querySelectorAll('[class*="staff-contact"], .contact-wrapper, [id*="ContactsRepeater"]').forEach(el => {
      staffContacts.push({
        name: el.querySelector('.contact-name, h3, h4, strong')?.textContent?.trim() || '',
        title: el.querySelector('.contact-title, .contact-role')?.textContent?.trim() || '',
        phone: el.querySelector('a[href^="tel:"]')?.textContent?.trim() || '',
        email: el.querySelector('a[href^="mailto:"]')?.textContent?.trim() || '',
        html: el.innerHTML.substring(0, 500),
      });
    });
    // Also check for Sitecore contact IDs
    main.querySelectorAll('[id*="ContactsRepeater"], [id*="staffContactName"], [id*="contactEmail"]').forEach(el => {
      if (!staffContacts.find(c => c.name === el.textContent?.trim())) {
        staffContacts.push({
          scId: el.id,
          text: el.textContent?.trim().substring(0, 100) || '',
          tag: el.tagName.toLowerCase(),
        });
      }
    });

    return {
      scIds,
      tables,
      forms,
      contentLinks: contentLinks.slice(0, 50), // cap at 50
      images,
      filterPills,
      dropdowns,
      rteBlocks,
      staffContacts,
    };
  });
}

async function main() {
  console.log('=== Deep Content Type Inspector ===\n');

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });
  const page = await context.newPage();

  const results = [];

  for (let i = 0; i < TARGETS.length; i++) {
    const target = TARGETS[i];
    console.log(`[${i + 1}/${TARGETS.length}] ${target.type} (${target.extract}): ${target.url}`);

    try {
      const response = await page.goto(target.url, { waitUntil: 'networkidle', timeout: 30000 });
      const status = response?.status() || 0;

      if (status >= 400) {
        console.log(`  → HTTP ${status}, skipping`);
        results.push({ ...target, error: `HTTP ${status}` });
        await delay();
        continue;
      }

      await page.waitForTimeout(1500);
      const data = await deepExtract(page);

      results.push({
        ...target,
        status,
        data,
        timestamp: new Date().toISOString(),
      });

      console.log(`  → OK | ${data.scIds?.length || 0} SC IDs | ${data.tables?.length || 0} tables | ${data.forms?.length || 0} forms | ${data.images?.length || 0} images | ${data.rteBlocks?.length || 0} RTE blocks | ${data.staffContacts?.length || 0} contacts`);
      await delay();
    } catch (err) {
      console.log(`  → Error: ${err.message}`);
      results.push({ ...target, error: err.message });
      await delay(1000, 2000);
    }
  }

  await browser.close();

  // Write raw results
  const outputPath = join(DATA_DIR, 'deep-content-inspections.json');
  writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nOutput: ${outputPath}`);
  console.log(`Inspected: ${results.filter(r => !r.error).length}/${TARGETS.length} pages`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
