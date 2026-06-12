'use client'

import { useState, useEffect, useCallback } from 'react'
import Header from '@/components/Header'
import DailyPicks from '@/components/DailyPicks'
import CategoryTabs from '@/components/CategoryTabs'
import ArticleList, { Article } from '@/components/ArticleList'
import { useBookmarks } from '@/lib/bookmarks'

interface ApiResponse {
  articles: Article[]
  total: number
  page: number
  pageSize: number
}

export default function Home() {
  const [picks, setPicks] = useState<Article[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [category, setCategory] = useState('全部')
  const [activeSource, setActiveSource] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const { bookmarks, toggle, isBookmarked } = useBookmarks()
  const bookmarkedIds = new Set(bookmarks.map(a => a.id))

  const loadArticles = useCallback(async (cat: string, src: string, p: number, append = false) => {
    setLoading(true)
    const params = new URLSearchParams({ category: cat, page: String(p) })
    if (src) params.set('source', src)
    const res = await fetch(`/api/articles?${params}`)
    const data: ApiResponse = await res.json()
    setArticles(prev => append ? [...prev, ...data.articles] : data.articles)
    setTotal(data.total)
    setLoading(false)
  }, [])

  const loadPicks = useCallback(async () => {
    const now = new Date()
    const today = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(now.getDate()).padStart(2,'0')}`
    const res = await fetch(`/api/articles?pickedDate=${today}&pageSize=3`)
    const data: ApiResponse = await res.json()
    setPicks(data.articles)
  }, [])

  useEffect(() => { loadPicks() }, [loadPicks])
  useEffect(() => {
    if (!showBookmarks) { setPage(1); loadArticles(category, activeSource, 1) }
  }, [category, activeSource, showBookmarks, loadArticles])

  function handleCategoryChange(cat: string) {
    setCategory(cat)
    setActiveSource('')
    setShowBookmarks(false)
  }

  function handleSourceChange(src: string) {
    setActiveSource(src)
    setPage(1)
  }

  function handleLoadMore() {
    const next = page + 1
    setPage(next)
    loadArticles(category, activeSource, next, true)
  }

  const hasMore = !showBookmarks && articles.length < total
  const displayArticles = showBookmarks ? bookmarks : articles

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)' }}>
      <Header onShowBookmarks={() => setShowBookmarks(v => !v)} showingBookmarks={showBookmarks} />
      {!showBookmarks && <DailyPicks picks={picks} />}
      <div className="max-w-2xl mx-auto" style={{ background: 'var(--surface)', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
        {showBookmarks ? (
          <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface)' }}>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'var(--font-body)' }}>
              已收藏 {bookmarks.length} 篇
            </span>
          </div>
        ) : (
          <CategoryTabs active={category} activeSource={activeSource} onChange={handleCategoryChange} onSourceChange={handleSourceChange} />
        )}
        <ArticleList articles={displayArticles} bookmarkedIds={bookmarkedIds} onToggle={toggle} />
        {hasMore && (
          <div className="py-6 text-center" style={{ borderTop: '1px solid var(--border-light)' }}>
            <button
              onClick={handleLoadMore}
              disabled={loading}
              className="cursor-pointer disabled:opacity-30 transition-all"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                background: 'transparent',
                border: 'none',
                padding: '6px 16px',
              }}
            >
              {loading ? '加载中…' : '加载更多'}
            </button>
          </div>
        )}
      </div>
      <p className="text-center py-4" style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
        仅展示近 7 天内的新闻
      </p>
    </div>
  )
}
