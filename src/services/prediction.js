export const getMatches = async () => {
  const response = await fetch('/api/matches')
  return response.json()
}
