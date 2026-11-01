export default function MeetingInsightsCard({
  duration = '60 min',
  speakerCount = 5,
  actionCount = 3,
  sentiment = 'Balanced discussion · Clear outcomes · Positive sentiment',
}) {
  return (
    <div className="card-white p-6 transition-all hover:border-[#ded7f3]">
      <h2 className="text-sm font-bold text-[#181925] tracking-tight mb-3">
        Meeting insights
      </h2>

      {/* Stats Row */}
      <div className="flex flex-wrap items-center gap-2.5 mb-3">
        {/* Stat 1: Duration with blue focus outline like the mockup */}
        <div className="px-3.5 py-1.5 rounded-lg border border-[#0284c7] bg-[#f0f9ff]/40 text-xs font-semibold text-[#0369a1]">
          {duration}
        </div>

        {/* Stat 2: Speakers */}
        <div className="px-3.5 py-1.5 rounded-lg border border-[#eeebf5] bg-[#faf9fd] text-xs font-semibold text-[#424656]">
          {speakerCount} {speakerCount === 1 ? 'speaker' : 'speakers'}
        </div>

        {/* Stat 3: Actions (dashed border) */}
        <div className="px-3.5 py-1.5 rounded-lg border border-dashed border-[#d1cbe4] bg-[#faf9fd] text-xs font-semibold text-[#5122b1]">
          {actionCount} {actionCount === 1 ? 'action' : 'actions'}
        </div>
      </div>

      {/* Subtitle sentiment tags */}
      <p className="text-[11px] text-[#8c91a0] font-medium tracking-tight">
        {sentiment}
      </p>
    </div>
  )
}

