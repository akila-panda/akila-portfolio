import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import styles from './Contact.module.css'

const EMAIL = 'akilaranasinghe@gmail.com'

export default function Contact() {
  const sectionRef  = useRef(null)
  const labelRef    = useRef(null)
  const emailRef    = useRef(null)
  const subRef      = useRef(null)
  const socialsRef  = useRef(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return

    const ctx = gsap.context(() => {
      // Label
      gsap.set(labelRef.current, { opacity: 0, y: 12 })
      gsap.to(labelRef.current, {
        opacity: 1, y: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
      })

      // Email chars
      const chars = emailRef.current.querySelectorAll(`.${styles.eChar}`)
      gsap.set(chars, { y: '110%', opacity: 0 })
      gsap.to(chars, {
        y: '0%', opacity: 1,
        duration: 0.8, stagger: 0.018, ease: 'expo.out',
        scrollTrigger: { trigger: emailRef.current, start: 'top 85%', once: true },
        delay: 0.2,
      })

      // Sub + socials
      gsap.set([subRef.current, socialsRef.current], { opacity: 0, y: 16 })
      gsap.to([subRef.current, socialsRef.current], {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out',
        scrollTrigger: { trigger: subRef.current, start: 'top 90%', once: true },
        delay: 0.15,
      })
    }, sectionRef)

    // Email hover scramble per-char
    const chars = emailRef.current.querySelectorAll(`.${styles.eChar}`)
    const CHARS_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@.'

    const onEnter = () => {
      chars.forEach((ch, i) => {
        const orig = ch.dataset.char
        let frame = 0
        const max = 6 + Math.floor(i * 0.4)
        const interval = setInterval(() => {
          ch.textContent = frame < max
            ? CHARS_POOL[Math.floor(Math.random() * CHARS_POOL.length)]
            : orig
          frame++
          if (frame > max) clearInterval(interval)
        }, 38)
        ch._interval = interval
      })
    }

    const onLeave = () => {
      chars.forEach(ch => {
        clearInterval(ch._interval)
        ch.textContent = ch.dataset.char
      })
    }

    const emailEl = emailRef.current
    emailEl.addEventListener('mouseenter', onEnter)
    emailEl.addEventListener('mouseleave', onLeave)

    return () => {
      ctx.revert()
      emailEl.removeEventListener('mouseenter', onEnter)
      emailEl.removeEventListener('mouseleave', onLeave)
    }
  }, [reducedMotion])

  return (
    <section ref={sectionRef} className={styles.contact} id="contact">

      <div ref={labelRef} className={styles.label}>005 — Contact</div>

      <div className={styles.emailWrap}>
        <a
          ref={emailRef}
          href="mailto:akilaranasinghe@gmail.com"
          className={styles.email}
          data-cursor="hover"
          aria-label="Send email to Akila Ranasinghe"
        >
          {EMAIL.split('').map((ch, i) => (
            <span
              key={i}
              className={styles.eChar}
              data-char={ch}
              aria-hidden="true"
            >{ch}</span>
          ))}
        </a>
      </div>

      <div className={styles.bottom}>
        <p ref={subRef} className={styles.sub}>
          Open to senior frontend roles, freelance projects,<br />
          and interesting AI engineering work.<br />
          <em>Based in Sri Lanka — available remote.</em>
        </p>

        <div ref={socialsRef} className={styles.socials}>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            data-cursor="hover"
          >
            GitHub <span className={styles.socialArrow}>↗</span>
          </a>
          <span className={styles.socialSep}>·</span>
          <a
            href="https://www.linkedin.com/in/akila-ranasinghe-89bba0100/"
            target="_blank"
            rel="noreferrer"
            className={styles.socialLink}
            data-cursor="hover"
          >
            LinkedIn <span className={styles.socialArrow}>↗</span>
          </a>
          <span className={styles.socialSep}>·</span>
          <a
            href="mailto:akilaranasinghe@gmail.com"
            className={styles.socialLink}
            data-cursor="hover"
          >
            Email <span className={styles.socialArrow}>↗</span>
          </a>
        </div>
      </div>

    </section>
  )
}