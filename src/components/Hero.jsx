import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { scrollTo } from '../utils/smoothScroll'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Hero.module.css'

import layer1 from '../assets/blob/layer-1.png'
import layer2 from '../assets/blob/layer-2.png'
import layer3 from '../assets/blob/layer-3.png'
import layer4 from '../assets/blob/layer-4.png'
import layer5 from '../assets/blob/layer-5.png'

const BLOB_LAYERS = [layer1, layer2, layer3, layer4, layer5]

const TRAIL = [
  { label: 'Into the Prompt',  bg: 'linear-gradient(135deg,#e8a020 0%,#b36800 100%)' },
  { label: 'MotionLANG',       bg: 'linear-gradient(135deg,#1a1a2e 0%,#3dba7e 100%)' },
  { label: 'DocMIND',          bg: 'linear-gradient(135deg,#2d1b69 0%,#7c3aed 100%)' },
  { label: 'SolTrim',          bg: 'linear-gradient(135deg,#1c1c1c 0%,#3a3530 100%)' },
  { label: 'AI Engineering',   bg: 'linear-gradient(135deg,#0a2a1a 0%,#1a6640 100%)' },
  { label: 'AR · 2025',        bg: 'linear-gradient(135deg,#1a1008 0%,#e8a020 100%)' },
]

const TICKER = [
  'Frontend Development', '·', 'React.js', '·', 'GSAP', '·',
  'AI Engineering', '·', 'Sri Lanka', '·', 'Next.js', '·', 'Open to Work', '·',
]

export default function Hero() {
  const heroRef    = useRef(null)
  const infoRef    = useRef(null)
  const firstRef   = useRef(null)
  const lastRowRef = useRef(null)
  const metaRef    = useRef(null)
  const descRef    = useRef(null)
  const ctaRef     = useRef(null)
  const trailRef   = useRef(null)
  const blobRefs   = useRef([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const isMobile = window.innerWidth < 768
    const blobs = blobRefs.current.filter(Boolean)

    // Start with layer-1 visible (handoff from loader)
    gsap.set(blobs, { opacity: 0 })
    gsap.set(blobs[0], { opacity: 1 })

    // ── Blob scroll reveal ─────────────────────────────────
    // Trigger is the .hero-scroll-wrapper (parent), not the sticky hero.
    // This works with Lenis because we're not using GSAP pin at all —
    // the sticky CSS does the pinning, ScrollTrigger just reads scroll pos.
    if (!reducedMotion) {
      const wrapper = heroRef.current.closest('.hero-scroll-wrapper')

      const st = ScrollTrigger.create({
        trigger: wrapper,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate(self) {
          const p = self.progress

          if (p <= 0) {
            // At top: show layer-1
            gsap.set(blobs, { opacity: 0 })
            gsap.set(blobs[0], { opacity: 1 })
            return
          }

          if (p >= 1) {
            // Fully scrolled: all blobs gone
            gsap.set(blobs, { opacity: 0 })
            return
          }

          // p 0→0.85: step frames 0→4
          // p 0.85→1: frame 4 fades out
          if (p < 0.85) {
            const frameIndex = Math.min(
              Math.floor((p / 0.85) * blobs.length),
              blobs.length - 1
            )
            blobs.forEach((b, i) => gsap.set(b, { opacity: i === frameIndex ? 1 : 0 }))
          } else {
            const fadeP = (p - 0.85) / 0.15
            blobs.forEach((b, i) => gsap.set(b, { opacity: i === blobs.length - 1 ? Math.max(0, 1 - fadeP) : 0 }))
          }
        },
      })

      // Immediately call update at progress=0 so layer-1 is correct on mount
      st.update()
    }

    // ── Hero content enter animation ──────────────────────
    const ctx = gsap.context(() => {
      const firstChars = firstRef.current.querySelectorAll(`.${styles.firstChar}`)
      const lastChars  = heroRef.current.querySelectorAll(`.${styles.lastChar}`)
      const descWords  = descRef.current.querySelectorAll('span')

      if (reducedMotion) {
        gsap.set([firstChars, lastChars, descWords,
                  ctaRef.current.children, infoRef.current.children], { clearProps: 'all' })
        return
      }

      gsap.set(infoRef.current.children, { opacity: 0, y: 12 })
      gsap.set(firstChars,               { y: '110%', opacity: 0 })
      gsap.set(lastChars,                { y: '80%', opacity: 0, skewX: -8 })
      gsap.set(descWords,                { y: 14, opacity: 0 })
      gsap.set(ctaRef.current.children,  { scale: 0.88, opacity: 0, y: 8 })
      gsap.set(metaRef.current,          { opacity: 0 })

      const tl = gsap.timeline({ delay: 0.15 })
      tl.to(infoRef.current.children, { opacity: 1, y: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out' }, 0)
      tl.to(firstChars,  { y: '0%', opacity: 1, duration: 0.9, stagger: 0.07, ease: 'expo.out' }, 0.1)
      tl.to(lastChars,   { y: '0%', opacity: 1, skewX: 0, duration: 0.8, stagger: 0.04, ease: 'expo.out' }, 0.45)
      tl.to(metaRef.current, { opacity: 1, duration: 0.6, ease: 'power2.out' }, 0.7)
      tl.to(descWords,   { y: 0, opacity: 1, stagger: 0.025, duration: 0.5, ease: 'power2.out' }, 0.85)
      tl.to(ctaRef.current.children, { scale: 1, opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'expo.out' }, 1.05)
    }, heroRef)

    // ── Image trail ───────────────────────────────────────
    if (!isMobile && !reducedMotion) {
      const items  = trailRef.current.querySelectorAll(`.${styles.trailItem}`)
      let trailIdx = 0
      let lastX = 0, lastY = 0

      const onMove = (e) => {
        const dx = e.clientX - lastX
        const dy = e.clientY - lastY
        if (Math.sqrt(dx * dx + dy * dy) < 32) return
        lastX = e.clientX; lastY = e.clientY

        const item = items[trailIdx % items.length]
        trailIdx++
        gsap.killTweensOf(item)
        gsap.set(item, { x: e.clientX - 100, y: e.clientY - 135, rotation: gsap.utils.random(-14, 14), scale: 1, opacity: 1, zIndex: 50 + (trailIdx % 8) })
        gsap.to(item,  { opacity: 0, y: e.clientY - 200, scale: 0.88, duration: 1.1, ease: 'power2.out', delay: 0.45 })
      }

      const hero = heroRef.current
      hero.addEventListener('mousemove', onMove, { passive: true })
      return () => {
        ctx.revert()
        hero.removeEventListener('mousemove', onMove)
      }
    }

    return () => ctx.revert()
  }, [reducedMotion])

  const descWords = '7+ years building production-grade web applications — from Figma to deployment. React · Next.js · GSAP · AI Engineering.'
    .split(' ').map((w, i) => (
      <span key={i} style={{ display: 'inline-block', marginRight: '0.3em' }}>{w}</span>
    ))

  return (
    <section ref={heroRef} className={styles.hero} id="top" data-theme="dark">

      {/* Blob overlay — fixed, layer-1 on load, steps 1→5→gone on scroll */}
      <div className={styles.heroBlobOverlay} aria-hidden="true">
        {BLOB_LAYERS.map((src, i) => (
          <div
            key={i}
            ref={el => (blobRefs.current[i] = el)}
            className={styles.heroBlobFrame}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div ref={infoRef} className={styles.infoBar}>
        <span className={styles.infoLeft}>
          <span className={styles.infoLabel}>AR · Portfolio</span>
          <span className={styles.infoSep}>/</span>
          <span className={styles.infoLabel}>2025</span>
        </span>
        <span className={styles.infoRight}>
          <span className={styles.availDot} aria-hidden="true" />
          <span className={styles.infoLabel}>Available for Work</span>
        </span>
      </div>

      <div className={styles.nameBlock}>
        <div ref={firstRef} className={styles.nameFirst} aria-label="Akila">
          {'AKILA'.split('').map((c, i) => (
            <span key={i} className={styles.firstChar} aria-hidden="true">{c}</span>
          ))}
        </div>
        <div ref={metaRef} className={styles.nameMeta}>
          <span className={styles.role}>Senior Frontend Developer</span>
          <span ref={lastRowRef} className={styles.nameLast} aria-label="Ranasinghe">
            {'Ranasinghe'.split('').map((c, i) => (
              <span key={i} className={styles.lastChar} aria-hidden="true">{c}</span>
            ))}
          </span>
        </div>
      </div>

      <div className={styles.heroBottom}>
        <p ref={descRef} className={styles.desc}>{descWords}</p>
        <div ref={ctaRef} className={styles.cta}>
          <a href="#projects" className={styles.btnPrimary} data-cursor="hover"
            onClick={(e) => { e.preventDefault(); scrollTo('#projects') }}>View Work</a>
          <a href="#contact" className={styles.btnGhost} data-cursor="hover"
            onClick={(e) => { e.preventDefault(); scrollTo('#contact') }}>
            Get In Touch<span className={styles.btnArrow} aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <div className={styles.ticker} aria-hidden="true">
        <div className={styles.tickerTrack}>
          {[...TICKER, ...TICKER].map((item, i) => (
            <span key={i} className={item === '·' ? styles.tickerDot : styles.tickerItem}>{item}</span>
          ))}
        </div>
      </div>

      <div ref={trailRef} className={styles.trail} aria-hidden="true">
        {TRAIL.map((item, i) => (
          <div key={i} className={styles.trailItem} style={{ background: item.bg }}>
            <span className={styles.trailLabel}>{item.label}</span>
          </div>
        ))}
      </div>

    </section>
  )
}