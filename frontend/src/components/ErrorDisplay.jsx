/**
 * ErrorDisplay — Shows API or validation errors with a retry option.
 *
 * Design: Red-tinted glass card with a clear message and retry button.
 * The dismiss button (×) lets users close the error and try again.
 */

export default function ErrorDisplay({ message, onRetry, onDismiss }) {
  return (
    <div
      className="animate-fade-in-up rounded-2xl border border-red-500/20 bg-red-500/5 p-5"
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Error icon */}
        <div className="shrink-0 mt-0.5 h-5 w-5 text-red-400">
          <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Message */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-red-300">
            Something went wrong
          </h3>
          <p className="mt-1 text-sm text-red-200/70">
            {message || 'An unexpected error occurred. Please try again.'}
          </p>

          {/* Actions */}
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-red-300 hover:text-red-200 transition-colors cursor-pointer"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 12a9 9 0 11-6.219-8.56" />
                <polyline points="21 3 21 9 15 9" />
              </svg>
              Try again
            </button>
          )}
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 text-red-400/60 hover:text-red-300 transition-colors cursor-pointer"
            aria-label="Dismiss error"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
