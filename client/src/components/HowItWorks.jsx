import './HowItWorks.css'

const STEPS = [
  {
    n: '1',
    title: 'Enter your amount',
    body: 'Tell us how much you want to send and where it\'s going.'
  },
  {
    n: '2',
    title: 'We compare in real time',
    body: 'We pull live rates from Wise, Remitly, Western Union and more — including all fees.'
  },
  {
    n: '3',
    title: 'Send with the best rate',
    body: 'Click through to the provider with the best deal. No sign-up needed here.'
  },
]

export default function HowItWorks() {
  return (
    <section className="how" id="how-it-works">
      <div className="how__inner">
        <h2 className="how__title">No guesswork. No surprises.</h2>
        <ol className="how__steps">
          {STEPS.map(s => (
            <li key={s.n} className="how__step">
              <div className="how__step-num" aria-hidden="true">{s.n}</div>
              <div>
                <h3 className="how__step-title">{s.title}</h3>
                <p className="how__step-body">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
