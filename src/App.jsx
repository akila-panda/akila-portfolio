// IMPORTANT: gsap.js MUST be the first import.
import './utils/gsap'

import { useEffect, useState } from 'react'
import { ScrollTrigger } from './utils/gsap'
import Loader from './components/Loader'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Cursor from './components/Cursor'

export default function App() {
  const isTouch = 'ontouchstart' in window
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = 'dark'

    let rafId
    const onResize = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => ScrollTrigger.refresh())
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const onLoaderComplete = () => {
    setLoaded(true)
    // Two frames: let React render Hero, then refresh so ScrollTrigger
    // measures the correct DOM positions from scroll=0
    requestAnimationFrame(() => requestAnimationFrame(() => ScrollTrigger.refresh()))
  }

  return (
    <>
      {!loaded && <Loader onComplete={onLoaderComplete} />}
      {!isTouch && <Cursor />}
      <Nav />
      <main>
        {/*
          Hero is wrapped in a tall div. Hero itself is sticky so it
          stays in view while the user scrolls through the extra height.
          The blob ScrollTrigger uses the wrapper as its trigger — no
          GSAP pin needed, which avoids the Lenis/pin conflict entirely.
        */}
        <div className="hero-scroll-wrapper">
          <Hero />
        </div>
        <About />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  )
}