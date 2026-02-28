import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Objectives from './pages/Objectives'
import Founders from './pages/Founders'
import Principles from './pages/Principles'
import Contact from './pages/Contact'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/"            element={<Home />} />
            <Route path="/about"       element={<About />} />
            <Route path="/objectives"  element={<Objectives />} />
            <Route path="/founders"    element={<Founders />} />
            <Route path="/principles"  element={<Principles />} />
            <Route path="/contact"     element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
