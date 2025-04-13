import React, { Suspense, useState } from 'react'
import { NavLink, Routes, Route } from 'react-router-dom'

const Home = React.lazy(() => import('./routes/Home'))
const About = React.lazy(() => import('./routes/About'))
const Contact = React.lazy(() => import('./routes/Contact'))

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div id="app">
      <header>
        <nav className="navbar">
          <div className="logo">🌐 Moja SPA</div>
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            ☰
          </button>
          <ul className={`nav-links ${menuOpen ? 'open' : ''}`}>
            <li><NavLink to="/" onClick={() => setMenuOpen(false)}>Strona główna</NavLink></li>
            <li><NavLink to="/about" onClick={() => setMenuOpen(false)}>O nas</NavLink></li>
            <li><NavLink to="/contact" onClick={() => setMenuOpen(false)}>Kontakt</NavLink></li>
          </ul>
        </nav>
      </header>

      <main className="content">
        <Suspense fallback={<p>Ładowanie...</p>}>
          <Routes>
            <Route path="/" element={<Fade><Home /></Fade>} />
            <Route path="/about" element={<Fade><About /></Fade>} />
            <Route path="/contact" element={<Fade><Contact /></Fade>} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

function Fade({ children }) {
  return <div className="fade">{children}</div>
}
