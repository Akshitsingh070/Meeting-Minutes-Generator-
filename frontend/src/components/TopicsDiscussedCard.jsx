export default function TopicsDiscussedCard({ topics }) {
  const defaultTopics = [
    { name: 'Project updates', time: '00:00 – 18:24' },
    { name: 'API integration', time: '18:24 – 42:10' },
    { name: 'Next steps', time: '42:10 – 59:56' },
  ]

  const items = topics && topics.length > 0 ? topics : defaultTopics

  return (
    <div className="card-white p-6 transition-all hover:border-[#ded7f3]">
      <h2 className="text-sm font-bold text-[#181925] tracking-tight mb-3">
        Topics discussed
      </h2>

      <div className="space-y-2">
        {items.map((topic, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs text-[#424656]"
          >
            <span className="font-medium text-[#181925]">{topic.name}</span>
            <span className="text-[#8c91a0] tabular-nums font-mono text-[11px]">
              {topic.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

