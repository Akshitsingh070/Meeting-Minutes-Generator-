/**
 * App — Root component for the Meeting Minutes Generator.
 *
 * Phase 4: Integrates React frontend with the FastAPI backend.
 *
 * State machine:
 *   idle → loading → success | error
 *   error → idle (retry/dismiss)
 *   success → idle (new generation)
 */

import { useState } from 'react'
import TranscriptInput, { MIN_LENGTH } from './components/TranscriptInput'
import GenerateButton from './components/GenerateButton'
import LoadingState from './components/LoadingState'
import ErrorDisplay from './components/ErrorDisplay'
import MeetingMinutes from './components/MeetingMinutes'
import { api } from './services/api'

export default function App() {
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const canGenerate = transcript.trim().length >= MIN_LENGTH && !loading

  /**
   * Send the transcript to the backend API and update state.
   */
  const handleGenerate = async () => {
    if (!canGenerate) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const minutes = await api.generateMinutes(transcript.trim())
      setResult(minutes)
    } catch (err) {
      setError(err.message || 'Failed to generate meeting minutes.')
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    handleGenerate()
  }

  const handleDismiss = () => {
    setError(null)
  }

  return (
    <div className="min-h-screen bg-surface-950">
      {/* ── Subtle background gradient ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(139,92,246,0.08) 0%, transparent 70%)',
        }}
      />

      {/* ── Main content ── */}
      <main className="relative max-w-2xl mx-auto px-4 py-12 sm:py-16">
        {/* ── Header ── */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-500/10 border border-accent-500/15 text-accent-300 text-xs font-medium mb-5">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l1.912 5.813a2 2 0 001.275 1.275L21 12l-5.813 1.912a2 2 0 00-1.275 1.275L12 21l-1.912-5.813a2 2 0 00-1.275-1.275L3 12l5.813-1.912a2 2 0 001.275-1.275L12 3z" />
            </svg>
            AI-Powered
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Meeting Minutes{' '}
            <span className="bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent">
              Generator
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
            Paste your meeting transcript below and let AI extract structured
            minutes — summary, decisions, action items, and more.
          </p>
        </header>

        {/* ── Input Section ── */}
        <div className="glass-card p-6 sm:p-8 mb-8">
          <TranscriptInput
            value={transcript}
            onChange={setTranscript}
            disabled={loading}
          />

          <div className="mt-5 flex justify-end">
            <GenerateButton
              onClick={handleGenerate}
              loading={loading}
              disabled={!canGenerate}
            />
          </div>
        </div>

        {/* ── Error State ── */}
        {error && (
          <div className="mb-8">
            <ErrorDisplay
              message={error}
              onRetry={handleRetry}
              onDismiss={handleDismiss}
            />
          </div>
        )}

        {/* ── Loading State ── */}
        {loading && (
          <div className="mb-8">
            <LoadingState />
          </div>
        )}

        {/* ── Results ── */}
        {result && !loading && (
          <MeetingMinutes data={result} />
        )}

        {/* ── Footer ── */}
        <footer className="mt-16 pt-6 border-t border-surface-800 text-center">
          <p className="text-xs text-slate-600">
            Meeting Minutes Generator · AI extracts only what is explicitly stated · Never invents information
          </p>
        </footer>
      </main>
    </div>
  )
}
