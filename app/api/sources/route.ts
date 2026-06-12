import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const sources = await prisma.source.findMany({
    where: { enabled: true },
    orderBy: { createdAt: 'asc' },
    select: { id: true, name: true, categoryId: true },
  })
  return NextResponse.json(sources)
}
