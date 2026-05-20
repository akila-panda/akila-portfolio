import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import Skills from './Skills'
import styles from './About.module.css'

const STATS = [
  { value: 7,    suffix: '+', label: 'Years experience' },
  { value: 4,    suffix: '',  label: 'Companies' },
  { value: 15,   suffix: '+', label: 'Projects shipped' },
  { value: null, symbol: '∞', label: 'Tabs open' },
]

function AnimatedStat({ value, suffix = '', symbol, label, reduced }) {
  const numRef = useRef(null)

  useEffect(() => {
    if (value === null || reduced) return
    const obj = { val: 0 }
    if (numRef.current) numRef.current.textContent = '0' + suffix

    const trigger = ScrollTrigger.create({
      trigger: numRef.current,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const overshoot = value * 1.18
        gsap.to(obj, {
          val: overshoot,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            if (numRef.current) numRef.current.textContent = Math.round(obj.val) + suffix
          },
          onComplete: () => {
            gsap.to(obj, {
              val: value,
              duration: 0.3,
              ease: 'power3.out',
              onUpdate: () => {
                if (numRef.current) numRef.current.textContent = Math.round(obj.val) + suffix
              }
            })
          }
        })
      }
    })
    return () => trigger.kill()
  }, [reduced])

  return (
    <div className={styles.stat}>
      <div className={styles.statNum}>
        <span ref={numRef}>{symbol || ('0' + suffix)}</span>
      </div>
      <div className={styles.statLabel}>{label}</div>
    </div>
  )
}

function wrapWords(el) {
  return el.split(' ').map((w, i) => (
    <span key={i} className="word" style={{ display: 'inline-block', marginRight: '0.3em' }}>{w}</span>
  ))
}

export default function About() {
  const sectionRef = useRef(null)
  const titleRef   = useRef(null)
  const textRef    = useRef(null)
  const statsRef   = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      const words = titleRef.current.querySelectorAll('.word')
      gsap.fromTo(words,
        { opacity: 0.1, y: 8 },
        {
          opacity: 1, y: 0, stagger: 0.08, ease: 'none',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            end: 'bottom 60%',
            scrub: 1.5,
          }
        }
      )

      const paras = textRef.current.querySelectorAll('p')
      gsap.set(paras, { opacity: 0, y: 24 })
      gsap.to(paras, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'glide',
        scrollTrigger: { trigger: textRef.current, start: 'top 80%', once: true }
      })

      gsap.set(statsRef.current, { opacity: 0, y: 30 })
      gsap.to(statsRef.current, {
        opacity: 1, y: 0, duration: 0.7, ease: 'reveal',
        scrollTrigger: { trigger: statsRef.current, start: 'top 85%', once: true }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={styles.about} id="about">
      <div className={styles.label}>002 — About</div>
      <h2 ref={titleRef} className={styles.title}>
        {wrapWords('Design sense.')}
        <br />
        <em>{wrapWords('Engineering depth.')}</em>
      </h2>

      <div className={styles.grid}>
        <div ref={textRef} className={styles.text}>
          <p>
            I've spent the last 7 years building things for the web, starting out as a{' '}
            <strong>UI/UX designer</strong> and growing into someone who builds full products
            from a Figma file all the way to a production-ready, optimised application.
          </p>
          <p>
            What makes me different is the range — I can go from{' '}
            <strong>pixel-perfect interface design</strong> to writing RAG pipelines with
            LangChain and NVIDIA NIM. I know how to make things look exceptional{' '}
            <em>and</em> make them work at scale.
          </p>
          <p>
            Currently at <strong>INSK Group</strong> as Senior Frontend Developer, and
            independently building AI-powered SaaS tools on the side.
          </p>
        </div>

        <div ref={statsRef} className={styles.statsGrid}>
          {STATS.map((s) => (
            <AnimatedStat key={s.label} {...s} reduced={reducedMotion} />
          ))}
        </div>
      </div>

      {/* ── Skills org-tree (replaces Framer Motion skill grid) ── */}
      <div className={styles.skillsHeader}>
        <div className={styles.label}>Skills</div>
      </div>
      <Skills />
    </section>
  )
}