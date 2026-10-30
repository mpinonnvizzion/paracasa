/**
 * Western Union has no public rate API we can call without authentication.
 * Show a static affiliate card instead of attempting a quote.
 */
export async function fetchWesternUnion() {
  return {
    provider: 'westernunion',
    name: 'Western Union',
    rate: null,
    fee: null,
    receivedAmount: null,
    deliveryTime: 'Minutes – 3 days',
    affiliateUrl: 'https://www.westernunion.com/us/en/send-money/app/start',
    isAffiliate: true,
  }
}
