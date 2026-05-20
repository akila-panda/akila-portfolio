import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { projects } from '../data/portfolio'
import styles from './Projects.module.css'

const PROJECT_BG = [
  'linear-gradient(135deg,#e8a020 0%,#b36800 100%)',
  'linear-gradient(135deg,#1a1a2e 0%,#3dba7e 100%)',
  'linear-gradient(135deg,#2d1b69 0%,#7c3aed 100%)',
  'linear-gradient(135deg,#1c1c1c 0%,#3a3530 100%)',
]

export default function Projects() {
  const sectionRef    = useRef(null)
  const listRef       = useRef(null)
  const previewRef    = useRef(null)
  const drawerRef     = useRef(null)
  const backdropRef   = useRef(null)
  const reducedMotion = useReducedMotion()

  const [active, setActive] = useState(null)   // project object or null

  // ── Drawer open/close ───────────────────────────────────
  useEffect(() => {
    const drawer   = drawerRef.current
    const backdrop = backdropRef.current
    if (!drawer) return

    if (active) {
      gsap.set(drawer, { display: 'flex' })
      gsap.set(backdrop, { display: 'block' })
      gsap.fromTo(drawer,
        { x: '100%' },
        { x: '0%', duration: 0.55, ease: 'expo.out' }
      )
      gsap.fromTo(backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.35 }
      )
      // Lock scroll
      document.body.style.overflow = 'hidden'
    } else {
      gsap.to(drawer, {
        x: '100%', duration: 0.45, ease: 'expo.in',
        onComplete: () => gsap.set(drawer, { display: 'none' }),
      })
      gsap.to(backdrop, {
        opacity: 0, duration: 0.3,
        onComplete: () => gsap.set(backdrop, { display: 'none' }),
      })
      document.body.style.overflow = ''
    }
  }, [active])

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setActive(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Hover-follow + scroll reveals ──────────────────────
  useEffect(() => {
    const isMobile = window.innerWidth < 768
    if (isMobile || reducedMotion) return

    const preview = previewRef.current
    const items   = listRef.current.querySelectorAll(`.${styles.item}`)
    const xTo     = gsap.quickTo(preview, 'x', { duration: 0.55, ease: 'power3.out' })
    const yTo     = gsap.quickTo(preview, 'y', { duration: 0.55, ease: 'power3.out' })

    gsap.set(preview, { opacity: 0, scale: 0.88 })

    const handlers = []

    items.forEach((item, i) => {
      const bg = PROJECT_BG[i] || PROJECT_BG[0]

      const onEnter = () => {
        preview.style.background = bg
        gsap.to(preview, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out', overwrite: 'auto' })
        gsap.to(item.querySelector(`.${styles.num}`),   { color: 'var(--amber)', duration: 0.2, overwrite: 'auto' })
        gsap.to(item.querySelector(`.${styles.arrow}`), { x: 4, y: -4, color: 'var(--amber)', duration: 0.25, overwrite: 'auto' })
      }
      const onLeave = () => {
        gsap.to(preview, { opacity: 0, scale: 0.88, duration: 0.25, ease: 'power2.in', overwrite: 'auto' })
        gsap.to(item.querySelector(`.${styles.num}`),   { color: 'var(--text3)', duration: 0.2, overwrite: 'auto' })
        gsap.to(item.querySelector(`.${styles.arrow}`), { x: 0, y: 0, color: 'var(--text3)', duration: 0.2, overwrite: 'auto' })
      }
      const onMove = (e) => { xTo(e.clientX - 140); yTo(e.clientY - 185) }

      item.addEventListener('mouseenter', onEnter)
      item.addEventListener('mouseleave', onLeave)
      item.addEventListener('mousemove', onMove, { passive: true })
      handlers.push({ item, onEnter, onLeave, onMove })
    })

    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current.querySelector(`.${styles.header}`), {
        y: 40, opacity: 0, duration: 0.8, ease: 'expo.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%', once: true },
      })
      items.forEach((item, i) => {
        gsap.from(item, {
          y: 30, opacity: 0, duration: 0.7, ease: 'expo.out', delay: i * 0.08,
          scrollTrigger: { trigger: item, start: 'top 88%', once: true },
        })
      })
    }, sectionRef)

    return () => {
      ctx.revert()
      handlers.forEach(({ item, onEnter, onLeave, onMove }) => {
        item.removeEventListener('mouseenter', onEnter)
        item.removeEventListener('mouseleave', onLeave)
        item.removeEventListener('mousemove', onMove)
      })
    }
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={styles.projects} id="projects">

      {/* ── Hover preview ── */}
      <div ref={previewRef} className={styles.preview} aria-hidden="true" />

      {/* ── Backdrop ── */}
      <div
        ref={backdropRef}
        className={styles.backdrop}
        style={{ display: 'none' }}
        onClick={() => setActive(null)}
        aria-hidden="true"
      />

      {/* ── Drawer ── */}
      <aside
        ref={drawerRef}
        className={styles.drawer}
        style={{ display: 'none' }}
        aria-label="Project details"
      >
        {active && (
          <>
            <button className={styles.drawerClose} onClick={() => setActive(null)} aria-label="Close">
              <span>✕</span>
            </button>

            <div
              className={styles.drawerHero}
              style={{ background: PROJECT_BG[projects.indexOf(active)] || PROJECT_BG[0] }}
            >
              <span className={styles.drawerNum}>{active.num}</span>
            </div>

            <div className={styles.drawerBody}>
              <div className={styles.drawerMeta}>
                <span className={styles.drawerType}>{active.type}</span>
              </div>
              <h3 className={styles.drawerName}>{active.name}</h3>
              <p className={styles.drawerDesc}>{active.desc}</p>

              <div className={styles.drawerTechsLabel}>Stack</div>
              <div className={styles.drawerTechs}>
                {active.techs.map(t => (
                  <span key={t} className={styles.drawerTech}>{t}</span>
                ))}
              </div>

              {active.url && (
                <a
                  href={active.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.drawerLink}
                >
                  Visit Project <span>↗</span>
                </a>
              )}
            </div>
          </>
        )}
      </aside>

      {/* ── Header ── */}
      <div className={styles.header}>
        <span className={styles.label}>SELECTED WORK</span>
        <span className={styles.year}>2025</span>
      </div>

      {/* ── List ── */}
      <div ref={listRef} className={styles.list}>
        <div className={styles.divider} />
        {projects.map((p, i) => (
          <div key={p.num}>
            <div
              className={styles.item}
              data-cursor="view"
              onClick={() => setActive(p)}
            >
              <span className={styles.num}>{p.num}</span>
              <div className={styles.body}>
                <span className={styles.name}>{p.name}</span>
                <span className={styles.type}>{p.type}</span>
              </div>
              <div className={styles.meta}>
                <div className={styles.techs}>
                  {p.techs.slice(0, 3).map(t => (
                    <span key={t} className={styles.tech}>{t}</span>
                  ))}
                </div>
              </div>
              <span className={styles.arrow} style={{ opacity: p.url ? 1 : 0.25 }}>↗</span>
            </div>
            <div className={styles.divider} />
          </div>
        ))}
      </div>

    </section>
  )
}