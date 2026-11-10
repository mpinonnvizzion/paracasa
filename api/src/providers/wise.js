/**
 * Wise's public /v1/rates endpoint now requires an API token (401 without one),
 * so it can't be used for anonymous requests. We source the mid-market rate from
 * open.er-api.com (free, no key) instead and apply Wise's published flat-fee
 * tiers on top, since Wise prices very close to true mid-market.
 */
export async function fetchWise({ amount, from, to }) {
  const url = `https://open.er-api.com/v6/latest/${from}`

  const res = await fetch(url, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(6000),
  })

  if (!res.ok) throw new Error(`Wise rate source HTTP ${res.status}`)

  const data = await res.json()
  if (data?.result !== 'success') throw new Error('Wise rate source returned an error')
  const rate = data?.rates?.[to]
  if (!rate) throw new Error('No rate in Wise rate source response')

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
