// 一次性迁移脚本：将硬编码来源写入数据库
const { neon } = require('@neondatabase/serverless')

const DATABASE_URL = 'postgresql://neondb_owner:npg_o9pn4MrIlZiy@ep-holy-night-atb5okk4-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require'

const SOURCES = [
  { category: '世界', order: 1, sources: [
    { name: 'BBC World',      url: 'https://feeds.bbci.co.uk/news/world/rss.xml',                        isChinese: false },
    { name: 'Al Jazeera',     url: 'https://www.aljazeera.com/xml/rss/all.xml',                          isChinese: false },
    { name: 'The Guardian',   url: 'https://www.theguardian.com/world/rss',                              isChinese: false },
  ]},
  { category: '财经', order: 2, sources: [
    { name: 'Financial Times',url: 'https://www.ft.com/rss/home',                                        isChinese: false },
    { name: 'Bloomberg',      url: 'https://feeds.bloomberg.com/markets/news.rss',                        isChinese: false },
    { name: 'WSJ',            url: 'https://feeds.a.dj.com/rss/RSSMarketsMain.xml',                      isChinese: false },
  ]},
  { category: 'AI', order: 3, sources: [
    { name: 'OpenAI Blog',    url: 'https://openai.com/news/rss.xml',                                    isChinese: false },
    { name: 'Hugging Face',   url: 'https://huggingface.co/blog/feed.xml',                               isChinese: false },
    { name: 'MIT Tech Review',url: 'https://www.technologyreview.com/feed/',                             isChinese: false },
    { name: 'VentureBeat AI', url: 'https://venturebeat.com/category/ai/feed/',                          isChinese: false },
  ]},
  { category: '科技', order: 4, sources: [
    { name: 'TechCrunch',     url: 'https://techcrunch.com/feed/',                                       isChinese: false },
    { name: 'Hacker News',    url: 'https://news.ycombinator.com/rss',                                   isChinese: false },
    { name: 'Ars Technica',   url: 'https://feeds.arstechnica.com/arstechnica/index',                    isChinese: false },
    { name: 'The Register',   url: 'https://www.theregister.com/headlines.atom',                         isChinese: false },
  ]},
  { category: '健康', order: 5, sources: [
    { name: 'WHO News',       url: 'https://www.who.int/rss-feeds/news-english.xml',                     isChinese: false },
  ]},
  { category: '时尚', order: 6, sources: [
    { name: 'Vogue',          url: 'https://www.vogue.com/feed/rss',                                     isChinese: false },
    { name: 'GQ',             url: 'https://www.gq.com/feed/rss',                                        isChinese: false },
    { name: "Harper's Bazaar",url: 'https://www.harpersbazaar.com/rss/all.xml/',                         isChinese: false },
  ]},
  { category: '美妆', order: 7, sources: [
    { name: 'Allure',         url: 'https://www.allure.com/feed/rss',                                    isChinese: false },
    { name: 'Refinery29',     url: 'https://www.refinery29.com/en-us/beauty/rss.xml',                    isChinese: false },
  ]},
  { category: '社会', order: 8, sources: [
    { name: 'NYT',            url: 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',          isChinese: false },
  ]},
]

async function main() {
  const sql = neon(DATABASE_URL)
  for (const { category, order, sources } of SOURCES) {
    const [cat] = await sql`
      INSERT INTO "Category" (id, name, "order", enabled)
      VALUES (gen_random_uuid()::text, ${category}, ${order}, true)
      ON CONFLICT (name) DO UPDATE SET "order" = ${order}
      RETURNING id
    `
    for (const src of sources) {
      await sql`
        INSERT INTO "Source" (id, name, url, "categoryId", "isChinese", enabled, "createdAt")
        VALUES (gen_random_uuid()::text, ${src.name}, ${src.url}, ${cat.id}, ${src.isChinese}, true, NOW())
        ON CONFLICT (url) DO NOTHING
      `
    }
    console.log(`✓ ${category} (${sources.length} sources)`)
  }
  console.log('Migration complete.')
}

main().catch(console.error)
