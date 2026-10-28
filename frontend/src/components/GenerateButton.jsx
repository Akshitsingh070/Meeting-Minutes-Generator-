/**
 * GenerateButton — The primary CTA to trigger meeting minutes generation.
 *
 * Shows a spinner inside the button during loading,
 * and disables when input is invalid or processing.
 */

export default function GenerateButton({ onClick, loading, disabled }) {
  return (
    <button
      id="generate-button"
      className="btn-generate w-full sm:w-auto"
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading}
    >
      {loading ? (
        <>
          <span>
            <svg
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
          <span>Generating...</span>
        </>
      ) : (
        <>
          <span>
            {/* Sparkle icon */}
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
            </svg>
          </span>
          <span>Generate Minutes</span>
        </>
      )}
    </button>
  )
}
