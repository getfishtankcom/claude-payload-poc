/**
 * @description
 * PostCSS configuration for Tailwind CSS v4.
 * Uses the @tailwindcss/postcss plugin which replaces
 * the v3-era tailwindcss + autoprefixer combo.
 */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
}

export default config
