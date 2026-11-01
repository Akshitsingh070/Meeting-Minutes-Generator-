export default function DashboardTabs({ activeTab = 'summary', onSelectTab }) {
  return (
    <div className="card-white p-1.5 inline-flex items-center gap-1.5 mb-6">
      <button
        onClick={() => onSelectTab('summary')}
        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          activeTab === 'summary'
            ? 'bg-[#ede7fc] text-[#622ad4] shadow-xs'
            : 'text-[#64687a] hover:text-[#181925] hover:bg-[#faf9fd]'
        }`}
      >
        Summary
      </button>

      <button
        onClick={() => onSelectTab('transcript')}
        className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
          activeTab === 'transcript'
            ? 'bg-[#ede7fc] text-[#622ad4] shadow-xs'
            : 'text-[#64687a] hover:text-[#181925] hover:bg-[#faf9fd]'
        }`}
      >
        Transcript Notes
      </button>
    </div>
  )
}

