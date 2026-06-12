export async function translateToZh(text: string): Promise<string> {
  if (!text.trim()) return text
  try {
    const res = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: `将以下文本翻译成中文，只输出译文，不要任何解释：\n\n${text}` }],
        max_tokens: 1024,
      }),
    })
    const data = await res.json()
    return data.choices?.[0]?.message?.content?.trim() ?? text
  } catch {
    return text
  }
}
