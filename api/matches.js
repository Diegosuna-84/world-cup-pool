export default async function handler(req, res) {
  const response = await fetch('https://worldcup26.ir/get/games')
  const data = await response.json()
  const matches = data.games || data
  res.status(200).json(matches)
}