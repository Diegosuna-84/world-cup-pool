export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      {
        headers: {
          'x-apisports-key': process.env.VITE_FOOTBALL_API_KEY
        }
      }
    )
    const data = await response.json()

    if (!data.response || data.response.length === 0) {
      return res.status(200).json({
        debug: true,
        keyPresent: !!process.env.VITE_FOOTBALL_API_KEY,
        apiStatus: response.status,
        rawData: data
      })
    }

    const matches = data.response.map(item => ({
      id: item.fixture.id,
      home: item.teams.home.name,
      away: item.teams.away.name,
      homeLogo: item.teams.home.logo,
      awayLogo: item.teams.away.logo,
      group: item.league.round,
      date: item.fixture.date,
      status: item.fixture.status.short,
      homeScore: item.goals.home,
      awayScore: item.goals.away,
    }))

    res.status(200).json(matches)
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack })
  }
}