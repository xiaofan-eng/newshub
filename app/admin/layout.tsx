// 根 layout 无认证，login 页面直接渲染
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
