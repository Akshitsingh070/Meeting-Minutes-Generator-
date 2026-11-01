import { useState } from 'react'

export default function DashboardHeader({
  meetingTitle = 'meeting minutes generator',
  metaString = 'Mon, Nov 2, 2026 / 3:00 PM – 4:00 PM (60m) / Development',
  minutesData,
  rawTranscript,
  onNotification,
}) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (!minutesData && !rawTranscript) {
      if (onNotification) onNotification('Please generate or enter meeting minutes before sharing.')
      return
    }

    let shareText = `${meetingTitle.toUpperCase()}\n${metaString}\n\n`
    if (minutesData) {
      shareText += `OVERVIEW:\n${minutesData.summary || ''}\n\n`
      if (minutesData.decisions?.length) {
        shareText += `KEY DECISIONS:\n${minutesData.decisions.map((d) => `• ${d}`).join('\n')}\n\n`
      }
      if (minutesData.action_items?.length) {
        shareText += `ACTION ITEMS:\n${minutesData.action_items
          .map((item, i) => `${i + 1}. ${item.task} (Responsible: ${item.responsible || 'Unassigned'}, Deadline: ${item.deadline || 'None'})`)
          .join('\n')}\n\n`
      }
    } else {
      shareText += `TRANSCRIPT NOTES:\n${rawTranscript}`
    }

    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      if (onNotification) onNotification('Meeting summary copied to clipboard!')
      setTimeout(() => setCopied(false), 2500)
    } catch {
      if (onNotification) onNotification('Failed to copy to clipboard.')
    }
  }

  const handleExport = () => {
    if (!minutesData && !rawTranscript) {
      if (onNotification) onNotification('Please generate minutes to export.')
      return
    }

    let content = `# ${meetingTitle}\n`
    content += `*${metaString}*\n\n`
    if (minutesData) {
      content += `## Overview\n${minutesData.summary}\n\n`
      if (minutesData.participants?.length) {
        content += `## Participants\n${minutesData.participants.map((p) => `- ${p}`).join('\n')}\n\n`
      }
      if (minutesData.decisions?.length) {
        content += `## Key Decisions\n${minutesData.decisions.map((d) => `- ${d}`).join('\n')}\n\n`
      }
      if (minutesData.action_items?.length) {
        content += `## Action Items\n${minutesData.action_items
          .map((a, i) => `${i + 1}. **${a.task}** — Assigned: ${a.responsible || 'Not specified'} | Deadline: ${a.deadline || 'None'}`)
          .join('\n')}\n\n`
      }
    }

    if (rawTranscript) {
      content += `## Transcript\n\`\`\`\n${rawTranscript}\n\`\`\`\n`
    }

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `meeting-minutes-${new Date().toISOString().slice(0, 10)}.md`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    if (onNotification) onNotification('Downloaded minutes as Markdown (.md)!')
  }

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#eeebf5]/60">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-[#181925] tracking-tight lowercase">
          {meetingTitle}
        </h1>
        <p className="text-xs text-[#8c91a0] mt-1 font-medium">
          {metaString}
        </p>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={handleShare}
          className="btn-pill-light"
          title="Copy formatted summary to clipboard"
        >
          <svg className="h-3.5 w-3.5 text-[#64687a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
          <span>{copied ? 'Copied!' : 'Share'}</span>
        </button>

        <button
          onClick={handleExport}
          className="btn-pill-light"
          title="Export minutes as Markdown"
        >
          <svg className="h-3.5 w-3.5 text-[#64687a]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Export minutes</span>
        </button>
      </div>
    </header>
  )
}
