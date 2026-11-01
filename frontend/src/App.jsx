import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import LoginPage from './components/LoginPage'
import Sidebar from './components/Sidebar'
import DashboardHeader from './components/DashboardHeader'
import DashboardTabs from './components/DashboardTabs'
import OverviewCard from './components/OverviewCard'
import KeyPointsCard from './components/KeyPointsCard'
import ActionItemsCard from './components/ActionItemsCard'
import TranscriptCard, { DEFAULT_TRANSCRIPT_TEXT } from './components/TranscriptCard'
import MeetingInsightsCard from './components/MeetingInsightsCard'
import TopicsDiscussedCard from './components/TopicsDiscussedCard'
import ReadyBanner from './components/ReadyBanner'
import { api } from './services/api'

// Initial default minutes matching the user's mockup design
const INITIAL_MINUTES = {
  summary:
    'The team reviewed project progress, with backend and frontend development nearing completion. We discussed the third-party API integration, agreed on priorities, and outlined the next steps for launch.',
  participants: ['Rahul', 'Priya', 'Aman'],
  decisions: [
    'Backend development is on track, with authentication complete. Frontend dashboard redesign is ready for testing.',
    'Third-party API integration needs additional testing before launch.',
  ],
  action_items: [
    {
      task: 'Complete API integration testing',
      responsible: 'Engineering',
      deadline: 'Friday',
    },
    {
      task: 'Review dashboard UI',
      responsible: 'Design',
      deadline: 'Nov 15',
    },
    {
      task: 'Schedule a mid-week check-in',
      responsible: 'Product',
      deadline: null,
    },
  ],
}

export default function App() {
  const { isAuthenticated } = useAuth()
  const [activeNav, setActiveNav] = useState('home')
  const [activeTab, setActiveTab] = useState('summary')
  const [transcript, setTranscript] = useState(DEFAULT_TRANSCRIPT_TEXT)
  const [minutes, setMinutes] = useState(INITIAL_MINUTES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [toastMessage, setToastMessage] = useState(null)

  // Show login page if unauthenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr))
    }, 3200)
  }

  const canGenerate = transcript.trim().length >= 20 && !loading

  const handleGenerate = async () => {
    if (!canGenerate) return

    setLoading(true)
    setError(null)

    try {
      const data = await api.generateMinutes(transcript.trim())
      setMinutes(data)
      showToast('Meeting minutes successfully generated!')
    } catch (err) {
      setError(err.message || 'Failed to generate meeting minutes.')
    } finally {
      setLoading(false)
    }
  }

  const handleShareMinutes = () => {
    if (!minutes) return
    const text = `MEETING MINUTES\n\nOVERVIEW:\n${minutes.summary}\n\nACTION ITEMS:\n${(minutes.action_items || [])
      .map((a, i) => `${i + 1}. ${a.task} (${a.responsible || 'Unassigned'})`)
      .join('\n')}`

    navigator.clipboard.writeText(text).then(() => {
      showToast('Summary copied to clipboard!')
    })
  }

  // Derive speaker count and dynamic duration estimate
  const speakerCount = minutes?.participants?.length > 0 ? minutes.participants.length : 5
  const actionCount = minutes?.action_items?.length > 0 ? minutes.action_items.length : 3

  return (
    <div className="min-h-screen bg-[#f4f3f8] flex flex-row">
      {/* ── Left Navigation Sidebar ── */}
      <Sidebar activeNav={activeNav} onSelectNav={setActiveNav} />

      {/* ── Main Dashboard Workspace ── */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <DashboardHeader
            meetingTitle="meeting minutes generator"
            metaString="Mon, Nov 2, 2026 / 3:00 PM – 4:00 PM (60m) / Development"
            minutesData={minutes}
            rawTranscript={transcript}
            onNotification={showToast}
          />

          {/* Toast Notification Alert */}
          {toastMessage && (
            <div className="fixed top-5 right-5 z-50 bg-[#181925] text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-[#8c5bf5]" />
              <span>{toastMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-2.5">
                <svg className="h-4 w-4 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleGenerate}
                  className="font-semibold text-red-800 hover:underline"
                >
                  Retry
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-600 px-1"
                >
                  ×
                </button>
              </div>
            </div>
          )}

          {/* Tabs */}
          <DashboardTabs activeTab={activeTab} onSelectTab={setActiveTab} />

          {/* Tab 1: Summary Dashboard View (Matching Image) */}
          {activeTab === 'summary' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* ── Left Column (Overview, Key Points, Action Items) ── */}
              <div className="lg:col-span-7 space-y-6">
                <OverviewCard summary={minutes?.summary} loading={loading} />

                <KeyPointsCard
                  decisions={minutes?.decisions}
                  summary={minutes?.summary}
                  loading={loading}
                />

                <ActionItemsCard
                  actionItems={minutes?.action_items}
                  loading={loading}
                />
              </div>

              {/* ── Right Column (Transcript, Insights, Topics, Banner) ── */}
              <div className="lg:col-span-5 space-y-6">
                <TranscriptCard
                  transcript={transcript}
                  onChangeTranscript={setTranscript}
                  onGenerate={handleGenerate}
                  loading={loading}
                  canGenerate={canGenerate}
                />

                <MeetingInsightsCard
                  duration="60 min"
                  speakerCount={speakerCount}
                  actionCount={actionCount}
                  sentiment="Balanced discussion · Clear outcomes · Positive sentiment"
                />

                <TopicsDiscussedCard />

                <ReadyBanner onShare={handleShareMinutes} />
              </div>
            </div>
          )}

          {/* Tab 2: Full Transcript Notes View */}
          {activeTab === 'transcript' && (
            <div className="card-white p-6 sm:p-8 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-[#181925]">Full Meeting Transcript</h2>
                  <p className="text-xs text-[#64687a]">Paste notes or audio transcriptions below to extract minutes.</p>
                </div>
                <button
                  onClick={handleGenerate}
                  disabled={!canGenerate || loading}
                  className="btn-primary-purple text-xs"
                >
                  {loading ? 'Processing...' : 'Process Transcript'}
                </button>
              </div>

              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                disabled={loading}
                rows={16}
                className="w-full text-xs sm:text-sm font-mono text-[#181925] p-4 bg-[#faf9fd] rounded-2xl border border-[#ded7f3] focus:border-[#743cee] focus:outline-none transition-all"
                placeholder="Paste meeting transcript here..."
              />

              <div className="flex items-center justify-between text-xs text-[#8c91a0]">
                <span>{transcript.length.toLocaleString()} characters entered</span>
                <button
                  onClick={() => setTranscript(DEFAULT_TRANSCRIPT_TEXT)}
                  className="text-[#743cee] font-semibold hover:underline"
                >
                  Reset to demo transcript
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
