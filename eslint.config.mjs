/**
 * @description
 * ESLint flat config for Next.js 15 + TypeScript.
 * Extends next/core-web-vitals and next/typescript presets.
 *
 * @notes
 * - Adapted from Payload website template
 * - Uses FlatCompat for legacy config compatibility
 * - Relaxes @typescript-eslint rules to warnings during rapid development
 * - Ignores .next/ build output
 */
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Relax TS rules to warnings during rapid development
      '@typescript-eslint/ban-ts-comment': 'warn',
      '@typescript-eslint/no-empty-object-type': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['.next/'],
  },
]

export default eslintConfig
