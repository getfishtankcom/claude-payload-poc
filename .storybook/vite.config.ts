/**
 * @description
 * Vite configuration for Storybook's build pipeline.
 * Enables Tailwind CSS v4 via @tailwindcss/vite plugin.
 *
 * @dependencies
 * - @tailwindcss/vite: Tailwind CSS v4 Vite integration
 * - vite: Build tool (used by @storybook/react-vite)
 *
 * @notes
 * - This config is ONLY used by Storybook, not by Next.js
 * - Next.js uses @tailwindcss/postcss instead (see postcss.config.mjs)
 * - The @tailwindcss/vite plugin scans source files for utility classes
 *   and processes globals.css @theme inline tokens
 */
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
