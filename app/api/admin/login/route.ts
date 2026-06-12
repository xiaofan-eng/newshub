import { NextResponse } from 'next/server'
import { createHmac } from 'crypto'

function generateToken() {
  const secret = process.env.ADMIN_TOKEN_SECRET ?? 'fallback-secret'
  const ts = Date.now().toString()
  const sig = createHmac('sha256', secret).update(ts).digest('hex')
  return `${ts}.${sig}`
}

export async function POST(req: Request) {
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }
  const token = generateToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })
  return res
}
