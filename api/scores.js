export default async function handler(req, res) {
  const response = await fetch(
    'https://v3.football.api-sports.io/fixtures?league=1&season=2026&status=FT',
    {
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY
      }
    }
  )
  const data = await response.json()
  res.status(200).json(data)
}