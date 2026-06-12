import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthorized } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await req.json()
  const category = await prisma.category.update({ where: { id }, data })
  return NextResponse.json(category)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  // 先删除该分类下的所有来源，再删除分类
  await prisma.source.deleteMany({ where: { categoryId: id } })
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
