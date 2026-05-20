import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import styles from './Cursor.module.css'

export default function Cursor() {
  const dot     = useRef(null)
  const ring    = useRef(null)
  const label   = useRef(null)  // "VIEW ↗" text inside ring

  useEffect(() => {
    const xDot  = gsap.quickTo(dot.current,  'x', { duration: 0.08, ease: 'none' })
    const yDot  = gsap.quickTo(dot.current,  'y', { duration: 0.08, ease: 'none' })
    const xRing = gsap.quickTo(ring.current, 'x', { duration: 0.45, ease: 'magnetic' })
    const yRing = gsap.quickTo(ring.current, 'y', { duration: 0.45, ease: 'magnetic' })

    const onMove = (e) => {
      xDot(e.clientX)
      yDot(e.clientY)
      xRing(e.clientX)
      yRing(e.clientY)
    }

    // ── Click pulse ──────────────────────────────────────
    const onClick = () => {
      gsap.timeline()
        .to(ring.current, { scale: 1.8, opacity: 0.3, duration: 0.15, ease: 'power2.out', overwrite: 'auto' })
        .to(ring.current, { scale: 1,   opacity: 1,   duration: 0.35, ease: 'expo.out' })
    }

    // ── State machine ────────────────────────────────────
    const resetCursor = () => {
      gsap.to(ring.current, {
        width: 40, height: 40,
        borderRadius: '50%',
        borderColor: 'var(--amber)',
        backgroundColor: 'transparent',
        opacity: 0.8,
        duration: 0.35, ease: 'expo.out', overwrite: 'auto',
      })
      gsap.to(dot.current,  { scale: 1, opacity: 1, duration: 0.25, overwrite: 'auto' })
      gsap.to(label.current, { opacity: 0, duration: 0.15, overwrite: 'auto' })
    }

    const setCursorView = () => {
      // Expand ring, show "VIEW ↗"
      gsap.to(ring.current, {
        width: 80, height: 80,
        borderRadius: '50%',
        borderColor: 'var(--amber)',
        backgroundColor: 'transparent',
        opacity: 1,
        duration: 0.35, ease: 'expo.out', overwrite: 'auto',
      })
      gsap.to(dot.current,   { scale: 0, opacity: 0, duration: 0.2, overwrite: 'auto' })
      gsap.to(label.current, { opacity: 1, duration: 0.25, overwrite: 'auto' })
      if (label.current) label.current.textContent = 'VIEW ↗'
    }

    const setCursorHover = () => {
      // Filled amber circle, no label
      gsap.to(ring.current, {
        width: 56, height: 56,
        borderRadius: '50%',
        backgroundColor: 'var(--amber)',
        borderColor: 'var(--amber)',
        opacity: 0.9,
        duration: 0.3, ease: 'expo.out', overwrite: 'auto',
      })
      gsap.to(dot.current,   { scale: 0, opacity: 0, duration: 0.2, overwrite: 'auto' })
      gsap.to(label.current, { opacity: 0, duration: 0.15, overwrite: 'auto' })
    }

    const setCursorNav = () => {
      // Horizontal pill squish
      gsap.to(ring.current, {
        width: 52, height: 20,
        borderRadius: '20px',
        borderColor: 'var(--amber)',
        backgroundColor: 'transparent',
        opacity: 0.7,
        duration: 0.3, ease: 'expo.out', overwrite: 'auto',
      })
      gsap.to(dot.current,   { scale: 0, opacity: 0, duration: 0.15, overwrite: 'auto' })
      gsap.to(label.current, { opacity: 0, duration: 0.1, overwrite: 'auto' })
    }

    // ── Delegation ───────────────────────────────────────
    const onDocOver = (e) => {
      const view  = e.target.closest('[data-cursor="view"]')
      const hover = e.target.closest('[data-cursor="hover"], button')
      const nav   = e.target.closest('nav a, [data-cursor="nav"]')

      if (view)        setCursorView()
      else if (nav)    setCursorNav()
      else if (hover)  setCursorHover()
    }

    const onDocOut = (e) => {
      const interactive = e.target.closest('[data-cursor], a, button')
      if (!interactive) return
      // Only reset if leaving entirely (not moving to a child)
      const to = e.relatedTarget
      if (to && interactive.contains(to)) return
      resetCursor()
    }

    window.addEventListener('mousemove', onMove,   { passive: true })
    window.addEventListener('click',     onClick,  { passive: true })
    document.addEventListener('mouseover',  onDocOver, { passive: true })
    document.addEventListener('mouseout',   onDocOut,  { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('click',     onClick)
      document.removeEventListener('mouseover',  onDocOver)
      document.removeEventListener('mouseout',   onDocOut)
    }
  }, [])

  return (
    <>
      <div ref={dot}  className={styles.dot}  />
      <div ref={ring} className={styles.ring}>
        <span ref={label} className={styles.ringLabel} />
      </div>
    </>
  )
}