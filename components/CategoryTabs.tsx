'use client'

const CATEGORIES = ['全部', '世界', 'AI', '科技', '财经', '健康', '时尚', '美妆', '社会']

const SOURCES_BY_CATEGORY: Record<string, string[]> = {
  '世界': ['BBC World', 'Al Jazeera', 'The Guardian'],
  'AI':   ['OpenAI Blog', 'Hugging Face', 'MIT Tech Review', 'VentureBeat AI'],
  '科技': ['TechCrunch', 'Hacker News', 'Ars Technica', 'The Register'],
  '财经': ['Financial Times', '财新网', 'Bloomberg', 'WSJ'],
  '健康': ['WHO News', 'WebMD', 'Harvard Health'],
  '时尚': ['Vogue', 'GQ', "Harper's Bazaar"],
  '美妆': ['Allure', 'Refinery29'],
  '社会': ['NYT', '澎湃新闻'],
}

export default function CategoryTabs({
  active,
  activeSource,
  onChange,
  onSourceChange,
}: {
  active: string
  activeSource: string
  onChange: (cat: string) => void
  onSourceChange: (source: string) => void
}) {
  const sources = active !== '全部' ? SOURCES_BY_CATEGORY[active] ?? [] : []

  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      {/* 一级 Tab */}
      <div className="flex overflow-x-auto" style={{ borderBottom: sources.length > 0 ? '1px solid var(--border-light)' : 'none' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="shrink-0 px-4 py-2.5 text-xs transition-all cursor-pointer"
            style={{
              fontFamily: 'var(--font-body)',
              fontWeight: active === cat ? 600 : 400,
              color: active === cat ? 'var(--accent)' : 'var(--text-dim)',
              background: 'transparent',
              borderBottom: active === cat ? '2px solid var(--accent)' : '2px solid transparent',
              letterSpacing: '0.05em',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 二级来源 Tab */}
      {sources.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-3 py-2">
          <button
            onClick={() => onSourceChange('')}
            className="px-2.5 py-0.5 text-xs rounded-full transition-all cursor-pointer"
            style={{
              fontFamily: 'var(--font-body)',
              background: activeSource === '' ? 'var(--accent)' : 'transparent',
              color: activeSource === '' ? '#fff' : 'var(--text-dim)',
              border: '1px solid ' + (activeSource === '' ? 'var(--accent)' : 'var(--border)'),
            }}
          >
            全部
          </button>
          {sources.map(src => (
            <button
              key={src}
              onClick={() => onSourceChange(src)}
              className="px-2.5 py-0.5 text-xs rounded-full transition-all cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                background: activeSource === src ? 'var(--accent)' : 'transparent',
                color: activeSource === src ? '#fff' : 'var(--text-dim)',
                border: '1px solid ' + (activeSource === src ? 'var(--accent)' : 'var(--border)'),
              }}
            >
              {src}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
