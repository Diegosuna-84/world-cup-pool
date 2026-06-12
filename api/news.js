export default async function handler(req, res) {
  const response = await fetch(
    'https://feeds.bbci.co.uk/sport/football/rss.xml'
  )
  const text = await response.text()

  const items = [...text.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(match => {
    const item = match[1]
    const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
    const url = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
    const publishedAt = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
    const urlToImage = item.match(/url="(.*?)"/)?.[1] || null

    return { title, url, publishedAt, urlToImage }
  })

  res.status(200).json({ articles: items })
}