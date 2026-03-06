/**
 * @description
 * Storybook main configuration for FRAS Canada.
 * Uses @storybook/react-vite framework to avoid conflicts with
 * Payload CMS's withPayload Next.js wrapper.
 *
 * @dependencies
 * - @storybook/react-vite: Vite-based React framework
 * - @storybook/addon-essentials: Controls, actions, docs, viewport
 * - @storybook/addon-a11y: WCAG 2.1 AA accessibility checks
 * - @storybook/addon-interactions: Play function testing
 *
 * @notes
 * - Stories are co-located next to components (src/**\/*.stories.tsx)
 * - Vite config in vite.config.ts handles Tailwind CSS v4
 * - Path alias @/* maps to src/* matching tsconfig.json
 */
import type { StorybookConfig } from '@storybook/react-vite'
import path from 'node:path'

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],

  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-interactions',
  ],

  framework: {
    name: '@storybook/react-vite',
    options: {},
  },

  staticDirs: ['../public'],

  viteFinal: async (config) => {
    // Match tsconfig.json path aliases
    config.resolve = config.resolve || {}
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      // Mock @payloadcms/ui hooks for admin component stories
      '@payloadcms/ui': path.resolve(__dirname, 'mocks/payloadcms-ui.tsx'),
    }
    return config
  },
}

export default config
