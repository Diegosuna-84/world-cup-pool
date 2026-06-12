export default async function handler(req, res) {
  const response = await fetch(
    `https://newsdata.io/api/1/news?apikey=${process.env.NEWSDATA_API_KEY}&q=World+Cup+2026&language=en&category=sports`
  )
  const data = await response.json()

  const articles = (data.results || []).map(article => ({
    title: article.title,
    url: article.link,
    publishedAt: article.pubDate,
    urlToImage: article.image_url
  }))

  res.status(200).json({ articles })
}
