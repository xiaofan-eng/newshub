import { NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/auth'
import Parser from 'rss-parser'

const parser = new Parser({ timeout: 8000 })

export async function POST(req: Request) {
  if (!await isAdminAuthorized()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { url } = await req.json()
  try {
    const feed = await parser.parseURL(url)
    return NextResponse.json({ ok: true, title: feed.title, count: feed.items.length })
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) })
  }
}
