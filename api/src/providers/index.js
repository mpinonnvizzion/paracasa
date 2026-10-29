import { fetchWise } from './wise.js'
import { fetchRemitly } from './remitly.js'
import { fetchWesternUnion } from './westernunion.js'
import { fetchXe } from './xe.js'

const PROVIDERS = [fetchWise, fetchRemitly, fetchWesternUnion, fetchXe]

/**
 * Fetch rates from all providers in parallel.
 * Failed providers are included with error=true so the UI can show a "unavailable" slot.
 * Results are sorted by receivedAmount descending (best deal first).
 */
export async function compareRates({ amount, from, to }) {
  const settled = await Promise.allSettled(
    PROVIDERS.map(fn => fn({ amount, from, to }))
  )

  const results = settled.map((result, i) => {
    if (result.status === 'fulfilled') {
      return result.value
    }
    // Return a placeholder for failed providers so UI can acknowledge them
    const name = ['Wise', 'Remitly', 'Western Union', 'XE'][i]
    return {
      provider: name.toLowerCase().replace(' ', ''),
      name,
      error: true,
      rate: null,
      fee: null,
      receivedAmount: null,
      deliveryTime: null,
      affiliateUrl: null,
    }
  })

  // Sort: successful results by receivedAmount desc, errors last
  results.sort((a, b) => {
    if (a.error && !b.error) return 1
    if (!a.error && b.error) return -1
    return (b.receivedAmount ?? 0) - (a.receivedAmount ?? 0)
  })

  return results
}
