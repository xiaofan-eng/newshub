import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthorized } from '@/lib/auth'

export async function GET() {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: 'asc' },
    include: { category: { select: { name: true } } },
  })
  return NextResponse.json(sources)
}

export async function POST(req: Request) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, url, categoryId, isChinese } = await req.json()
  const source = await prisma.source.create({ data: { name, url, categoryId, isChinese: isChinese ?? false } })
  return NextResponse.json(source)
}
