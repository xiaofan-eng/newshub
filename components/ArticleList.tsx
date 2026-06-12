'use client'

export interface Article {
  id: string
  url: string
  title: string
  description: string
  source: string
  category: string
  publishedAt: string
  aiSummary?: string | null
}

export default function ArticleList({
  articles,
  bookmarkedIds,
  onToggle,
}: {
  articles: Article[]
  bookmarkedIds: Set<string>
  onToggle: (article: Article) => void
}) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-20">
        <p style={{ fontSize: '1.5rem', marginBottom: '8px' }}>☕</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'var(--font-body)' }}>
          暂无文章
        </p>
      </div>
    )
  }

  return (
    <ul style={{ background: 'var(--surface)' }}>
      {articles.map((article, i) => (
        <li
          key={article.id}
          className="group transition-colors duration-150"
          style={{ borderBottom: '1px solid var(--border-light)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-hover)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div className="flex items-stretch">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-4 min-w-0 cursor-pointer"
              style={{ textDecoration: 'none' }}
            >
              <div className="flex items-start gap-3">
                <span style={{
                  fontSize: '0.65rem',
                  color: 'var(--text-dim)',
                  fontFamily: 'var(--font-body)',
                  marginTop: '3px',
                  minWidth: '1.2rem',
                  textAlign: 'right',
                }}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p style={{
                    fontSize: '0.9rem',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 600,
                    color: 'var(--text-primary)',
                    lineHeight: 1.45,
                    marginBottom: '4px',
                  }}>
                    {article.title}
                  </p>
                  <p style={{
                    fontSize: '0.72rem',
                    color: 'var(--text-secondary)',
                    fontFamily: 'var(--font-body)',
                    marginBottom: '6px',
                  }}>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{article.source}</span>
                    <span style={{ margin: '0 6px', color: 'var(--border)' }}>·</span>
                    {formatDate(article.publishedAt)}
                  </p>
                  {article.description && article.description.length > 10 && (
                    <p style={{
                      fontSize: '0.78rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.6,
                      fontFamily: 'var(--font-body)',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical' as const,
                      overflow: 'hidden',
                    }}>
                      {article.description}
                    </p>
                  )}
                </div>
              </div>
            </a>

            <button
              onClick={() => onToggle(article)}
              className="shrink-0 px-3 flex items-center justify-center cursor-pointer transition-all duration-150"
              style={{
                color: bookmarkedIds.has(article.id) ? 'var(--accent)' : 'var(--border)',
                fontSize: '1rem',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
              onMouseLeave={e => (e.currentTarget.style.color = bookmarkedIds.has(article.id) ? 'var(--accent)' : 'var(--border)')}
              title={bookmarkedIds.has(article.id) ? '取消收藏' : '收藏'}
            >
              {bookmarkedIds.has(article.id) ? '♥' : '♡'}
            </button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })
}
