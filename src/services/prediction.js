const N8N_BASE = 'https://kadowebstudio.app.n8n.cloud/webhook'

export const getMatches = async () => {
  const response = await fetch(`${N8N_BASE}/get-matches`)
  return response.json()
}

export const submitPrediction = async (matchData) => {
  const response = await fetch(`${N8N_BASE}/submit-prediction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(matchData)
  })
  return response.json()
}