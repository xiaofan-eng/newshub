import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthorized } from '@/lib/auth'

export async function GET() {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const categories = await prisma.category.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { sources: true } } },
  })
  return NextResponse.json(categories)
}

export async function POST(req: Request) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { name, order } = await req.json()
  const category = await prisma.category.create({ data: { name, order: order ?? 0 } })
  return NextResponse.json(category)
}
