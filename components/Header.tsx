'use client'

import { useBookmarks } from '@/lib/bookmarks'

export default function Header({ onShowBookmarks, showingBookmarks }: {
  onShowBookmarks: () => void
  showingBookmarks: boolean
}) {
  const { bookmarks } = useBookmarks()

  return (
    <header className="sticky top-0 z-20" style={{ background: 'var(--ink)', borderBottom: '1px solid var(--border)' }}>
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Bookmark button left spacer */}
        <div className="w-20" />

        {/* Logo center */}
        <div className="text-center">
          <h1
            style={{
              fontFamily: 'var(--font-logo), serif',
              fontSize: 'clamp(1.6rem, 5vw, 2.4rem)',
              color: 'var(--text-primary)',
              letterSpacing: '0.06em',
              lineHeight: 1,
            }}
          >
            News<span style={{ color: 'var(--accent)' }}>Hub</span>
          </h1>
          <p style={{
            fontSize: '0.6rem',
            letterSpacing: '0.28em',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            marginTop: '4px',
            fontFamily: 'var(--font-body)',
          }}>
            全球资讯 · 每日精选
          </p>
        </div>

        {/* Bookmark button */}
        <button
          onClick={onShowBookmarks}
          className="w-20 flex items-center justify-end gap-1 text-xs transition-colors cursor-pointer"
          style={{
            color: showingBookmarks ? 'var(--accent)' : 'var(--text-dim)',
            fontFamily: 'var(--font-body)',
          }}
        >
          <span style={{ fontSize: '1rem' }}>{showingBookmarks ? '♥' : '♡'}</span>
          <span>{bookmarks.length > 0 ? bookmarks.length : ''}</span>
        </button>
      </div>
    </header>
  )
}
