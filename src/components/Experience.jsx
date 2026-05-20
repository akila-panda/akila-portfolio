import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { experience } from '../data/portfolio'
import styles from './Experience.module.css'

export default function Experience() {
  const sectionRef      = useRef(null)
  const timelineLineRef = useRef(null)
  const listRef         = useRef(null)
  const reducedMotion   = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const isMobile = window.innerWidth < 768

    const ctx = gsap.context(() => {

      // SVG timeline draw — desktop only (SVG height calculation is unstable on mobile)
      if (!isMobile && timelineLineRef.current) {
        const line = timelineLineRef.current
        // Use the SVG element's actual rendered height, not a hardcoded value
        const svgEl = line.closest('svg')
        const svgHeight = svgEl?.getBoundingClientRect().height ?? 800

        gsap.set(line, { strokeDasharray: svgHeight, strokeDashoffset: svgHeight })
        gsap.to(line, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 60%',
            end: 'bottom 80%',
            scrub: 1.2,
          }
        })
      }

      const items = listRef.current.querySelectorAll(`.${styles.item}`)
      items.forEach((item) => {
        const meta    = item.querySelector(`.${styles.meta}`)
        const detail  = item.querySelector(`.${styles.detail}`)
        const bullets = detail?.querySelectorAll('li') ?? []
        const company = item.querySelector(`.${styles.company}`)

        // Set initial states
        gsap.set(meta,    { x: -30, opacity: 0 })
        gsap.set(detail,  { x:  30, opacity: 0 })
        gsap.set(bullets, { x:  16, opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 82%', once: true }
        })

        tl.to(meta, {
          x: 0, opacity: 1, duration: 0.5, ease: 'glide',
          onComplete: () => { meta.style.willChange = 'auto' }
        })
        tl.to(detail, {
          x: 0, opacity: 1, duration: 0.5, ease: 'glide',
          onComplete: () => { detail.style.willChange = 'auto' }
        }, '<0.1')
        tl.to(bullets, {
          x: 0, opacity: 1, duration: 0.35, stagger: 0.07, ease: 'glide'
        }, '-=0.2')

        // Company name colour change on scroll proximity
        if (company) {
          ScrollTrigger.create({
            trigger: item,
            start: 'top 50%',
            end:   'bottom 50%',
            onEnter:     () => gsap.to(company, { color: 'var(--color-accent)', duration: 0.3, overwrite: 'auto' }),
            onLeave:     () => gsap.to(company, { color: 'var(--text)',         duration: 0.3, overwrite: 'auto' }),
            onEnterBack: () => gsap.to(company, { color: 'var(--color-accent)', duration: 0.3, overwrite: 'auto' }),
            onLeaveBack: () => gsap.to(company, { color: 'var(--text)',         duration: 0.3, overwrite: 'auto' }),
          })
        }
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={styles.experience} id="experience">
      <div className={styles.label}>004 — Experience</div>
      <h2 className={styles.title}>
        Where I've<br /><em>worked.</em>
      </h2>

      <div className={styles.timelineWrap}>
        <svg className={styles.timelineSvg} aria-hidden="true">
          <line
            ref={timelineLineRef}
            x1="0" y1="0"
            x2="0" y2="100%"
            stroke="var(--color-accent)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className={styles.timelineLine}
          />
        </svg>

        <div ref={listRef} className={styles.list}>
          {experience.map((e, i) => (
            <div key={i} className={styles.item}>
              <div className={styles.meta}>
                <div className={styles.period}>{e.period}</div>
                <div className={styles.company}>{e.company}</div>
                <div className={styles.location}>{e.location}</div>
              </div>
              <div className={styles.detail}>
                <div className={styles.role}>{e.role}</div>
                <ul className={styles.points}>
                  {e.points.map((point, j) => (
                    <li key={j}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}