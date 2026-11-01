export default function ReadyBanner({ onShare }) {
  return (
    <div className="card-banner-lilac p-5 flex items-center justify-between gap-4 transition-all hover:border-[#cfb9fd]">
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-[#5122b1] tracking-tight">
          Your meeting minutes are ready
        </h3>
        <p className="text-[11px] sm:text-xs text-[#743cee]/90 mt-0.5">
          Review your summary, then share it with your team.
        </p>
      </div>

      {onShare && (
        <button
          onClick={onShare}
          className="shrink-0 text-xs font-semibold text-[#5122b1] bg-white/80 hover:bg-white px-3 py-1.5 rounded-lg border border-[#ded4f8] transition-all shadow-xs"
        >
          Share
        </button>
      )}
    </div>
  )
}

