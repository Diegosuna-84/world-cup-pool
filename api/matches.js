export default async function handler(req, res) {
  const response = await fetch(
    'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
    {
      headers: {
        'x-apisports-key': process.env.VITE_FOOTBALL_API_KEY
      }
    }
  )
  const data = await response.json()

  const matches = (data.response || []).map(item => ({
    id:             item.fixture.id,
    home:           item.teams.home.name,
    away:           item.teams.away.name,
    homeLogo:       item.teams.home.logo,
    awayLogo:       item.teams.away.logo,
    group:          item.league.round,
    date:           item.fixture.date,
    status:         item.fixture.status.short,
    homeScore:      item.goals.home,
    awayScore:      item.goals.away,
    venueName:      item.fixture.venue.name,
    venueCity:      item.fixture.venue.city,
    homeScoreFull:  item.score.fulltime.home,
    awayScoreFull:  item.score.fulltime.away,
    elapsedMinutes: item.fixture.status.elapsed,
  }))

  res.status(200).json(matches)
}
