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
  const count = await prisma.source.count({ where: { categoryId: id } })
  if (count > 0) return NextResponse.json({ error: '该分类下还有来源，请先删除来源' }, { status: 400 })
  await prisma.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
