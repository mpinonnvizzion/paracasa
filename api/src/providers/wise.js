/**
 * Wise public mid-market rate endpoint — no API key required.
 * We apply Wise's published flat-fee tiers on top of the mid-market rate
 * since the public rate endpoint doesn't return personalized pricing.
 */
export async function fetchWise({ amount, from, to }) {
  const url = `https://api.wise.com/v1/rates?source=${from}&target=${to}`

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(6000),
  })

  if (!res.ok) throw new Error(`Wise HTTP ${res.status}`)

  const data = await res.json()
  // Wise returns an array; first item is the current mid-market rate
  const rate = Array.isArray(data) ? data[0]?.rate : data?.rate
  if (!rate) throw new Error('No rate in Wise response')

  let fee
  if (amount < 300) fee = 0.59
  else if (amount < 1000) fee = 1.49
  else fee = 2.49

  const received = (amount - fee) * rate

  return {
    provider: 'wise',
    name: 'Wise',
    rate,
    fee,
    receivedAmount: received,
    deliveryTime: 'Instant – 1 business day',
    affiliateUrl: 'https://wise.com/us/send-money/usd-to-mxn',
  }
}
