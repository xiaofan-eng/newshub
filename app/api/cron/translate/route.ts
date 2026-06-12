import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { translateToZh } from '@/lib/translate'
import { summarizeFromUrl } from '@/lib/ai'

function authorized(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 每次处理最多 20 篇，避免超时
  const articles = await prisma.article.findMany({
    where: { translated: false },
    take: 20,
    orderBy: { fetchedAt: 'desc' },
    select: { id: true, url: true, title: true, description: true },
  })

  let processed = 0
  for (const article of articles) {
    let title = article.title
    let description = article.description

    ;[title, description] = await Promise.all([
      translateToZh(article.title),
      article.description.trim() ? translateToZh(article.description) : Promise.resolve(''),
    ])

    // 空摘要或过短时抓全文
    if (description.trim().length < 30) {
      const summary = await summarizeFromUrl(article.url, title)
      if (summary) description = summary
    }

    await prisma.article.update({
      where: { id: article.id },
      data: { title, description, translated: true },
    })
    processed++
  }

  const remaining = await prisma.article.count({ where: { translated: false } })
  return NextResponse.json({ ok: true, processed, remaining })
}
