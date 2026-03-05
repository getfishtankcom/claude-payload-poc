/**
 * @description
 * Responsive testing script using Playwright.
 * Tests all pages at 4 breakpoints (390px, 768px, 1024px, 1440px)
 * for horizontal overflow and captures screenshots.
 *
 * Run: node scripts/responsive-check.mjs
 */
import { chromium } from 'playwright'
import { mkdirSync, existsSync } from 'fs'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const SCREENSHOT_DIR = '.ai-reports/screenshots/responsive'

const PAGES = [
  { name: 'homepage', path: '/' },
  { name: 'board-detail', path: '/boards/acsb' },
  { name: 'active-projects', path: '/active-projects' },
  { name: 'open-consultations', path: '/open-consultations' },
  { name: 'search', path: '/search' },
]

const BREAKPOINTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 768 },
  { name: 'desktop', width: 1440, height: 900 },
]

if (!existsSync(SCREENSHOT_DIR)) {
  mkdirSync(SCREENSHOT_DIR, { recursive: true })
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const issues = []
  let totalChecks = 0

  for (const page of PAGES) {
    for (const bp of BREAKPOINTS) {
      totalChecks++
      const context = await browser.newContext({
        viewport: { width: bp.width, height: bp.height },
      })
      const tab = await context.newPage()

      try {
        await tab.goto(`${BASE_URL}${page.path}`, { waitUntil: 'networkidle', timeout: 15000 })
        await tab.waitForTimeout(500)

        // Check for horizontal overflow
        const hasOverflow = await tab.evaluate(() => {
          return document.documentElement.scrollWidth > document.documentElement.clientWidth
        })

        if (hasOverflow) {
          const scrollWidth = await tab.evaluate(() => document.documentElement.scrollWidth)
          const clientWidth = await tab.evaluate(() => document.documentElement.clientWidth)
          issues.push(`${page.name} @ ${bp.name} (${bp.width}px): horizontal overflow (${scrollWidth}px > ${clientWidth}px)`)
        }

        // Check touch targets at mobile
        if (bp.name === 'mobile') {
          const smallTargets = await tab.evaluate(() => {
            const interactive = document.querySelectorAll('a, button, input, select, textarea, [role="button"]')
            const small = []
            for (const el of interactive) {
              const rect = el.getBoundingClientRect()
              if (rect.width > 0 && rect.height > 0 && (rect.width < 44 || rect.height < 44)) {
                // Only flag visible elements
                const style = window.getComputedStyle(el)
                if (style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0') {
                  small.push(`${el.tagName.toLowerCase()}${el.textContent?.trim().slice(0, 30) ? ` "${el.textContent.trim().slice(0, 30)}"` : ''}  (${Math.round(rect.width)}x${Math.round(rect.height)})`)
                }
              }
            }
            return small.slice(0, 5) // limit output
          })

          if (smallTargets.length > 0) {
            issues.push(`${page.name} @ mobile: ${smallTargets.length} small touch targets: ${smallTargets.join(', ')}`)
          }
        }

        // Screenshot
        await tab.screenshot({
          path: `${SCREENSHOT_DIR}/${page.name}-${bp.name}.png`,
          fullPage: true,
        })

        console.log(`  ✓ ${page.name} @ ${bp.name} (${bp.width}px)`)
      } catch (err) {
        issues.push(`${page.name} @ ${bp.name}: page load error — ${err.message}`)
        console.log(`  ✗ ${page.name} @ ${bp.name} — ${err.message}`)
      }

      await context.close()
    }
  }

  await browser.close()

  console.log(`\n${totalChecks} checks completed.`)
  if (issues.length > 0) {
    console.log(`\n⚠️  ${issues.length} issues found:`)
    issues.forEach((issue) => console.log(`  - ${issue}`))
  } else {
    console.log('\n✅ No responsive issues found.')
  }
}

main().catch(console.error)
