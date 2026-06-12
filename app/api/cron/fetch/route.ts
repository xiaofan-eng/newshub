import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { RSS_SOURCES, fetchSource } from '@/lib/rss'

function authorized(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  await prisma.article.deleteMany({ where: { fetchedAt: { lt: cutoff } } })

  let inserted = 0

  for (const source of RSS_SOURCES) {
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
          translated: item.isChinese, // 中文来源标记为已翻译
        },
      })
      inserted++
    }
  }

  return NextResponse.json({ ok: true, inserted })
}
