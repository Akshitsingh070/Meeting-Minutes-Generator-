/**
 * MeetingMinutes — Renders the structured AI output.
 *
 * Sections:
 * 1. Summary — concise meeting overview
 * 2. Participants — names identified in the transcript
 * 3. Key Decisions — confirmed, agreed-upon decisions only
 * 4. Action Items — tasks with optional responsible person & deadline
 *
 * Each section fades in with a staggered delay for a polished feel.
 * Nullable fields (responsible, deadline) display "Not mentioned"
 * to preserve the anti-hallucination contract.
 */

export default function MeetingMinutes({ data }) {
  if (!data) return null

  const { summary, participants, decisions, action_items } = data

  return (
    <div className="space-y-5">
      {/* ── Section Header ── */}
      <div className="flex items-center gap-3 animate-fade-in-up">
        <div className="h-px flex-1 bg-gradient-to-r from-accent-500/40 to-transparent" />
        <h2 className="text-lg font-semibold text-white tracking-tight">
          Meeting Minutes
        </h2>
        <div className="h-px flex-1 bg-gradient-to-l from-accent-500/40 to-transparent" />
      </div>

      {/* ── Summary ── */}
      <section className="glass-card p-6 animate-fade-in-up stagger-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="section-badge">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            Summary
          </span>
        </div>
        <p className="text-sm leading-relaxed text-slate-300">
          {summary}
        </p>
      </section>

      {/* ── Participants ── */}
      {participants && participants.length > 0 && (
        <section className="glass-card p-6 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="section-badge">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" />
                <path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
              Participants
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {participants.map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full bg-accent-500/10 text-accent-200 border border-accent-500/15"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                {name}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* ── Key Decisions ── */}
      {decisions && decisions.length > 0 && (
        <section className="glass-card p-6 animate-fade-in-up stagger-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="section-badge">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="9 11 12 14 22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              Key Decisions
            </span>
          </div>
          <ul className="space-y-2.5">
            {decisions.map((decision, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                <span className="shrink-0 mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {decision}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Action Items ── */}
      {action_items && action_items.length > 0 && (
        <section className="glass-card p-6 animate-fade-in-up stagger-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="section-badge">
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              Action Items
            </span>
            <span className="text-xs text-slate-500 ml-auto">
              {action_items.length} {action_items.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          <div className="space-y-3">
            {action_items.map((item, i) => (
              <div
                key={i}
                className="rounded-xl border border-surface-600/60 bg-surface-900/40 p-4 transition-colors hover:border-accent-500/20"
              >
                {/* Task number + description */}
                <div className="flex items-start gap-3">
                  <span className="shrink-0 flex items-center justify-center h-6 w-6 rounded-lg bg-accent-500/15 text-accent-300 text-xs font-bold">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-slate-200 leading-relaxed">
                    {item.task}
                  </p>
                </div>

                {/* Responsible + Deadline */}
                <div className="mt-3 ml-9 flex flex-wrap gap-x-5 gap-y-2 text-xs">
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    <span className="text-slate-400">Responsible:</span>
                    <span className={item.responsible ? 'text-accent-300 font-medium' : 'text-slate-500 italic'}>
                      {item.responsible || 'Not mentioned'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="h-3.5 w-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span className="text-slate-400">Deadline:</span>
                    <span className={item.deadline ? 'text-amber-300 font-medium' : 'text-slate-500 italic'}>
                      {item.deadline || 'Not mentioned'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Empty state — nothing extracted ── */}
      {(!decisions || decisions.length === 0) &&
       (!action_items || action_items.length === 0) && (
        <div className="glass-card p-6 text-center animate-fade-in-up stagger-2">
          <p className="text-sm text-slate-400">
            No decisions or action items were identified in this transcript.
          </p>
        </div>
      )}
    </div>
  )
}
