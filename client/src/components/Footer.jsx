import './Footer.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <span className="footer__brand">⌂ ParaCasa</span>
        <p className="footer__note">
          Rates are fetched live and may vary. Always confirm the final amount
          on the provider's site before sending.
        </p>
        <p className="footer__copy">© {year} ParaCasa · paracasa.tech</p>
      </div>
    </footer>
  )
}
