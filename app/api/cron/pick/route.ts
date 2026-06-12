import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { pickTopArticles, generateSummary } from '@/lib/ai'

function authorized(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 取过去7天内发布的文章中选
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const articles = await prisma.article.findMany({
    where: {
      publishedAt: { gte: since },
      translated: true,
      description: { not: '' },
    },
    select: { url: true, title: true, description: true },
  })

  if (articles.length === 0) return NextResponse.json({ ok: true, picked: 0 })

  const pickedUrls = await pickTopArticles(articles)

  for (const url of pickedUrls) {
    const article = articles.find((a: { url: string; title: string; description: string }) => a.url === url)
    if (!article) continue
    const summary = await generateSummary(article.title, article.description)
    await prisma.article.update({
      where: { url },
      data: { isPickedAt: since, aiSummary: summary },
    })
  }

  return NextResponse.json({ ok: true, picked: pickedUrls.length })
}
