/**
 * Remitly has no public rate API we can call without authentication.
 * Show a static affiliate card instead of attempting a quote.
 */
export async function fetchRemitly() {
  return {
    provider: 'remitly',
    name: 'Remitly',
    rate: null,
    fee: null,
    receivedAmount: null,
    deliveryTime: 'Minutes – 3 days',
    affiliateUrl: 'https://www.remitly.com/us/en/mexico',
    isAffiliate: true,
  }
}
