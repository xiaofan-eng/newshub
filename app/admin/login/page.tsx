'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
    } else {
      setError('密码错误')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--ink)' }}>
      <form onSubmit={handleSubmit} className="p-8 rounded-2xl w-80" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h1 className="text-lg font-bold mb-6 text-center" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          NewsHub 后台
        </h1>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="管理员密码"
          className="w-full px-3 py-2 rounded-lg mb-3 text-sm outline-none"
          style={{ background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
        />
        {error && <p className="text-xs mb-3" style={{ color: 'var(--accent)' }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 cursor-pointer"
          style={{ background: 'var(--accent)', color: '#fff' }}
        >
          {loading ? '登录中...' : '登录'}
        </button>
      </form>
    </div>
  )
}
