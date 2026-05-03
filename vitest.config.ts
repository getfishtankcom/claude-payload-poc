import { defineConfig } from 'vitest/config'
import path from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@payload-config': path.resolve(__dirname, 'src/payload.config.ts'),
      // next-intl's navigation helpers use bare 'next/navigation' which
      // Vitest's default resolver doesn't pick up; force the .js extension.
      'next/navigation': path.resolve(__dirname, 'node_modules/next/navigation.js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'storybook-static', 'tests/e2e/**'],
    server: {
      // next-intl ships ESM that bare-imports 'next/navigation'; Vite's
      // resolver can't find it without bundling the dep through Vite first.
      deps: {
        inline: ['next-intl'],
      },
    },
  },
})
