import { redirect } from 'next/navigation'
import { isAdminAuthorized } from '@/lib/auth'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const authorized = await isAdminAuthorized()
  if (!authorized) redirect('/admin/login')
  return <>{children}</>
}
