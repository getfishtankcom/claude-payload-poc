/**
 * @description
 * Visual showcase of every Admin Shell v2 design token. Renders swatches for
 * brand, surface, text, border, workflow, lock, and language tokens so authors
 * and developers can verify token values at a glance.
 *
 * @notes
 * - Pure-presentation component. No data fetching, no state.
 * - Consumed by Storybook in a future issue (`BrandTokensShowcase.stories.tsx`)
 *   once Storybook is wired into the admin shell. Until then it's renderable
 *   from any admin route as a smoke screen.
 * - All colors are read via CSS variables so updating tokens propagates here.
 */

import * as React from 'react'

type Swatch = {
  name: string
  cssVar: string
  textOn?: 'light' | 'dark'
}

type Group = {
  title: string
  swatches: Swatch[]
}

const GROUPS: Group[] = [
  {
    title: 'Brand',
    swatches: [
      { name: 'brand-fras', cssVar: '--brand-fras', textOn: 'dark' },
      { name: 'brand-fras-tint', cssVar: '--brand-fras-tint', textOn: 'dark' },
      { name: 'brand-fras-shade', cssVar: '--brand-fras-shade', textOn: 'dark' },
      { name: 'brand-councils', cssVar: '--brand-councils', textOn: 'dark' },
      { name: 'brand-councils-tint', cssVar: '--brand-councils-tint', textOn: 'dark' },
      { name: 'brand-boards', cssVar: '--brand-boards', textOn: 'dark' },
      { name: 'brand-boards-tint', cssVar: '--brand-boards-tint', textOn: 'dark' },
      { name: 'brand-neutral', cssVar: '--brand-neutral', textOn: 'light' },
    ],
  },
  {
    title: 'Workflow states',
    swatches: [
      { name: 'workflow-draft', cssVar: '--workflow-draft', textOn: 'dark' },
      { name: 'workflow-review', cssVar: '--workflow-review', textOn: 'dark' },
      { name: 'workflow-revision', cssVar: '--workflow-revision', textOn: 'dark' },
      { name: 'workflow-approved', cssVar: '--workflow-approved', textOn: 'dark' },
      { name: 'workflow-published', cssVar: '--workflow-published', textOn: 'dark' },
    ],
  },
  {
    title: 'Lock & language',
    swatches: [
      { name: 'lock-locked', cssVar: '--lock-locked', textOn: 'dark' },
      { name: 'lock-unlocked', cssVar: '--lock-unlocked', textOn: 'dark' },
      { name: 'lang-missing', cssVar: '--lang-missing', textOn: 'dark' },
      { name: 'lang-complete', cssVar: '--lang-complete', textOn: 'dark' },
    ],
  },
]

const swatchStyle = (cssVar: string, textOn: 'light' | 'dark' = 'light'): React.CSSProperties => ({
  backgroundColor: `var(${cssVar})`,
  color: textOn === 'dark' ? 'var(--text-on-brand)' : 'var(--text-primary)',
  padding: '12px 14px',
  borderRadius: '6px',
  border: '1px solid var(--border-default)',
  fontSize: '12px',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  minHeight: '64px',
  justifyContent: 'space-between',
})

export const BrandTokensShowcase: React.FC = () => (
  <div
    style={{
      padding: '24px',
      backgroundColor: 'var(--surface-page)',
      color: 'var(--text-primary)',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}
  >
    <h1 style={{ fontSize: '20px', marginBottom: '4px' }}>Admin Shell v2 — Brand Tokens</h1>
    <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px' }}>
      All colors below resolve from CSS variables defined in <code>admin-tailwind.css</code>.
    </p>

    {GROUPS.map((group) => (
      <section key={group.title} style={{ marginBottom: '24px' }}>
        <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {group.title}
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '8px',
          }}
        >
          {group.swatches.map((s) => (
            <div key={s.cssVar} style={swatchStyle(s.cssVar, s.textOn)}>
              <strong>{s.name}</strong>
              <span>{s.cssVar}</span>
            </div>
          ))}
        </div>
      </section>
    ))}
  </div>
)

export default BrandTokensShowcase
