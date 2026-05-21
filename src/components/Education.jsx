import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { education } from '../data/portfolio'
import styles from './Education.module.css'

export default function Education() {
  const sectionRef    = useRef(null)
  const listRef       = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const items = listRef.current.querySelectorAll(`.${styles.item}`)
      items.forEach((item) => {
        const period = item.querySelector(`.${styles.period}`)
        const detail = item.querySelector(`.${styles.detail}`)

        gsap.set(period, { x: -30, opacity: 0 })
        gsap.set(detail, { x:  30, opacity: 0 })

        const tl = gsap.timeline({
          scrollTrigger: { trigger: item, start: 'top 85%', once: true }
        })
        tl.to(period, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' })
        tl.to(detail, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '<0.1')
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={styles.education} id="education">
      <div className={styles.label}>005 — Education</div>
      <h2 className={styles.title}>
        Where I<br /><em>studied.</em>
      </h2>

      <div ref={listRef} className={styles.list}>
        {education.map((e, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.period}>{e.period}</div>
            <div className={styles.detail}>
              <div className={styles.degree}>{e.degree}</div>
              <div className={styles.institution}>{e.institution}</div>
              {e.note && <div className={styles.note}>{e.note}</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}