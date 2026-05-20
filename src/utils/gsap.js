import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CustomEase } from 'gsap/CustomEase'

// Register plugins exactly once
gsap.registerPlugin(ScrollTrigger, CustomEase)

// ---------------------------------------------------------------------------
// Custom eases — defined once, referenced by name everywhere.
// ---------------------------------------------------------------------------
CustomEase.create('reveal',   'M0,0 C0.16,1 0.3,1 1,1')       // elastic snap for reveals
CustomEase.create('glide',    'M0,0 C0.25,0.1 0.25,1 1,1')    // smooth cubic entry
CustomEase.create('retract',  'M0,0 C0.7,0 0.84,0 1,1')       // fast exit
CustomEase.create('magnetic', 'M0,0 C0.215,0.61 0.355,1 1,1') // cursor snap

// ---------------------------------------------------------------------------
// Lenis ↔ ScrollTrigger sync
//
// NOTE: window.lenis is guaranteed to exist by main.jsx before this module
// is evaluated (main.jsx sets it up before any React/import chain fires).
//
// scrollerProxy tells ScrollTrigger to ask Lenis for scroll position instead
// of the real window.scrollY. Without this, scrub animations are off by
// exactly the Lenis easing lag.
// ---------------------------------------------------------------------------
ScrollTrigger.scrollerProxy(document.documentElement, {
  scrollTop(value) {
    if (arguments.length && window.lenis) {
      window.lenis.scrollTo(value, { immediate: true })
    }
    return window.lenis?.scroll ?? window.scrollY
  },
  getBoundingClientRect() {
    return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight }
  },
  // Tell ScrollTrigger this is a fixed-marker scroller (not pinned)
  pinType: document.documentElement.style.transform ? 'transform' : 'fixed',
})

// Every time Lenis scrolls, tell ScrollTrigger to update its progress values.
// Without this, scroll-scrub animations stutter because ScrollTrigger only
// updates on the browser's native scroll event, not on Lenis's smoothed values.
window.lenis?.on('scroll', ScrollTrigger.update)

// Also keep ScrollTrigger's normalizer off — we're doing our own scrolling
ScrollTrigger.normalizeScroll(false)

export { gsap, ScrollTrigger }