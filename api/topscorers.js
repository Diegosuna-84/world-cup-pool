export default async function handler(req, res) {
  const response = await fetch(
    'https://v3.football.api-sports.io/players/topscorers?league=1&season=2026',
    {
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY
      }
    }
  )
  const data = await response.json()

  const topScorers = (data.response || []).slice(0, 10).map(item => ({
    playerId: item.player.id,
    name: item.player.name,
    photo: item.player.photo,
    team: item.statistics?.[0]?.team?.name || null,
    teamLogo: item.statistics?.[0]?.team?.logo || null,
    goals: item.statistics?.[0]?.goals?.total ?? 0,
  }))

  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
  res.status(200).json(topScorers)
}