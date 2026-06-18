export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://v3.football.api-sports.io/fixtures?league=1&season=2026',
      {
        headers: {
          'x-apisports-key': 'f8a735cca48a0c5b043eb49cdec3c603'
        }
      }
    )
    const data = await response.json()

    res.status(200).json({
      debug: true,
      apiStatus: response.status,
      rawData: data
    })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}