import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { scrollTo } from '../utils/smoothScroll'
import { scrambleText } from '../utils/textScramble'
import styles from './Nav.module.css'

const NAV_ITEMS = [
  { id: 'about',      label: 'About' },
  { id: 'projects',   label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact',    label: 'Contact' },
]

export default function Nav() {
  const navRef    = useRef(null)
  const logoRef   = useRef(null)
  const linksRef  = useRef([])
  const statusRef = useRef(null)
  const [active,   setActive]   = useState(null)
  const [scrolled, setScrolled] = useState(false)
  const reducedMotion = useReducedMotion()

  // ── Scramble on link hover ──────────────────────────────
  useEffect(() => {
    if (reducedMotion) return
    const cleanups = []

    linksRef.current.filter(Boolean).forEach((el, i) => {
      const original = NAV_ITEMS[i].label
      let cancel

      const onEnter = () => {
        if (cancel) cancel()
        cancel = scrambleText(el, original, 600)
      }
      const onLeave = () => {
        if (cancel) cancel()
        el.textContent = original
      }

      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        if (cancel) cancel()
      })
    })

    return () => cleanups.forEach(fn => fn())
  }, [reducedMotion])

  // ── Scroll-based: scrolled state + hide/show ───────────
  useEffect(() => {
    if (reducedMotion) {
      gsap.set(navRef.current, { opacity: 1, y: 0 })
      return
    }

    const ctx = gsap.context(() => {
      gsap.set(navRef.current, { y: -100, opacity: 0 })
      gsap.set(
        [logoRef.current, ...linksRef.current, statusRef.current].filter(Boolean),
        { y: -20, opacity: 0 }
      )

      gsap.to(navRef.current, {
        y: 0, opacity: 1, duration: 0.8, ease: 'reveal', delay: 0.3,
        onComplete: () => { if (navRef.current) navRef.current.style.willChange = 'auto' }
      })
      gsap.to(
        [logoRef.current, ...linksRef.current, statusRef.current].filter(Boolean),
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.06, ease: 'glide', delay: 0.5 }
      )

      // Hide/show on scroll direction
      let lastScroll = 0
      const unsub = window.lenis?.on('scroll', ({ scroll }) => {
        const delta = scroll - lastScroll
        lastScroll  = scroll

        setScrolled(scroll > 60)

        if (scroll < 80) {
          gsap.to(navRef.current, { y: 0, duration: 0.4, ease: 'glide', overwrite: 'auto' })
        } else if (delta > 0) {
          gsap.to(navRef.current, { y: -100, duration: 0.3, ease: 'retract', overwrite: 'auto' })
        } else {
          gsap.to(navRef.current, { y: 0, duration: 0.4, ease: 'glide', overwrite: 'auto' })
        }
      })

      // Active section detection
      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end:   'bottom center',
          onEnter:     () => setActive(id),
          onLeave:     () => setActive(null),
          onEnterBack: () => setActive(id),
          onLeaveBack: () => setActive(null),
        })
      })

      return () => unsub?.()
    }, navRef)

    return () => ctx.revert()
  }, [reducedMotion])

  const navClass = [
    styles.nav,
    scrolled ? styles.scrolled : '',
  ].filter(Boolean).join(' ')

  return (
    <nav ref={navRef} className={navClass}>
      <a
        ref={logoRef}
        href="#top"
        className={styles.logo}
        data-cursor="hover"
        onClick={(e) => { e.preventDefault(); scrollTo('#top') }}
      >
        AR — Portfolio
      </a>

      <ul className={styles.links}>
        {NAV_ITEMS.map(({ id, label }, i) => (
          <li key={id} style={{ position: 'relative' }}>
            <a
              ref={el => (linksRef.current[i] = el)}
              href={`#${id}`}
              data-cursor="nav"
              onClick={(e) => { e.preventDefault(); scrollTo(`#${id}`) }}
              className={active === id ? styles.linkActive : ''}
            >
              {label}
            </a>
            {active === id && (
              <motion.span
                layoutId="nav-underline"
                className={styles.underline}
                initial={false}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
          </li>
        ))}
      </ul>

      <div className={styles.navRight}>
        <a
          href={`${import.meta.env.BASE_URL.replace(/\/$/, '')}/Akila_Ranasinghe_CV.pdf`}
          download="Akila_Ranasinghe_CV.pdf"
          className={styles.cvBtn}
          data-cursor="hover"
        >
          Download CV
        </a>

        <span ref={statusRef} className={styles.status}>
          <span className={styles.dot} />
          Open to work
        </span>
      </div>
    </nav>
  )
}