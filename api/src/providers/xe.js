/**
 * XE Currency Data API — free tier available.
 * Sign up at https://xecdapi.xe.com/ to get API key.
 * Falls back to a reasonable offset from mid-market if not configured.
 */
export async function fetchXe({ amount, from, to }) {
  const id = process.env.XE_API_ID
  const key = process.env.XE_API_KEY

  let rate
  if (id && key) {
    const url = `https://xecdapi.xe.com/v1/convert_from/?from=${from}&to=${to}&amount=1`
    const res = await fetch(url, {
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${id}:${key}`).toString('base64'),
        'Accept': 'application/json',
      },
      signal: AbortSignal.timeout(6000),
    })
    if (!res.ok) throw new Error(`XE HTTP ${res.status}`)
    const data = await res.json()
    rate = data.to?.[0]?.mid
  } else {
    // XE not configured — skip this provider gracefully
    throw new Error('XE API not configured')
  }

  if (!rate) throw new Error('No rate in XE response')

  // XE charges a fee as a spread; approximate 1.5% markup from mid-market
  const customerRate = rate * 0.985
  const fee = 4.99
  const received = (amount - fee) * customerRate

  return {
    provider: 'xe',
    name: 'XE Money Transfer',
    rate: customerRate,
    fee,
    receivedAmount: received,
    deliveryTime: '1 – 2 days',
    affiliateUrl: `https://www.xe.com/xemoneytransfer/?fromCurrency=${from}&toCurrency=${to}`,
  }
}
