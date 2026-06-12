interface ArticleMeta {
  url: string
  title: string
  description: string
}

async function deepseekChat(prompt: string, maxTokens: number): Promise<string> {
  const res = await fetch('https://api.deepseek.com/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: maxTokens,
    }),
  })
  const data = await res.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

export async function pickTopArticles(articles: ArticleMeta[]): Promise<string[]> {
  const list = articles.map((a, i) => `${i + 1}. [${a.title}] ${a.description}\nURL: ${a.url}`).join('\n\n')
  const text = await deepseekChat(
    `以下是今日新闻文章列表，请从中选出最重要的3篇。评分维度：影响力（全球/行业范围）、时效性（重大突发或首发）、多领域关联度。\n\n只返回3个URL，每行一个，不要任何其他内容。\n\n${list}`,
    512
  )
  return text.split('\n').map(l => l.trim()).filter(l => l.startsWith('http')).slice(0, 3)
}

export async function generateSummary(title: string, description: string): Promise<string> {
  const text = await deepseekChat(
    `请用中文为以下新闻生成一段100字以内的高质量摘要，直接输出摘要内容，不要任何前缀。\n\n标题：${title}\n内容：${description}`,
    256
  )
  return text || description
}

export async function summarizeFromUrl(url: string, title: string): Promise<string> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; NewsHub/1.0)' },
      signal: AbortSignal.timeout(8000),
    })
    const html = await res.text()
    const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 2000)
    if (text.length < 100) return ''
    return await generateSummary(title, text)
  } catch {
    return ''
  }
}
