/**
 * Remitly — no official public API.
 * We use their public rate widget endpoint (observed from their web app).
 * This may break if Remitly changes their API; build in graceful fallback.
 */
export async function fetchRemitly({ amount, from, to }) {
  // Remitly's public marketing endpoint — returns rate card for corridor
  const url = `https://api.remitly.io/v2/rates?senderCurrency=${from}&receiverCurrency=${to}&amount=${amount}&sendAmount=true`

  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; ParaCasa/1.0)',
      'Origin': 'https://www.remitly.com',
      'Referer': 'https://www.remitly.com/',
    },
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`Remitly HTTP ${res.status}`)

  const data = await res.json()

  // Try to extract rate from multiple possible shapes
  const rateObj = data?.rates?.[0] || data?.rate || data
  const rate = rateObj?.exchangeRate || rateObj?.rate
  const fee = rateObj?.transferFee?.amount ?? rateObj?.fee ?? 3.99
  const received = rateObj?.receiveAmount || (amount - fee) * rate

  if (!rate) throw new Error('Could not parse Remitly rate')

  return {
    provider: 'remitly',
    name: 'Remitly',
    rate: parseFloat(rate),
    fee: parseFloat(fee),
    receivedAmount: parseFloat(received),
    deliveryTime: 'Minutes – 3 days',
    affiliateUrl: `https://www.remitly.com/us/en/mexico?utm_source=paracasa`,
  }
}
