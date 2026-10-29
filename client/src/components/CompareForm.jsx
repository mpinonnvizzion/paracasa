import { useState } from 'react'
import './CompareForm.css'

const CORRIDORS = [
  { from: 'USD', to: 'MXN', label: 'USD → MXN (Mexico)' },
  { from: 'USD', to: 'GTQ', label: 'USD → GTQ (Guatemala)' },
  { from: 'USD', to: 'HNL', label: 'USD → HNL (Honduras)' },
  { from: 'USD', to: 'SVC', label: 'USD → SVC (El Salvador)' },
]

const AMOUNTS = [200, 500, 1000, 2000]

export default function CompareForm({ onCompare, loading }) {
  const [amount, setAmount] = useState(500)
  const [customAmount, setCustomAmount] = useState('')
  const [corridor, setCorridor] = useState(CORRIDORS[0])

  function handleSubmit(e) {
    e.preventDefault()
    const sendAmount = customAmount ? Number(customAmount) : amount
    if (!sendAmount || sendAmount < 1) return
    onCompare({ amount: sendAmount, from: corridor.from, to: corridor.to })
  }

  return (
    <section className="compare-form-wrap" id="compare">
      <form className="compare-form" onSubmit={handleSubmit}>
        <div className="compare-form__row">
          <div className="compare-form__group">
            <label htmlFor="corridor">Sending to</label>
            <select
              id="corridor"
              value={corridor.from + corridor.to}
              onChange={e => setCorridor(CORRIDORS.find(c => c.from + c.to === e.target.value))}
            >
              {CORRIDORS.map(c => (
                <option key={c.from + c.to} value={c.from + c.to}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="compare-form__group">
            <label>Amount (USD)</label>
            <div className="compare-form__amounts">
              {AMOUNTS.map(a => (
                <button
                  key={a}
                  type="button"
                  className={`compare-form__chip ${amount === a && !customAmount ? 'active' : ''}`}
                  onClick={() => { setAmount(a); setCustomAmount('') }}
                >
                  ${a.toLocaleString()}
                </button>
              ))}
              <input
                type="number"
                min="1"
                placeholder="Other"
                value={customAmount}
                onChange={e => { setCustomAmount(e.target.value); setAmount(null) }}
                className="compare-form__custom"
                aria-label="Custom amount"
              />
            </div>
          </div>
        </div>

        <button type="submit" className="compare-form__submit" disabled={loading}>
          {loading ? 'Fetching rates…' : 'Compare rates'}
        </button>
      </form>
    </section>
  )
}
