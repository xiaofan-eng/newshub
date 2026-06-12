import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { isAdminAuthorized } from '@/lib/auth'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const data = await req.json()
  const source = await prisma.source.update({ where: { id }, data })
  return NextResponse.json(source)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.source.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
