import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { enabled: true },
    orderBy: { order: 'asc' },
    select: { id: true, name: true },
  })
  return NextResponse.json(categories)
}
