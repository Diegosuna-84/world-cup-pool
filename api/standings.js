export default async function handler(req, res) {
  const response = await fetch(
    'https://v3.football.api-sports.io/standings?league=1&season=2026',
    {
      headers: {
        'x-apisports-key': process.env.FOOTBALL_API_KEY
      }
    }
  )
  const data = await response.json()

  const rawStandings = data.response?.[0]?.league?.standings || []

  const standings = rawStandings.flat().map(item => ({
    teamId: item.team.id,
    teamName: item.team.name,
    group: item.group,
    rank: item.rank,
    points: item.points,
    goalsFor: item.all.goals.for,
  }))

  res.status(200).json(standings)
}