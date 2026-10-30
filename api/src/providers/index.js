import { fetchWise } from './wise.js'
import { fetchFrankfurter } from './frankfurter.js'
import { fetchRemitly } from './remitly.js'
import { fetchWesternUnion } from './westernunion.js'
import { fetchXe } from './xe.js'

const PROVIDERS = [fetchWise, fetchFrankfurter, fetchRemitly, fetchWesternUnion, fetchXe]
const PROVIDER_NAMES = ['Wise', 'Market Average', 'Remitly', 'Western Union', 'XE']

/**
 * Fetch rates from all providers in parallel.
 * Failed providers are included with error=true so the UI can show an "unavailable" slot.
 * Results are ordered: real rates (by receivedAmount desc) → reference → affiliates → errors.
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
    const name = PROVIDER_NAMES[i]
    return {
      provider: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      error: true,
      rate: null,
      fee: null,
      receivedAmount: null,
      deliveryTime: null,
      affiliateUrl: null,
    }
  })

  const rank = (r) => {
    if (r.error) return 3
    if (r.isAffiliate) return 2
    if (r.isReference) return 1
    return 0
  }

  results.sort((a, b) => {
    const rankDiff = rank(a) - rank(b)
    if (rankDiff !== 0) return rankDiff
    return (b.receivedAmount ?? 0) - (a.receivedAmount ?? 0)
  })

  return results
}
