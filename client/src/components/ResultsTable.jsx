import './ResultsTable.css'

function Skeleton() {
  return (
    <div className="results-skeleton">
      {[1,2,3,4].map(i => <div key={i} className="results-skeleton__row" />)}
    </div>
  )
}

function Badge({ rank }) {
  if (rank === 1) return <span className="badge badge--best">Best rate</span>
  if (rank === 2) return <span className="badge badge--second">2nd</span>
  return null
}

export default function ResultsTable({ results, loading, query }) {
  const formatted = query
    ? `$${Number(query.amount).toLocaleString()} USD → ${query.to}`
    : ''

  return (
    <section className="results" aria-label="Rate comparison results">
      <div className="results__header">
        <h2 className="results__title">
          {loading ? 'Finding best rates…' : `Rates for ${formatted}`}
        </h2>
        {!loading && results && (
          <p className="results__updated">Updated just now · Rates include all fees</p>
        )}
      </div>

      {loading && <Skeleton />}

      {!loading && results && (
        <div className="results__cards">
          {results.map((r, i) => (
            <article key={r.provider} className={`result-card ${i === 0 ? 'result-card--best' : ''}`}>
              <div className="result-card__top">
                <div className="result-card__provider">
                  <span className="result-card__name">{r.name}</span>
                  <Badge rank={i + 1} />
                </div>
                <div className="result-card__amount">
                  <span className="result-card__receives">
                    {r.receivedAmount
                      ? Number(r.receivedAmount).toLocaleString('en-US', { maximumFractionDigits: 0 })
                      : '—'}
                  </span>
                  <span className="result-card__currency">{query?.to}</span>
                </div>
              </div>

              <div className="result-card__meta">
                <div className="result-card__stat">
                  <span className="result-card__stat-label">Exchange rate</span>
                  <span className="result-card__stat-val">
                    {r.rate ? r.rate.toFixed(4) : '—'}
                  </span>
                </div>
                <div className="result-card__stat">
                  <span className="result-card__stat-label">Fee</span>
                  <span className="result-card__stat-val">
                    {r.fee != null ? `$${Number(r.fee).toFixed(2)}` : '—'}
                  </span>
                </div>
                <div className="result-card__stat">
                  <span className="result-card__stat-label">Delivery</span>
                  <span className="result-card__stat-val">{r.deliveryTime || '—'}</span>
                </div>
              </div>

              {r.affiliateUrl && (
                <a
                  href={r.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="result-card__cta"
                >
                  Send with {r.name}
                </a>
              )}

              {r.error && (
                <p className="result-card__error">Rate unavailable right now</p>
              )}
            </article>
          ))}
        </div>
      )}

      {!loading && results?.length === 0 && (
        <p className="results__empty">No rates found — try again in a moment.</p>
      )}
    </section>
  )
}
