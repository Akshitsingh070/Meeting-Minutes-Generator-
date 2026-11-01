import { useState } from 'react'

export const DEFAULT_TRANSCRIPT_TEXT = `00:00 - Speaker 1 (Rahul)
Let's start with our project updates. Authentication is complete, and the dashboard redesign is ready for testing. Priya will lead the design review by Friday.

18:24 - Speaker 2 (Priya)
We'll focus on the API integration next. The team agreed to use AWS for production hosting. Let's finish testing and review progress at the mid-week check-in. Aman will configure the backend deployment by November 15.`

export default function TranscriptCard({
  transcript,
  onChangeTranscript,
  onGenerate,
  loading,
  canGenerate,
}) {
  const [isEditing, setIsEditing] = useState(false)

  // Parse speaker blocks if format matches timestamps
  const parseSpeakers = (text) => {
    if (!text) return []
    const lines = text.split('\n')
    const blocks = []
    let currentBlock = null

    for (const line of lines) {
      const match = line.match(/^(\d{1,2}:\d{2})\s*[-·]\s*(.+)$/)
      if (match) {
        if (currentBlock) blocks.push(currentBlock)
        currentBlock = {
          time: match[1],
          speaker: match[2],
          content: [],
        }
      } else if (currentBlock && line.trim()) {
        currentBlock.content.push(line.trim())
      }
    }
    if (currentBlock) blocks.push(currentBlock)
    return blocks
  }

  const speakerBlocks = parseSpeakers(transcript)

  return (
    <div className="card-transcript-gradient p-6 sm:p-7 relative transition-all hover:border-[#d6c9f7]">
      {/* Top Tag */}
      <span className="text-[10px] font-bold tracking-widest text-[#743cee] uppercase">
        MEETING TRANSCRIPT
      </span>

      {/* Main Heading */}
      <h2 className="text-xl sm:text-2xl font-bold text-[#181925] tracking-tight mt-1 mb-1">
        Your conversation, in writing.
      </h2>
      <p className="text-xs text-[#64687a] mb-5">
        A timestamped transcript of your meeting, ready to review.
      </p>

      {/* Transcript Content or Textarea Editor */}
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={transcript}
            onChange={(e) => onChangeTranscript(e.target.value)}
            disabled={loading}
            placeholder="Paste your meeting notes or transcript here (minimum 20 characters)..."
            rows={8}
            className="w-full text-xs sm:text-sm text-[#181925] p-3.5 bg-white/95 rounded-xl border border-[#ded7f3] focus:border-[#743cee] focus:outline-none transition-all resize-y"
          />
          <div className="flex items-center justify-between text-[11px] text-[#8c91a0]">
            <span>{transcript.length.toLocaleString()} characters</span>
            <button
              onClick={() => setIsEditing(false)}
              className="text-[#743cee] font-semibold hover:underline"
            >
              Done editing
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4 max-h-[260px] overflow-y-auto pr-1">
          {speakerBlocks.length > 0 ? (
            speakerBlocks.map((block, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-xs font-semibold text-[#181925]">
                  <span>{block.time}</span> <span className="text-[#8c91a0]">·</span>{' '}
                  <span className="text-[#5122b1]">{block.speaker}</span>
                </div>
                <p className="text-xs text-[#52576b] leading-relaxed">
                  {block.content.join(' ')}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[#52576b] leading-relaxed whitespace-pre-line">
              {transcript ||
                "00:00 · Speaker 1\nLet's start with our project updates. Authentication is complete, and the dashboard redesign is ready for testing.\n\n18:24 · Speaker 2\nWe'll focus on the API integration next. Let's finish testing and review progress at the mid-week check-in."}
            </p>
          )}
        </div>
      )}

      {/* Action footer inside card */}
      <div className="mt-6 pt-4 border-t border-[#ded7f3]/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-xs font-medium text-[#743cee] hover:text-[#5122b1] bg-white/70 hover:bg-white px-3 py-1.5 rounded-lg border border-[#ded7f3] transition-all"
          >
            {isEditing ? 'Preview Mode' : 'Edit Transcript'}
          </button>
          <button
            onClick={() => {
              onChangeTranscript(DEFAULT_TRANSCRIPT_TEXT)
              setIsEditing(false)
            }}
            className="text-xs text-[#64687a] hover:text-[#181925] px-2 py-1.5"
            title="Load sample transcript"
          >
            Load Sample
          </button>
        </div>

        <button
          onClick={onGenerate}
          disabled={!canGenerate || loading}
          className="btn-primary-purple text-xs py-2 px-4 shadow-sm"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
              </svg>
              <span>Generate Minutes</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

