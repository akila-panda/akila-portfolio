// All programmatic scrolling must go through Lenis.
// Never use window.scrollTo() or native anchor scroll — it bypasses Lenis
// and creates a dual-scroll conflict that causes jank.

export function scrollTo(target, options = {}) {
  const lenis = window.lenis
  if (!lenis) {
    // Graceful fallback if Lenis hasn't initialised yet
    const el = typeof target === 'string' ? document.querySelector(target) : target
    el?.scrollIntoView({ behavior: 'smooth' })
    return
  }
  lenis.scrollTo(target, {
    offset: -80,     // Account for fixed nav height
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...options,
  })
}