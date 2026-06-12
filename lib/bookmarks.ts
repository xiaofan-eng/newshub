import { useState, useEffect, useCallback } from 'react'
import { Article } from '@/components/ArticleList'

const KEY = 'newshub_bookmarks'

function load(): Article[] {
  try {
    const s = localStorage.getItem(KEY)
    return s ? JSON.parse(s) : []
  } catch { return [] }
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Article[]>([])

  useEffect(() => { setBookmarks(load()) }, [])

  const toggle = useCallback((article: Article) => {
    setBookmarks(prev => {
      const next = prev.some(a => a.id === article.id)
        ? prev.filter(a => a.id !== article.id)
        : [article, ...prev]
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const isBookmarked = useCallback((id: string) => bookmarks.some(a => a.id === id), [bookmarks])

  return { bookmarks, toggle, isBookmarked }
}
