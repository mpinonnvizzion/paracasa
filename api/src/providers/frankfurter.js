/**
 * Frankfurter — free mid-market rate API, no key needed.
 * Used as a reference "market average" card: we apply a typical 2% markup
 * since real providers always price above the pure mid-market rate.
 */
export async function fetchFrankfurter({ amount, from, to }) {
  const url = `https://api.frankfurter.app/latest?from=${from}&to=${to}`

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(6000),
  })

  if (!res.ok) throw new Error(`Frankfurter HTTP ${res.status}`)

  const data = await res.json()
  const midRate = data?.rates?.[to]
  if (!midRate) throw new Error('No rate in Frankfurter response')

  const customerRate = midRate * 0.98
  const fee = 4.99
  const received = (amount - fee) * customerRate

  return {
    provider: 'market_avg',
    name: 'Market Average',
    rate: customerRate,
    fee,
    receivedAmount: received,
    deliveryTime: '1 – 3 days',
    affiliateUrl: null,
    isReference: true,
  }
}
