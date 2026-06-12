import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

function authorized(req: Request) {
  const auth = req.headers.get('authorization')
  return auth === `Bearer ${process.env.CRON_SECRET}`
}

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }
  if (!authorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const deleted = await prisma.article.deleteMany()
  return NextResponse.json({ ok: true, deleted: deleted.count })
}
