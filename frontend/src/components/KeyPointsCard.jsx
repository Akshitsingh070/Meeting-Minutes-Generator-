export default function KeyPointsCard({ decisions = [], loading }) {
  // Derive key point sections if decisions are provided from AI, or use fallback
  const firstPointTitle = decisions.length > 0 ? 'Agreed decisions' : 'Project progress'
  const firstPointContent = decisions.length > 0
    ? decisions.slice(0, 2).join(' ')
    : 'Backend development is on track, with authentication complete. Frontend dashboard redesign is ready for testing. The team shared positive feedback on the updated UI.'

  const secondPointTitle = decisions.length > 2 ? 'Additional decisions' : 'Challenges faced'
  const secondPointContent = decisions.length > 2
    ? decisions.slice(2).join(' ')
    : 'Third-party API integration needs additional testing. The team explored alternative solutions and agreed to resolve geolocation issues before the next sprint.'

  return (
    <div className="card-keypoints-gradient p-6 transition-all hover:border-[#ded7f3]">
      <h2 className="text-sm font-bold text-[#181925] tracking-tight mb-4">
        Key points
      </h2>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-pulse">
          <div className="card-white p-4 h-32 bg-slate-100" />
          <div className="card-white p-4 h-32 bg-slate-100" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Subcard 1 */}
          <div className="card-white p-4 sm:p-5 border border-[#eceaf2] shadow-xs">
            <h3 className="text-xs font-bold text-[#181925] mb-2">
              {firstPointTitle}
            </h3>
            <p className="text-xs text-[#52576b] leading-relaxed">
              {firstPointContent}
            </p>
          </div>

          {/* Subcard 2 */}
          <div className="card-white p-4 sm:p-5 border border-[#eceaf2] shadow-xs">
            <h3 className="text-xs font-bold text-[#181925] mb-2">
              {secondPointTitle}
            </h3>
            <p className="text-xs text-[#52576b] leading-relaxed">
              {secondPointContent}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
