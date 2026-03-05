/**
 * @description
 * Placeholder homepage for the FRAS Canada frontend.
 * Will be replaced with the full homepage layout in Epic 4.
 *
 * @notes
 * - Uses design token classes to verify Tailwind v4 integration
 * - Demonstrates Container component usage pattern
 */
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero placeholder — verifies gradient token */}
      <div className="hero-gradient py-16 px-6">
        <div className="mx-auto max-w-[1440px]">
          <h1 className="text-4xl font-black text-white">FRAS Canada</h1>
          <p className="mt-4 text-lg text-white/80">
            Financial Reporting &amp; Assurance Standards
          </p>
        </div>
      </div>

      {/* Content placeholder — verifies design token classes */}
      <div className="mx-auto max-w-[1440px] px-6 py-12">
        <h2 className="text-3xl font-black text-primary">Scaffold Complete</h2>
        <p className="mt-4 text-base leading-relaxed">
          Next.js 15 + Payload CMS 3.x + Tailwind CSS v4 foundation is ready.
          Visit <Link href="/admin" className="text-primary underline">/admin</Link> to
          access the Payload CMS dashboard.
        </p>
      </div>
    </div>
  )
}
