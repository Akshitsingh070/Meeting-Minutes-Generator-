export default function ActionItemsCard({ actionItems = [], loading }) {
  const defaultItems = [
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
  ]

  const items = actionItems.length > 0 ? actionItems : defaultItems

  return (
    <div className="card-white p-6 transition-all hover:border-[#ded7f3]">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-bold text-[#181925] tracking-tight">
          Action items
        </h2>
        <span className="text-[11px] font-semibold text-[#8c91a0]">
          {items.length} {items.length === 1 ? 'task' : 'tasks'}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2.5 animate-pulse">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item, index) => {
            const num = String(index + 1).padStart(2, '0')
            return (
              <div
                key={index}
                className="flex items-start gap-2.5 text-xs text-[#424656] leading-relaxed"
              >
                <span className="font-semibold text-[#6e44ff] shrink-0">
                  {num}
                </span>
                <span className="text-[#181925] font-medium">
                  {item.task}
                </span>
                {item.responsible && (
                  <span className="text-[#8c91a0]">
                    · <span className="text-[#5122b1] font-medium">{item.responsible}</span>
                  </span>
                )}
                {item.deadline && (
                  <span className="text-[#8c91a0]">
                    · <span className="text-amber-700 font-medium">{item.deadline}</span>
                  </span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

