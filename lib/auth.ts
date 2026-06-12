import { cookies } from 'next/headers'
import { createHmac } from 'crypto'

export async function isAdminAuthorized(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin_token')?.value
  if (!token) return false
  const [ts, sig] = token.split('.')
  if (!ts || !sig) return false
  if (Date.now() - parseInt(ts) > 7 * 24 * 60 * 60 * 1000) return false
  const secret = process.env.ADMIN_TOKEN_SECRET ?? 'fallback-secret'
  const expected = createHmac('sha256', secret).update(ts).digest('hex')
  return sig === expected
}
