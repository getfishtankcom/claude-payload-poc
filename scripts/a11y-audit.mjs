/**
 * @description
 * Accessibility audit script using axe-core via Playwright.
 * Tests all pages for WCAG 2.1 AA violations and reports results.
 *
 * Run: node scripts/a11y-audit.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, writeFileSync } from 'fs'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'board-detail', path: '/boards/acsb' },
  { name: 'active-projects', path: '/active-projects' },
  { name: 'open-consultations', path: '/open-consultations' },
  { name: 'search', path: '/search' },
]

async function main() {
  const browser = await chromium.launch({ headless: true })
  const allResults = []
  let totalCritical = 0
  let totalSerious = 0

  for (const pageInfo of PAGES) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
    const page = await context.newPage()

    try {
      await page.goto(`${BASE_URL}${pageInfo.path}`, { waitUntil: 'networkidle', timeout: 15000 })
      await page.waitForTimeout(1000)

      // Inject axe-core
      await page.addScriptTag({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.10.2/axe.min.js',
      })

      // Run axe
      const results = await page.evaluate(async () => {
        // @ts-ignore
        const axeResults = await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa', 'best-practice'],
          },
        })
        return {
          violations: axeResults.violations.map((v) => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.length,
            nodeDetails: v.nodes.slice(0, 3).map((n) => ({
              html: n.html,
              target: n.target,
              failureSummary: n.failureSummary,
            })),
          })),
          passes: axeResults.passes.length,
          incomplete: axeResults.incomplete.length,
        }
      })

      const critical = results.violations.filter((v) => v.impact === 'critical')
      const serious = results.violations.filter((v) => v.impact === 'serious')
      const moderate = results.violations.filter((v) => v.impact === 'moderate')
      const minor = results.violations.filter((v) => v.impact === 'minor')

      totalCritical += critical.length
      totalSerious += serious.length

      console.log(`\n📄 ${pageInfo.name} (${pageInfo.path})`)
      console.log(`   ✅ ${results.passes} rules passed`)
      if (critical.length) {
        console.log(`   🔴 ${critical.length} critical:`)
        critical.forEach((v) => console.log(`      - ${v.id}: ${v.help} (${v.nodes} nodes)`))
      }
      if (serious.length) {
        console.log(`   🟠 ${serious.length} serious:`)
        serious.forEach((v) => console.log(`      - ${v.id}: ${v.help} (${v.nodes} nodes)`))
      }
      if (moderate.length) {
        console.log(`   🟡 ${moderate.length} moderate:`)
        moderate.forEach((v) => console.log(`      - ${v.id}: ${v.help} (${v.nodes} nodes)`))
      }
      if (minor.length) {
        console.log(`   ⚪ ${minor.length} minor:`)
        minor.forEach((v) => console.log(`      - ${v.id}: ${v.help} (${v.nodes} nodes)`))
      }
      if (!results.violations.length) {
        console.log('   🎉 No violations found!')
      }

      allResults.push({ page: pageInfo.name, ...results })
    } catch (err) {
      console.log(`\n📄 ${pageInfo.name}: Error — ${err.message}`)
    }

    await context.close()
  }

  await browser.close()

  // Write report
  mkdirSync('.ai-reports', { recursive: true })
  writeFileSync(
    '.ai-reports/a11y-audit-report.json',
    JSON.stringify(allResults, null, 2),
  )

  console.log(`\n${'='.repeat(50)}`)
  console.log(`Total: ${totalCritical} critical, ${totalSerious} serious`)
  if (totalCritical === 0 && totalSerious === 0) {
    console.log('✅ WCAG 2.1 AA: No critical or serious violations')
  } else {
    console.log('❌ WCAG 2.1 AA: Critical/serious violations found')
    process.exit(1)
  }
}

main().catch(console.error)
