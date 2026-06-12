'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface Category { id: string; name: string; order: number; enabled: boolean; _count: { sources: number } }
interface Source { id: string; name: string; url: string; categoryId: string; isChinese: boolean; enabled: boolean; category: { name: string } }

export default function AdminPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [sources, setSources] = useState<Source[]>([])
  const [activeCatId, setActiveCatId] = useState<string | null>(null)
  const [showSourceForm, setShowSourceForm] = useState(false)
  const [showCatForm, setShowCatForm] = useState(false)
  const [editingSource, setEditingSource] = useState<Source | null>(null)
  const [testResults, setTestResults] = useState<Record<string, { ok: boolean; count?: number; error?: string }>>({})

  const loadCategories = useCallback(async () => {
    const res = await fetch('/api/admin/categories')
    const data = await res.json()
    setCategories(data)
    if (!activeCatId && data.length > 0) setActiveCatId(data[0].id)
  }, [activeCatId])

  const loadSources = useCallback(async () => {
    const res = await fetch('/api/admin/sources')
    setSources(await res.json())
  }, [])

  useEffect(() => { loadCategories(); loadSources() }, [loadCategories, loadSources])

  const filteredSources = sources.filter(s => s.categoryId === activeCatId)

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  async function toggleSource(id: string, enabled: boolean) {
    await fetch(`/api/admin/sources/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled }) })
    loadSources()
  }

  async function deleteSource(id: string) {
    if (!confirm('确认删除此来源？')) return
    await fetch(`/api/admin/sources/${id}`, { method: 'DELETE' })
    loadSources(); loadCategories()
  }

  async function testSource(id: string, url: string) {
    setTestResults(r => ({ ...r, [id]: { ok: false, error: '测试中...' } }))
    const res = await fetch('/api/admin/sources/test', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url }) })
    const data = await res.json()
    setTestResults(r => ({ ...r, [id]: data }))
  }

  async function toggleCategory(id: string, enabled: boolean) {
    await fetch(`/api/admin/categories/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ enabled }) })
    loadCategories()
  }

  async function deleteCategory(id: string) {
    const cat = categories.find(c => c.id === id)
    const msg = cat?._count.sources
      ? `确认删除分类「${cat.name}」？该分类下 ${cat._count.sources} 个来源也会一并删除。`
      : `确认删除分类「${cat?.name}」？`
    if (!confirm(msg)) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    setActiveCatId(null)
    loadCategories()
    loadSources()
  }

  async function addCategory(name: string, order: number) {
    await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, order }) })
    loadCategories()
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--ink)', color: 'var(--text-primary)', fontFamily: 'var(--font-body)' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
        <span className="font-bold" style={{ fontFamily: 'var(--font-logo)' }}>NewsHub 后台</span>
        <button onClick={logout} className="text-xs cursor-pointer" style={{ color: 'var(--text-dim)' }}>退出登录</button>
      </header>

      <div className="flex" style={{ minHeight: 'calc(100vh - 49px)' }}>
        {/* 左侧分类 */}
        <aside className="w-48 shrink-0 border-r p-3" style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>分类</p>
            <button onClick={() => setShowCatForm(true)} className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>+ 新增</button>
          </div>
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setActiveCatId(cat.id)}
              className="flex items-center justify-between px-2 py-1.5 rounded cursor-pointer text-sm mb-0.5 group"
              style={{
                background: activeCatId === cat.id ? 'var(--accent)' : 'transparent',
                color: activeCatId === cat.id ? '#fff' : (cat.enabled ? 'var(--text-primary)' : 'var(--text-dim)'),
              }}
            >
              <span>{cat.name}</span>
              <div className="flex items-center gap-1">
                <span className="text-xs opacity-60">{cat._count.sources}</span>
                <button
                  onClick={e => { e.stopPropagation(); deleteCategory(cat.id) }}
                  className="text-xs opacity-0 group-hover:opacity-100 cursor-pointer ml-1"
                  style={{ color: activeCatId === cat.id ? 'rgba(255,255,255,0.7)' : '#dc2626' }}
                  title="删除分类"
                >✕</button>
              </div>
            </div>
          ))}
        </aside>

        {/* 右侧来源 */}
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                {categories.find(c => c.id === activeCatId)?.name ?? ''} 来源
              </h2>
              {activeCatId && (() => {
                const cat = categories.find(c => c.id === activeCatId)
                return cat ? (
                  <button
                    onClick={() => toggleCategory(cat.id, !cat.enabled)}
                    className="text-xs px-2 py-0.5 rounded cursor-pointer"
                    style={{ background: cat.enabled ? '#d1fae5' : '#fee2e2', color: cat.enabled ? '#065f46' : '#991b1b' }}
                  >
                    {cat.enabled ? '已启用' : '已禁用'}
                  </button>
                ) : null
              })()}
            </div>
            <button
              onClick={() => { setEditingSource(null); setShowSourceForm(true) }}
              className="text-xs px-3 py-1.5 rounded cursor-pointer"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              + 新增来源
            </button>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['来源名', 'RSS URL', '语言', '状态', '操作'].map(h => (
                  <th key={h} className="text-left pb-2 pr-4 text-xs uppercase tracking-wider" style={{ color: 'var(--text-dim)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSources.map(src => (
                <tr key={src.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td className="py-2 pr-4 font-medium" style={{ color: 'var(--text-primary)' }}>{src.name}</td>
                  <td className="py-2 pr-4 max-w-xs truncate text-xs" style={{ color: 'var(--text-dim)' }}>{src.url}</td>
                  <td className="py-2 pr-4 text-xs">{src.isChinese ? '中文' : '外文'}</td>
                  <td className="py-2 pr-4">
                    <button
                      onClick={() => toggleSource(src.id, !src.enabled)}
                      className="text-xs px-2 py-0.5 rounded cursor-pointer"
                      style={{ background: src.enabled ? '#d1fae5' : '#fee2e2', color: src.enabled ? '#065f46' : '#991b1b' }}
                    >
                      {src.enabled ? '启用' : '禁用'}
                    </button>
                  </td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => testSource(src.id, src.url)} className="text-xs cursor-pointer" style={{ color: 'var(--accent)' }}>测试</button>
                      <button onClick={() => { setEditingSource(src); setShowSourceForm(true) }} className="text-xs cursor-pointer" style={{ color: 'var(--text-secondary)' }}>编辑</button>
                      <button onClick={() => deleteSource(src.id)} className="text-xs cursor-pointer" style={{ color: '#dc2626' }}>删除</button>
                      {testResults[src.id] && (
                        <span className="text-xs" style={{ color: testResults[src.id].ok ? '#065f46' : '#dc2626' }}>
                          {testResults[src.id].ok ? `✓ ${testResults[src.id].count}篇` : `✗ ${testResults[src.id].error}`}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredSources.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-sm" style={{ color: 'var(--text-dim)' }}>暂无来源</td></tr>
              )}
            </tbody>
          </table>
        </main>
      </div>

      {/* 新增/编辑来源弹窗 */}
      {showSourceForm && (
        <SourceForm
          source={editingSource}
          categories={categories}
          defaultCategoryId={activeCatId ?? ''}
          onClose={() => setShowSourceForm(false)}
          onSaved={() => { setShowSourceForm(false); loadSources(); loadCategories() }}
        />
      )}

      {/* 新增分类弹窗 */}
      {showCatForm && (
        <CategoryForm
          order={categories.length + 1}
          onClose={() => setShowCatForm(false)}
          onSaved={(name, order) => { addCategory(name, order); setShowCatForm(false) }}
        />
      )}
    </div>
  )
}

function SourceForm({ source, categories, defaultCategoryId, onClose, onSaved }: {
  source: Source | null
  categories: Category[]
  defaultCategoryId: string
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState({
    name: source?.name ?? '',
    url: source?.url ?? '',
    categoryId: source?.categoryId ?? defaultCategoryId,
    isChinese: source?.isChinese ?? false,
  })
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    if (source) {
      await fetch(`/api/admin/sources/${source.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    } else {
      await fetch('/api/admin/sources', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    }
    setLoading(false)
    onSaved()
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <form onSubmit={handleSubmit} className="w-96 p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
          {source ? '编辑来源' : '新增来源'}
        </h3>
        {[
          { label: '来源名', key: 'name', type: 'text' },
          { label: 'RSS URL', key: 'url', type: 'url' },
        ].map(({ label, key, type }) => (
          <div key={key} className="mb-3">
            <label className="text-xs block mb-1" style={{ color: 'var(--text-dim)' }}>{label}</label>
            <input
              type={type}
              value={(form as Record<string, unknown>)[key] as string}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              required
              className="w-full px-3 py-2 rounded-lg text-sm outline-none"
              style={{ background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
            />
          </div>
        ))}
        <div className="mb-3">
          <label className="text-xs block mb-1" style={{ color: 'var(--text-dim)' }}>分类</label>
          <select
            value={form.categoryId}
            onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          >
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 mb-4 cursor-pointer text-sm" style={{ color: 'var(--text-secondary)' }}>
          <input type="checkbox" checked={form.isChinese} onChange={e => setForm(f => ({ ...f, isChinese: e.target.checked }))} />
          中文来源（跳过翻译）
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="flex-1 py-2 rounded-lg text-sm cursor-pointer" style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>取消</button>
          <button type="submit" disabled={loading} className="flex-1 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-50" style={{ background: 'var(--accent)', color: '#fff' }}>
            {loading ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}

function CategoryForm({ order, onClose, onSaved }: {
  order: number
  onClose: () => void
  onSaved: (name: string, order: number) => void
}) {
  const [name, setName] = useState('')
  const [ord, setOrd] = useState(order)

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="w-80 p-6 rounded-2xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h3 className="font-semibold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>新增分类</h3>
        <div className="mb-3">
          <label className="text-xs block mb-1" style={{ color: 'var(--text-dim)' }}>分类名</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="mb-4">
          <label className="text-xs block mb-1" style={{ color: 'var(--text-dim)' }}>排序</label>
          <input type="number" value={ord} onChange={e => setOrd(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg text-sm outline-none"
            style={{ background: 'var(--ink)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
          />
        </div>
        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg text-sm cursor-pointer" style={{ background: 'var(--surface-hover)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>取消</button>
          <button onClick={() => name.trim() && onSaved(name.trim(), ord)} className="flex-1 py-2 rounded-lg text-sm cursor-pointer" style={{ background: 'var(--accent)', color: '#fff' }}>保存</button>
        </div>
      </div>
    </div>
  )
}
