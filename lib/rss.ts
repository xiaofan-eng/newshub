import Parser from 'rss-parser'
import { prisma } from '@/lib/db'

const parser = new Parser({ timeout: 10000 })

export interface RssItem {
  url: string
  title: string
  description: string
  source: string
  category: string
  publishedAt: Date
  isChinese: boolean
}

export async function getRssSources() {
  return prisma.source.findMany({
    where: { enabled: true },
    include: { category: { select: { name: true } } },
  })
}

export async function fetchSource(source: { name: string; url: string; category: { name: string }; isChinese: boolean }): Promise<RssItem[]> {
  try {
    const feed = await parser.parseURL(source.url)
    return feed.items.map(item => ({
      url: item.link ?? item.guid ?? '',
      title: item.title ?? '',
      description: item.contentSnippet ?? item.summary ?? '',
      source: source.name,
      category: source.category.name,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      isChinese: source.isChinese,
    })).filter(item => item.url && item.title.trim().length > 0)
  } catch {
    console.error(`Failed to fetch ${source.name}`)
    return []
  }
}
