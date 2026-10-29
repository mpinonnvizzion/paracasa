/**
 * Wise public rate endpoint — no API key required for exchange rate quotes.
 * Wise affiliate links use the referral param; swap in your own if available.
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

  // Wise fee is typically $0 for personal USD→MXN bank transfers (using balance)
  // Conservative estimate: $0.50 for debit card sends
  const fee = amount >= 500 ? 0.5 : 0.5
  const received = (amount - fee) * rate

  return {
    provider: 'wise',
    name: 'Wise',
    rate,
    fee,
    receivedAmount: received,
    deliveryTime: 'Instant – 1 day',
    affiliateUrl: `https://wise.com/invite/u/paracasa?amount=${amount}&sourceCurrency=${from}&targetCurrency=${to}`,
  }
}
