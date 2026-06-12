export default async function handler(req, res) {
  const response = await fetch(
    `https://newsapi.org/v2/everything?q=World+Cup+2026&language=en&sortBy=publishedAt&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
  )
  const data = await response.json()
  res.status(200).json(data)
}