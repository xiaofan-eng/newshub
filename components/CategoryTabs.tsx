'use client'

import { useEffect, useState } from 'react'

interface Category { id: string; name: string }
interface Source { id: string; name: string; categoryId: string }

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
  const [categories, setCategories] = useState<Category[]>([])
  const [sources, setSources] = useState<Source[]>([])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
    fetch('/api/sources').then(r => r.json()).then((data: Source[] | { error: string }) => {
      if (Array.isArray(data)) setSources(data)
    })
  }, [])

  const allTabs = ['全部', ...categories.map(c => c.name)]
  const activeCat = categories.find(c => c.name === active)
  const filteredSources = activeCat ? sources.filter(s => s.categoryId === activeCat.id) : []

  return (
    <div style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="flex overflow-x-auto" style={{ borderBottom: filteredSources.length > 0 ? '1px solid var(--border-light)' : 'none' }}>
        {allTabs.map(cat => (
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

      {filteredSources.length > 0 && (
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
          {filteredSources.map(src => (
            <button
              key={src.id}
              onClick={() => onSourceChange(src.name)}
              className="px-2.5 py-0.5 text-xs rounded-full transition-all cursor-pointer"
              style={{
                fontFamily: 'var(--font-body)',
                background: activeSource === src.name ? 'var(--accent)' : 'transparent',
                color: activeSource === src.name ? '#fff' : 'var(--text-dim)',
                border: '1px solid ' + (activeSource === src.name ? 'var(--accent)' : 'var(--border)'),
              }}
            >
              {src.name}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
