#!/usr/bin/env node
/**
 * @description
 * Playwright-based self-test runner for Ralph Wiggum loops.
 * Verifies that UI components actually render correctly at multiple
 * breakpoints, checks structural DOM presence, captures console errors,
 * runs basic interaction tests, and optionally injects axe-core for a11y.
 *
 * Key features:
 * - Dev server lifecycle (start if not running, poll ready, kill on exit)
 * - Per-epic config loading from scripts/self-test-configs/<epic>.json
 * - Screenshots at 3 breakpoints (390px, 768px, 1440px)
 * - Structural DOM checks (selector exists, text contains)
 * - Console error capture
 * - Basic interaction tests (click, keyboard nav)
 * - Optional axe-core a11y injection
 * - Report generation to .ai-reports/screenshots/ralph-verification/
 *
 * @dependencies
 * - playwright (devDep, ^1.52.0)
 *
 * @notes
 * - Exit code 0 = all pass or warnings only
 * - Exit code 1 = structural failure (severity: "block")
 * - Use --no-server if dev server is already running
 * - Use --port to specify a custom port (default: 3000)
 */

import { chromium } from 'playwright';
import { execSync, spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

// ── CLI Argument Parsing ────────────────────────────────────────────────

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h') || args.length === 0) {
  console.log(`
Usage:
  node scripts/self-test.mjs --epic <epic-id>
  node scripts/self-test.mjs --epic epic-04 --port 3001
  node scripts/self-test.mjs --epic epic-04 --no-server

Options:
  --epic <id>     Epic ID (e.g., epic-04, epic-02-03). Required.
  --port <number> Dev server port (default: 3000)
  --no-server     Skip starting/stopping dev server (assumes already running)
  --help, -h      Show this help message

Exit codes:
  0  All checks passed (or warnings only)
  1  Structural failure (severity: "block")

Config files:  scripts/self-test-configs/<epic>.json
Reports:       .ai-reports/screenshots/ralph-verification/<epic>/report.md
`);
  process.exit(0);
}

/** Parse a named CLI flag value */
function getFlag(name) {
  const idx = args.indexOf(name);
  if (idx === -1 || idx + 1 >= args.length) return undefined;
  return args[idx + 1];
}

const epicId = getFlag('--epic');
const port = parseInt(getFlag('--port') || '3000', 10);
const noServer = args.includes('--no-server');

if (!epicId) {
  console.error('Error: --epic <id> is required.');
  process.exit(1);
}

// ── Config Loading ──────────────────────────────────────────────────────

const configPath = join(PROJECT_ROOT, 'scripts', 'self-test-configs', `${epicId}.json`);
if (!existsSync(configPath)) {
  console.log(`No self-test config found at ${configPath}. Skipping.`);
  process.exit(0);
}

/** @type {import('./self-test-configs/schema').SelfTestConfig} */
const config = JSON.parse(readFileSync(configPath, 'utf-8'));

const breakpoints = config.breakpoints || [390, 768, 1440];
const BREAKPOINT_NAMES = { 390: 'mobile', 768: 'tablet', 1440: 'desktop' };

// ── Report Setup ────────────────────────────────────────────────────────

const reportDir = join(PROJECT_ROOT, '.ai-reports', 'screenshots', 'ralph-verification', epicId);
mkdirSync(reportDir, { recursive: true });

const results = {
  epic: epicId,
  timestamp: new Date().toISOString(),
  pages: [],
  blockFailures: 0,
  warnings: 0,
  passes: 0,
};

// ── Dev Server Lifecycle ────────────────────────────────────────────────

let serverProcess = null;

/** Check if dev server is responding */
async function isServerReady() {
  try {
    const resp = await fetch(`http://localhost:${port}`, { signal: AbortSignal.timeout(3000) });
    return resp.status < 500;
  } catch {
    return false;
  }
}

/** Start dev server and wait until ready */
async function startServer() {
  if (await isServerReady()) {
    console.log(`Dev server already running on port ${port}`);
    return;
  }

  console.log(`Starting dev server on port ${port}...`);
  serverProcess = spawn('npm', ['run', 'dev', '--', '--port', String(port)], {
    cwd: PROJECT_ROOT,
    stdio: 'pipe',
    env: { ...process.env, PORT: String(port) },
  });

  // Capture stderr for debugging but don't clutter stdout
  serverProcess.stderr.on('data', () => {});
  serverProcess.stdout.on('data', () => {});

  // Poll until ready (max 60s)
  const maxWait = 60_000;
  const pollInterval = 2_000;
  let waited = 0;

  while (waited < maxWait) {
    await new Promise((r) => setTimeout(r, pollInterval));
    waited += pollInterval;
    if (await isServerReady()) {
      console.log(`Dev server ready after ${waited / 1000}s`);
      return;
    }
  }

  throw new Error(`Dev server failed to start within ${maxWait / 1000}s`);
}

/** Kill the dev server if we started it */
function stopServer() {
  if (serverProcess) {
    console.log('Stopping dev server...');
    serverProcess.kill('SIGTERM');
    serverProcess = null;
  }
}

// ── Test Execution ──────────────────────────────────────────────────────

/**
 * Run structural DOM checks for a page at a given breakpoint
 * @returns {{ passes: string[], failures: string[], warnings: string[] }}
 */
async function runStructuralChecks(page, checks) {
  const passes = [];
  const failures = [];
  const warnings = [];

  for (const check of checks) {
    const { selector, contains, severity = 'block' } = check;
    try {
      const element = await page.$(selector);
      if (!element) {
        const msg = `Selector not found: ${selector}`;
        if (severity === 'block') failures.push(msg);
        else warnings.push(msg);
        continue;
      }

      if (contains) {
        const text = await element.textContent();
        if (!text || !text.includes(contains)) {
          const msg = `Text mismatch in ${selector}: expected "${contains}", got "${(text || '').slice(0, 80)}"`;
          if (severity === 'block') failures.push(msg);
          else warnings.push(msg);
          continue;
        }
      }

      passes.push(`${selector}${contains ? ` contains "${contains}"` : ''}`);
    } catch (err) {
      const msg = `Error checking ${selector}: ${err.message}`;
      if (severity === 'block') failures.push(msg);
      else warnings.push(msg);
    }
  }

  return { passes, failures, warnings };
}

/**
 * Run interaction tests (click, keyboard)
 * @returns {{ passes: string[], failures: string[], warnings: string[] }}
 */
async function runInteractionTests(page, interactions) {
  const passes = [];
  const failures = [];
  const warnings = [];

  for (const interaction of interactions) {
    const { action, selector, key, severity = 'warn' } = interaction;

    try {
      if (action === 'click') {
        const el = await page.$(selector);
        if (!el) {
          const msg = `Interaction target not found: ${selector}`;
          if (severity === 'block') failures.push(msg);
          else warnings.push(msg);
          continue;
        }
        await el.click();
        passes.push(`click: ${selector}`);
      } else if (action === 'keyboard') {
        await page.keyboard.press(key);
        passes.push(`keyboard: ${key}`);
      } else if (action === 'focus') {
        const el = await page.$(selector);
        if (!el) {
          const msg = `Focus target not found: ${selector}`;
          if (severity === 'block') failures.push(msg);
          else warnings.push(msg);
          continue;
        }
        await el.focus();
        passes.push(`focus: ${selector}`);
      }
    } catch (err) {
      const msg = `Interaction "${action}" on ${selector || key}: ${err.message}`;
      if (severity === 'block') failures.push(msg);
      else warnings.push(msg);
    }
  }

  return { passes, failures, warnings };
}

/**
 * Inject axe-core and run a11y checks
 * @returns {{ violations: object[], passes: number }}
 */
async function runA11yChecks(page) {
  try {
    // Inject axe-core from CDN
    await page.addScriptTag({
      url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js',
    });

    // Wait for axe to load
    await page.waitForFunction(() => typeof window.axe !== 'undefined', { timeout: 10_000 });

    // Run axe
    const axeResults = await page.evaluate(async () => {
      const results = await window.axe.run(document, {
        runOnly: ['wcag2a', 'wcag2aa'],
      });
      return {
        violations: results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.length,
        })),
        passes: results.passes.length,
      };
    });

    return axeResults;
  } catch (err) {
    return { violations: [{ id: 'axe-error', impact: 'unknown', description: err.message, nodes: 0 }], passes: 0 };
  }
}

// ── Main Test Runner ────────────────────────────────────────────────────

async function main() {
  // Start server if needed
  if (!noServer) {
    await startServer();
  }

  const browser = await chromium.launch({ headless: true });

  // If any page URL starts with /admin, get auth token via API and inject as cookie
  const needsAuth = config.pages.some((p) => p.url.startsWith('/admin'));
  let storageState = undefined;
  if (needsAuth) {
    try {
      const loginRes = await fetch(`http://localhost:${port}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'admin@test.com', password: 'Test1234!' }),
      });
      if (loginRes.ok) {
        const data = await loginRes.json();
        const token = data.token;
        if (token) {
          storageState = {
            cookies: [{
              name: 'payload-token',
              value: token,
              domain: 'localhost',
              path: '/',
              httpOnly: true,
              secure: false,
              sameSite: 'Lax',
              expires: -1,
            }],
            origins: [],
          };
          console.log('Admin auth: logged in via API');
        }
      }
    } catch (err) {
      console.warn('Admin login failed (test user may not exist):', err.message);
    }
  }

  try {
    for (const pageConfig of config.pages) {
      const { url, name, structuralChecks = [], interactions = [], consoleErrorsAllowed = true } = pageConfig;
      const fullUrl = `http://localhost:${port}${url}`;

      console.log(`\n── Testing: ${name} (${url}) ──`);

      const pageResult = {
        name,
        url,
        breakpoints: [],
        consoleErrors: [],
        a11y: null,
      };

      for (const bp of breakpoints) {
        const bpName = BREAKPOINT_NAMES[bp] || `${bp}px`;
        console.log(`  ${bpName} (${bp}px)...`);

        const context = await browser.newContext({
          viewport: { width: bp, height: 900 },
          ...(storageState ? { storageState } : {}),
        });
        const page = await context.newPage();

        // Capture console errors
        const consoleErrors = [];
        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });

        // Navigate
        try {
          await page.goto(fullUrl, { waitUntil: 'domcontentloaded', timeout: 60_000 });
          // Allow time for client-side hydration and rendering
          await page.waitForTimeout(3000);
        } catch (err) {
          pageResult.breakpoints.push({
            width: bp,
            name: bpName,
            screenshot: null,
            structural: { passes: [], failures: [`Page failed to load: ${err.message}`], warnings: [] },
            interactions: { passes: [], failures: [], warnings: [] },
          });
          results.blockFailures++;
          await context.close();
          continue;
        }

        // Screenshot
        const screenshotPath = join(reportDir, `${name}-${bpName}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });

        // Structural checks
        const structural = await runStructuralChecks(page, structuralChecks);

        // Interaction tests
        const interactionResults = interactions.length > 0
          ? await runInteractionTests(page, interactions)
          : { passes: [], failures: [], warnings: [] };

        // Record console errors
        if (consoleErrors.length > 0) {
          pageResult.consoleErrors.push(...consoleErrors.map((e) => `[${bpName}] ${e}`));
        }

        // Tally
        results.passes += structural.passes.length + interactionResults.passes.length;
        results.blockFailures += structural.failures.length + interactionResults.failures.length;
        results.warnings += structural.warnings.length + interactionResults.warnings.length;

        pageResult.breakpoints.push({
          width: bp,
          name: bpName,
          screenshot: `${name}-${bpName}.png`,
          structural,
          interactions: interactionResults,
        });

        await context.close();
      }

      // A11y checks (only at desktop width)
      if (config.a11y) {
        console.log('  Running axe-core a11y...');
        const a11yContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
        const a11yPage = await a11yContext.newPage();

        try {
          await a11yPage.goto(fullUrl, { waitUntil: 'networkidle', timeout: 30_000 });
          pageResult.a11y = await runA11yChecks(a11yPage);
        } catch {
          pageResult.a11y = { violations: [{ id: 'load-error', impact: 'unknown', description: 'Page failed to load for a11y check', nodes: 0 }], passes: 0 };
        }

        await a11yContext.close();
      }

      // Console errors as warnings or blocks
      if (!consoleErrorsAllowed && pageResult.consoleErrors.length > 0) {
        results.warnings += pageResult.consoleErrors.length;
      }

      results.pages.push(pageResult);
    }
  } finally {
    await browser.close();
    stopServer();
  }

  // ── Generate Report ─────────────────────────────────────────────────

  const report = generateReport(results);
  const reportPath = join(reportDir, 'report.md');
  writeFileSync(reportPath, report, 'utf-8');
  console.log(`\nReport written to: ${reportPath}`);

  // ── Exit Code ───────────────────────────────────────────────────────

  if (results.blockFailures > 0) {
    console.log(`\n❌ FAILED: ${results.blockFailures} structural failure(s)`);
    process.exit(1);
  } else if (results.warnings > 0) {
    console.log(`\n⚠️  PASSED with ${results.warnings} warning(s)`);
    process.exit(0);
  } else {
    console.log(`\n✅ ALL CHECKS PASSED (${results.passes} checks)`);
    process.exit(0);
  }
}

// ── Report Generation ─────────────────────────────────────────────────

function generateReport(results) {
  const lines = [];
  lines.push(`# Self-Test Report: ${results.epic}`);
  lines.push(`Generated: ${results.timestamp}`);
  lines.push('');
  lines.push(`## Summary`);
  lines.push(`- Passes: ${results.passes}`);
  lines.push(`- Block failures: ${results.blockFailures}`);
  lines.push(`- Warnings: ${results.warnings}`);
  lines.push(`- Result: **${results.blockFailures > 0 ? 'FAILED' : 'PASSED'}**`);
  lines.push('');

  for (const page of results.pages) {
    lines.push(`## ${page.name} (${page.url})`);
    lines.push('');

    for (const bp of page.breakpoints) {
      lines.push(`### ${bp.name} (${bp.width}px)`);
      if (bp.screenshot) {
        lines.push(`Screenshot: \`${bp.screenshot}\``);
      }
      lines.push('');

      // Structural results
      if (bp.structural.failures.length > 0) {
        lines.push('**Structural Failures (BLOCK):**');
        bp.structural.failures.forEach((f) => lines.push(`- ❌ ${f}`));
        lines.push('');
      }
      if (bp.structural.warnings.length > 0) {
        lines.push('**Structural Warnings:**');
        bp.structural.warnings.forEach((w) => lines.push(`- ⚠️  ${w}`));
        lines.push('');
      }
      if (bp.structural.passes.length > 0) {
        lines.push('**Structural Passes:**');
        bp.structural.passes.forEach((p) => lines.push(`- ✅ ${p}`));
        lines.push('');
      }

      // Interaction results
      if (bp.interactions.failures.length > 0) {
        lines.push('**Interaction Failures:**');
        bp.interactions.failures.forEach((f) => lines.push(`- ❌ ${f}`));
        lines.push('');
      }
      if (bp.interactions.passes.length > 0) {
        lines.push('**Interaction Passes:**');
        bp.interactions.passes.forEach((p) => lines.push(`- ✅ ${p}`));
        lines.push('');
      }
    }

    // Console errors
    if (page.consoleErrors.length > 0) {
      lines.push('### Console Errors');
      page.consoleErrors.forEach((e) => lines.push(`- ${e}`));
      lines.push('');
    }

    // A11y
    if (page.a11y) {
      lines.push('### Accessibility (axe-core)');
      lines.push(`- Rules passed: ${page.a11y.passes}`);
      if (page.a11y.violations.length > 0) {
        lines.push(`- Violations: ${page.a11y.violations.length}`);
        page.a11y.violations.forEach((v) => {
          lines.push(`  - [${v.impact}] ${v.id}: ${v.description} (${v.nodes} node${v.nodes === 1 ? '' : 's'})`);
        });
      } else {
        lines.push('- No violations found');
      }
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ── Run ───────────────────────────────────────────────────────────────

main().catch((err) => {
  console.error('Self-test runner error:', err.message);
  stopServer();
  process.exit(1);
});
