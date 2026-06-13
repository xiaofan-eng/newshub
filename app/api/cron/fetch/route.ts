import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getRssSources, fetchSource } from '@/lib/rss'

function authorized(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  await prisma.article.deleteMany({ where: { fetchedAt: { lt: cutoff } } })

  const sources = await getRssSources()
  let inserted = 0

  for (const source of sources) {
    const items = await fetchSource(source)
    for (const item of items) {
      if (!item.url) continue
      const exists = await prisma.article.findUnique({ where: { url: item.url } })
      if (exists) continue
      await prisma.article.create({
        data: {
          url: item.url,
          title: item.title,
          description: item.description,
          source: item.source,
          category: item.category,
          publishedAt: item.publishedAt,
          translated: item.isChinese,
        },
      })
      inserted++
    }
  }

  // 直接执行翻译（不用 fire-and-forget，Vercel 函数返回后异步任务会被终止）
  const host = req.headers.get('host') ?? ''
  const protocol = host.includes('localhost') ? 'http' : 'https'
  const baseUrl = `${protocol}://${host}`

  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch(`${baseUrl}/api/cron/translate`, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
      })
      const data = await res.json()
      if (data.remaining === 0) break
    } catch { break }
  }

  return NextResponse.json({ ok: true, inserted })
}
