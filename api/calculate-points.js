import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
  const { data: predictions } = await supabase
    .from('predictions')
    .select('*')
    .eq('points', 0)

  if (!predictions || predictions.length === 0) {
    return res.status(200).json({ message: 'No predictions to process' })
  }

  const response = await fetch(
    'https://v3.football.api-sports.io/fixtures?league=1&season=2026&status=FT',
    { headers: { 'x-apisports-key': process.env.VITE_FOOTBALL_API_KEY } }
  )
  const { response: fixtures } = await response.json()

  if (!fixtures || fixtures.length === 0) {
    return res.status(200).json({ message: 'No finished matches yet' })
  }

  const fixtureMap = {}
  for (const fixture of fixtures) {
    fixtureMap[String(fixture.fixture.id)] = fixture
  }

  for (const prediction of predictions) {
    const fixture = fixtureMap[prediction.match_id]
    if (!fixture) continue

    const homeScore = fixture.goals.home
    const awayScore = fixture.goals.away
    const [predHome, predAway] = prediction.user_pick.split('-').map(Number)
    let points = 0

    if (predHome === homeScore && predAway === awayScore) {
      points = 3
    } else if (
      (predHome > predAway && homeScore > awayScore) ||
      (predHome < predAway && homeScore < awayScore) ||
      (predHome === predAway && homeScore === awayScore)
    ) {
      points = 1
    }

    if (points > 0) {
      await supabase.from('predictions').update({ points }).eq('id', prediction.id)

      const { data: board } = await supabase
        .from('leaderboard').select('*').eq('user_id', prediction.user_id).maybeSingle()

      if (board) {
        await supabase.from('leaderboard')
          .update({ total_points: board.total_points + points })
          .eq('user_id', prediction.user_id)
      }
    }
  }

  res.status(200).json({ message: 'Points calculated' })
}