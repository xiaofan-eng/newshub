import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { RSS_SOURCES, fetchSource } from '@/lib/rss'
import { translateToZh } from '@/lib/translate'
import { summarizeFromUrl } from '@/lib/ai'

function authorized(req: Request) {
  // Vercel Cron 自动注入 Authorization: Bearer <CRON_SECRET>
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
      const exists = await prisma.article.findUnique({ where: { url: item.url } })
      if (exists) continue

      let title = item.title
      let description = item.description

      if (!item.isChinese) {
        ;[title, description] = await Promise.all([
          translateToZh(item.title),
          translateToZh(item.description),
        ])
      }

      // 摘要过短时抓全文生成摘要
      if (description.trim().length < 30) {
        const summary = await summarizeFromUrl(item.url, title)
        if (summary) description = summary
      }

      await prisma.article.create({
        data: { url: item.url, title, description, source: item.source, category: item.category, publishedAt: item.publishedAt },
      })
      inserted++
    }
  }

  return NextResponse.json({ ok: true, inserted })
}
