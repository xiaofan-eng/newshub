import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category') ?? ''
  const source = searchParams.get('source') ?? ''
  const pickedDate = searchParams.get('pickedDate')
  const page = parseInt(searchParams.get('page') ?? '1')
  const pageSize = parseInt(searchParams.get('pageSize') ?? '20')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = { description: { not: '' } }
  if (category && category !== '全部') where.category = category
  if (source) where.source = source
  if (pickedDate) {
    where.isPickedAt = { not: null }
  }
  const [articles, total] = await Promise.all([
    prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        url: true,
        title: true,
        description: true,
        source: true,
        category: true,
        publishedAt: true,
        aiSummary: true,
      },
    }),
    prisma.article.count({ where }),
  ])

  return NextResponse.json({ articles, total, page, pageSize })
}
