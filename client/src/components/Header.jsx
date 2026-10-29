import { useState, useEffect } from 'react'
import './Header.css'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <a href="/" className="header__logo" aria-label="ParaCasa home">
        <span className="header__logo-mark">⌂</span>
        <span className="header__logo-text">ParaCasa</span>
      </a>
      <nav className="header__nav" aria-label="Main">
        <a href="#how-it-works">How it works</a>
        <a href="#compare" className="header__cta">Compare rates</a>
      </nav>
    </header>
  )
}
