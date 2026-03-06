/**
 * @description
 * Storybook preview configuration — global decorators, viewports, and CSS.
 * Imports globals.css to load all Tailwind CSS v4 design tokens and utilities.
 *
 * @dependencies
 * - globals.css: Tailwind v4 @theme inline tokens
 *
 * @notes
 * - Viewport presets match wireframe breakpoints: 390px mobile, 768px tablet, 1440px desktop
 * - Inter font loaded via Google Fonts link in preview-head.html since next/font
 *   doesn't auto-load in Storybook's Vite environment
 * - a11y addon configured with color-contrast rule enabled
 */
import type { Preview } from '@storybook/react'

// Load all Tailwind CSS v4 design tokens and base styles
import '../src/app/(frontend)/[locale]/(frontend)/globals.css'

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    // Wireframe-matched viewport presets
    viewport: {
      viewports: {
        mobile: {
          name: 'Mobile (390px)',
          styles: { width: '390px', height: '844px' },
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
        },
        desktop: {
          name: 'Desktop (1440px)',
          styles: { width: '1440px', height: '900px' },
        },
      },
    },

    // Accessibility checks
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
}

export default preview
