/**
 * TranscriptInput — The main textarea where users paste their meeting notes.
 *
 * Features:
 * - Character count with visual feedback (turns red near limit)
 * - Placeholder with example text to guide the user
 * - Disabled state during processing
 */

const MAX_LENGTH = 50000
const MIN_LENGTH = 20

export default function TranscriptInput({ value, onChange, disabled }) {
  const charCount = value.length
  const isNearLimit = charCount > MAX_LENGTH * 0.9
  const isTooShort = charCount > 0 && charCount < MIN_LENGTH

  return (
    <div className="space-y-3">
      <label
        htmlFor="transcript-input"
        className="block text-sm font-medium text-slate-300"
      >
        Meeting Transcript or Notes
      </label>

      <textarea
        id="transcript-input"
        className="transcript-textarea"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={`Paste your meeting notes or transcript here...\n\nExample:\n"Rahul said the website should launch by November 15.\nPriya will handle the frontend.\nAman will configure deployment.\nThe team agreed to use AWS for hosting."`}
        maxLength={MAX_LENGTH}
        rows={10}
      />

      {/* Character count & validation feedback */}
      <div className="flex items-center justify-between text-xs">
        <div>
          {isTooShort && (
            <span className="text-amber-400">
              ⚠ Minimum {MIN_LENGTH} characters required ({MIN_LENGTH - charCount} more needed)
            </span>
          )}
        </div>
        <span
          className={`tabular-nums transition-colors duration-200 ${
            isNearLimit
              ? 'text-red-400 font-medium'
              : 'text-slate-500'
          }`}
        >
          {charCount.toLocaleString()} / {MAX_LENGTH.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

export { MIN_LENGTH, MAX_LENGTH }
