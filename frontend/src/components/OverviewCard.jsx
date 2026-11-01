export default function OverviewCard({ summary, loading }) {
  return (
    <div className="card-white p-6 transition-all hover:border-[#ded7f3]">
      <h2 className="text-sm font-bold text-[#181925] tracking-tight mb-2.5">
        Overview
      </h2>
      {loading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-3.5 bg-slate-200 rounded w-full" />
          <div className="h-3.5 bg-slate-200 rounded w-5/6" />
          <div className="h-3.5 bg-slate-200 rounded w-3/4" />
        </div>
      ) : (
        <p className="text-xs sm:text-[13px] text-[#4b5162] leading-relaxed">
          {summary ||
            'The team reviewed project progress, with backend and frontend development nearing completion. We discussed the third-party API integration, agreed on priorities, and outlined the next steps for launch.'}
        </p>
      )}
    </div>
  )
}

