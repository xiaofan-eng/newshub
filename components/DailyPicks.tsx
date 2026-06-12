import { Article } from './ArticleList'

export default function DailyPicks({ picks }: { picks: Article[] }) {
  if (picks.length === 0) return null

  return (
    <div className="max-w-2xl mx-auto px-4 py-5">
      <div className="flex items-center gap-3 mb-4">
        <span style={{
          fontSize: '0.6rem',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'var(--accent)',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
        }}>
          今日精选
        </span>
        <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {picks.map(article => (
          <a
            key={article.id}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group transition-all duration-200 cursor-pointer"
            style={{ textDecoration: 'none' }}
          >
            <div
              className="h-full p-4 rounded-2xl transition-all duration-200"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 1px 4px rgba(160,100,50,0.06)',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(160,100,50,0.12)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(160,100,50,0.06)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <p style={{
                fontSize: '0.7rem',
                color: 'var(--accent)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '6px',
              }}>
                {article.source}
              </p>
              <p style={{
                fontSize: '0.9rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-primary)',
                lineHeight: 1.45,
                marginBottom: '8px',
                fontWeight: 600,
              }}>
                {article.title}
              </p>
              {article.aiSummary && (
                <p style={{
                  fontSize: '0.78rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-body)',
                }}>
                  {article.aiSummary}
                </p>
              )}
              <p style={{
                fontSize: '0.65rem',
                color: 'var(--text-dim)',
                marginTop: '10px',
                fontFamily: 'var(--font-body)',
              }}>
                {formatDate(article.publishedAt)}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })
}
