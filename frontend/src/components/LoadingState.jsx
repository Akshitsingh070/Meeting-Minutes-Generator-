/**
 * LoadingState — Skeleton loading placeholder shown while
 * the AI is processing the transcript.
 *
 * Uses shimmer animation to indicate activity.
 * Mimics the shape of the final results to reduce layout shift.
 */

export default function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in-up" role="status" aria-label="Generating meeting minutes">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="h-5 w-5 rounded-full animate-shimmer" />
        <div className="h-5 w-40 rounded-lg animate-shimmer" />
      </div>

      {/* Summary skeleton */}
      <div className="glass-card p-6 animate-pulse-glow">
        <div className="h-4 w-24 rounded animate-shimmer mb-4" />
        <div className="space-y-2.5">
          <div className="h-3.5 w-full rounded animate-shimmer" />
          <div className="h-3.5 w-11/12 rounded animate-shimmer" />
          <div className="h-3.5 w-3/4 rounded animate-shimmer" />
        </div>
      </div>

      {/* Decisions skeleton */}
      <div className="glass-card p-6">
        <div className="h-4 w-28 rounded animate-shimmer mb-4" />
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <div className="h-3.5 w-3.5 rounded-full animate-shimmer mt-0.5 shrink-0" />
            <div className="h-3.5 w-4/5 rounded animate-shimmer" />
          </div>
          <div className="flex items-start gap-2">
            <div className="h-3.5 w-3.5 rounded-full animate-shimmer mt-0.5 shrink-0" />
            <div className="h-3.5 w-3/5 rounded animate-shimmer" />
          </div>
        </div>
      </div>

      {/* Action items skeleton */}
      <div className="glass-card p-6">
        <div className="h-4 w-32 rounded animate-shimmer mb-4" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-3 p-3 rounded-lg bg-surface-900/50">
              <div className="h-6 w-6 rounded-lg animate-shimmer shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-3/4 rounded animate-shimmer" />
                <div className="h-3 w-1/2 rounded animate-shimmer" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status text */}
      <p className="text-center text-sm text-slate-400 animate-pulse">
        ✨ AI is analyzing your transcript...
      </p>
    </div>
  )
}
