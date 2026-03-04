import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { LanguageProvider } from './context/LanguageContext'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Objectives from './pages/Objectives'
import Founders from './pages/Founders'
import Principles from './pages/Principles'
import Contact from './pages/Contact'
import WhatWeDo from './pages/WhatWeDo'

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.getElementById('initial-loader')?.remove()
    const t = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(t)
  }, [])

  if (loading) {
    return (
      <div className="app-loading" aria-label="Loading">
        <div className="app-loading__logo">
          <span className="app-loading__sun" aria-hidden="true">☀</span>
          <span className="app-loading__text">Shams <strong>Roj</strong></span>
        </div>
        <div className="app-loading__bar-wrap">
          <div className="app-loading__bar" />
        </div>
        <div className="app-loading__label">Loading …</div>
      </div>
    )
  }

  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/objectives" element={<Objectives />} />
              <Route path="/founders" element={<Founders />} />
              <Route path="/principles" element={<Principles />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/what-we-do" element={<WhatWeDo />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
