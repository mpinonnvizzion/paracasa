/**
 * Western Union — uses their public price estimator endpoint.
 * Observed from wu.com network traffic.
 */
export async function fetchWesternUnion({ amount, from, to }) {
  // WU public price estimate
  const url = 'https://www.westernunion.com/wuconnect/rest/pricesService/price/estimation'
  const body = {
    senderCountryCode: 'US',
    senderCurrencyCode: from,
    sendAmount: String(amount),
    receiverCountryCode: to === 'MXN' ? 'MX' : 'MX',
    receiverCurrencyCode: to,
    transferType: 'BANK_ACCOUNT',
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (compatible; ParaCasa/1.0)',
      'Origin': 'https://www.westernunion.com',
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(8000),
  })

  if (!res.ok) throw new Error(`WU HTTP ${res.status}`)

  const data = await res.json()

  const rate = data?.exchangeRate?.value || data?.fxRate
  const fee = data?.fees?.totalFees?.amount || data?.totalFee || 5.0
  const received = data?.payout?.principalAmount?.amount || (amount - fee) * rate

  if (!rate) throw new Error('Could not parse WU rate')

  return {
    provider: 'westernunion',
    name: 'Western Union',
    rate: parseFloat(rate),
    fee: parseFloat(fee),
    receivedAmount: parseFloat(received),
    deliveryTime: 'Minutes – 3 days',
    affiliateUrl: `https://www.westernunion.com/us/en/send-money/app/start?utm_source=paracasa`,
  }
}
