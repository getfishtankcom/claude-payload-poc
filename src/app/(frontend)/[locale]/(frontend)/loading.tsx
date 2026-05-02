/**
 * @description
 * Loading skeleton shown during route transitions in the frontend layout group.
 * Displays a minimal pulsing placeholder while the page server component loads.
 *
 * @notes
 * - Next.js auto-wraps page components with this Suspense boundary
 * - Keeps the header/footer visible while content loads
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8 animate-pulse" data-testid="loading-skeleton">
      <div className="h-8 w-64 rounded bg-gray-200 mb-6" />
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-1/2 rounded bg-gray-200" />
      </div>
      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded bg-gray-200" />
        ))}
      </div>
    </div>
  )
}
