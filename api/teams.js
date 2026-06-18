export default async function handler(req, res) {
  const response = await fetch(
    'https://v3.football.api-sports.io/teams?league=1&season=2026',
    {
      headers: {
        'x-apisports-key': process.env.VITE_FOOTBALL_API_KEY
      }
    }
  )
  const data = await response.json()
  const teams = (data.response || []).map(item => ({
    name: item.team.name,
    code: item.team.id,
    logo: item.team.logo,
  }))

  res.status(200).json({ response: teams })
}