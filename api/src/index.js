import express from 'express'
import cors from 'cors'
import { compareRates } from './providers/index.js'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.get('/api/compare', async (req, res) => {
  const { amount, from = 'USD', to = 'MXN' } = req.query
  const sendAmount = parseFloat(amount)

  if (!sendAmount || sendAmount < 1) {
    return res.status(400).json({ error: 'Invalid amount' })
  }

  try {
    const results = await compareRates({ amount: sendAmount, from, to })
    res.json({ results, fetchedAt: new Date().toISOString() })
  } catch (err) {
    console.error('compare error', err)
    res.status(500).json({ error: 'Failed to fetch rates' })
  }
})

// Vercel serverless export
export default app

// Local dev
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => console.log(`API listening on http://localhost:${PORT}`))
}
