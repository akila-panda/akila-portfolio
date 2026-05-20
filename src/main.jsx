import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Lenis from 'lenis'
import App from './App.jsx'
import './index.css'

// ---------------------------------------------------------------------------
// 1. Lenis — smooth scroll engine. Must exist BEFORE gsap.js imports fire,
//    because gsap.js references window.lenis in module-level code.
// ---------------------------------------------------------------------------
const lenis = new Lenis({
  // duration / easing control the "feel" of each scroll gesture
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
  orientation: 'vertical',       // lenis v1.x uses 'orientation' not 'direction'
  gestureOrientation: 'vertical',
  smoothWheel: true,
  smoothTouch: false,             // native feel on iOS — fighting it feels broken
  touchMultiplier: 2,
})

// Expose globally — gsap.js reads this at import time
window.lenis = lenis

// RAF loop — lenis must tick every frame. Using its own RAF keeps it
// independent of React's render cycle.
function raf(time) {
  lenis.raf(time)
  requestAnimationFrame(raf)
}
requestAnimationFrame(raf)

// ---------------------------------------------------------------------------
// 2. Font readiness gate — wait for web fonts before revealing the page.
//    document.fonts.ready resolves once all @font-face fonts are loaded.
//    This is what prevents the "fonts change after load" FOUC.
// ---------------------------------------------------------------------------
async function init() {
  try {
    // Give fonts up to 3s; after that, reveal anyway so we never hang
    await Promise.race([
      document.fonts.ready,
      new Promise(resolve => setTimeout(resolve, 3000))
    ])
  } catch {
    // fonts.ready rejected somehow — just continue
  }

  // Reveal the page — smooth fade-in instead of a jarring pop
  const root = document.getElementById('root')
  if (root) root.style.opacity = '1'

  // After fonts are confirmed loaded, force ScrollTrigger to recalculate
  // all trigger positions (fonts can shift layout heights significantly).
  // We import dynamically here to guarantee Lenis exists first.
  const { ScrollTrigger } = await import('./utils/gsap.js')
  // Small delay — let React finish its first paint before refreshing
  setTimeout(() => ScrollTrigger.refresh(), 100)
}

// ---------------------------------------------------------------------------
// 3. Render React. We do NOT wait for fonts before rendering — React starts
//    building the DOM immediately (opacity:0), then we fade in once ready.
// ---------------------------------------------------------------------------
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Kick off the font-wait + reveal sequence
init()