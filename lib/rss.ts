import Parser from 'rss-parser'

const parser = new Parser({ timeout: 10000 })

export const RSS_SOURCES = [
  // 世界
  { name: 'BBC World',      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',                        category: '世界', isChinese: false },
  { name: 'Al Jazeera',     url: 'https://www.aljazeera.com/xml/rss/all.xml',                          category: '世界', isChinese: false },
  { name: 'The Guardian',   url: 'https://www.theguardian.com/world/rss',                              category: '世界', isChinese: false },
  // 财经
  { name: 'Financial Times',url: 'https://www.ft.com/rss/home',                                        category: '财经', isChinese: false },
  { name: 'Bloomberg',      url: 'https://feeds.bloomberg.com/markets/news.rss',                        category: '财经', isChinese: false },
  { name: 'WSJ',            url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',                      category: '财经', isChinese: false },
  // AI
  { name: 'OpenAI Blog',    url: 'https://openai.com/news/rss.xml',                                    category: 'AI',   isChinese: false },
  { name: 'Hugging Face',   url: 'https://huggingface.co/blog/feed.xml',                               category: 'AI',   isChinese: false },
  { name: 'MIT Tech Review',url: 'https://www.technologyreview.com/feed/',                             category: 'AI',   isChinese: false },
  { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/',                          category: 'AI',   isChinese: false },
  // 科技
  { name: 'TechCrunch',     url: 'https://techcrunch.com/feed/',                                       category: '科技', isChinese: false },
  { name: 'Hacker News',    url: 'https://news.ycombinator.com/rss',                                   category: '科技', isChinese: false },
  { name: 'Ars Technica',   url: 'https://feeds.arstechnica.com/arstechnica/index',                    category: '科技', isChinese: false },
  { name: 'The Register',   url: 'https://www.theregister.com/headlines.atom',                         category: '科技', isChinese: false },
  // 健康
  { name: 'WHO News',       url: 'https://www.who.int/rss-feeds/news-english.xml',                    category: '健康', isChinese: false },
  // 时尚
  { name: 'Vogue',          url: 'https://www.vogue.com/feed/rss',                                     category: '时尚', isChinese: false },
  { name: 'GQ',             url: 'https://www.gq.com/feed/rss',                                        category: '时尚', isChinese: false },
  { name: "Harper's Bazaar",url: 'https://www.harpersbazaar.com/rss/all.xml/',                         category: '时尚', isChinese: false },
  // 美妆
  { name: 'Allure',         url: 'https://www.allure.com/feed/rss',                                    category: '美妆', isChinese: false },
  { name: 'Refinery29',     url: 'https://www.refinery29.com/en-us/beauty/rss.xml',                    category: '美妆', isChinese: false },
  // 社会
  { name: 'NYT',            url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',          category: '社会', isChinese: false },
  { name: '澎湃新闻',        url: 'https://www.thepaper.cn/rss_1621',                                   category: '社会', isChinese: true  },
]

export interface RssItem {
  url: string
  title: string
  description: string
  source: string
  category: string
  publishedAt: Date
  isChinese: boolean
}

export async function fetchSource(source: typeof RSS_SOURCES[0]): Promise<RssItem[]> {
  try {
    const feed = await parser.parseURL(source.url)
    return feed.items.map(item => ({
      url: item.link ?? item.guid ?? '',
      title: item.title ?? '',
      description: item.contentSnippet ?? item.summary ?? '',
      source: source.name,
      category: source.category,
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      isChinese: source.isChinese,
    })).filter(item => item.url && item.title.trim().length > 0)
  } catch {
    console.error(`Failed to fetch ${source.name}`)
    return []
  }
}
