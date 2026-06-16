let countryMapCache = null

export default async function handler(req, res) {
  const [gamesRes, countriesRes] = await Promise.all([
    fetch('https://worldcup26.ir/get/games'),
    countryMapCache ? Promise.resolve(null) : fetch('https://restcountries.com/v3.1/all?fields=name,cca2')
  ])

  const gamesData = await gamesRes.json()

  if (!countryMapCache) {
    const countriesData = await countriesRes.json()
    countryMapCache = {}
    countriesData.forEach(c => {
      countryMapCache[c.name.common.toLowerCase()] = c.cca2
      if (c.name.official) {
        countryMapCache[c.name.official.toLowerCase()] = c.cca2
      }
    })
  }

  const getCode = (name) => {
    if (!name) return ''
    return countryMapCache[name.toLowerCase()] || ''
  }

  const matches = (gamesData.games || gamesData).map(match => ({
    id: match.id,
    home: match.home_team_name_en,
    away: match.away_team_name_en,
    group: match.group,
    matchday: match.matchday,
    date: match.local_date,
    code_home: getCode(match.home_team_name_en),
    code_away: getCode(match.away_team_name_en),
  }))

  res.status(200).json(matches)
}