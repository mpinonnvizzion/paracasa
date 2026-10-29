import { useState } from 'react'
import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import CompareForm from './components/CompareForm.jsx'
import ResultsTable from './components/ResultsTable.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Story from './components/Story.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState(null)

  async function handleCompare({ amount, from, to }) {
    setLoading(true)
    setResults(null)
    setQuery({ amount, from, to })
    try {
      const res = await fetch(`/api/compare?amount=${amount}&from=${from}&to=${to}`)
      const data = await res.json()
      setResults(data.results)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <CompareForm onCompare={handleCompare} loading={loading} />
        {(loading || results) && (
          <ResultsTable results={results} loading={loading} query={query} />
        )}
        <HowItWorks />
        <Story />
      </main>
      <Footer />
    </>
  )
}
