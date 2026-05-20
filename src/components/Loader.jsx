import { useEffect, useRef } from 'react'
import { gsap } from '../utils/gsap'
import styles from './Loader.module.css'

import layer1 from '../assets/blob/layer-1.png'
import layer2 from '../assets/blob/layer-2.png'
import layer3 from '../assets/blob/layer-3.png'
import layer4 from '../assets/blob/layer-4.png'
import layer5 from '../assets/blob/layer-5.png'

const NAME   = ['A', 'K', 'I', 'L', 'A']
const LAYERS = [layer1, layer2, layer3, layer4, layer5]

export default function Loader({ onComplete }) {
  const loaderRef  = useRef(null)
  const counterRef = useRef(null)
  const charsRef   = useRef([])
  const subRef     = useRef(null)
  const lineRef    = useRef(null)
  const blobRefs   = useRef([])

  useEffect(() => {
    const chars  = charsRef.current.filter(Boolean)
    const blobs  = blobRefs.current.filter(Boolean)
    const loader = loaderRef.current
    const counter = counterRef.current

    gsap.set(chars,          { yPercent: 110, opacity: 0 })
    gsap.set(subRef.current, { opacity: 0, y: 8 })
    gsap.set(blobs,          { opacity: 0 })

    const prog = { val: 0 }
    const tl   = gsap.timeline()

    // Counter 000 → 100
    tl.to(prog, {
      val: 100, duration: 2.4, ease: 'power3.inOut',
      onUpdate() {
        if (counter) counter.textContent = String(Math.floor(prog.val)).padStart(3, '0')
        if (lineRef.current) lineRef.current.style.transform = `scaleX(${prog.val / 100})`
      },
    }, 0)

    // Name reveal
    tl.to(chars, { yPercent: 0, opacity: 1, duration: 1.1, stagger: 0.07, ease: 'expo.out' }, 0.25)

    // Sub line
    tl.to(subRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }, 0.8)

    // Hold
    tl.to({}, { duration: 0.45 })

    // Fade text
    tl.to([chars, subRef.current, counterRef.current], { opacity: 0, scale: 0.95, duration: 0.35, ease: 'power2.in' })
    tl.to(lineRef.current, { opacity: 0, duration: 0.2 }, '<')

    // Blob CONTRACTS: start at layer-5 (biggest), step down to layer-1 (smallest)
    // Show layer-5 first
    tl.set(blobs[4], { opacity: 1 }, '+=0.05')
    // Step 5→4→3→2→1
    for (let i = blobs.length - 1; i >= 1; i--) {
      tl.set(blobs[i],     { opacity: 0 }, '+=0.055')
      tl.set(blobs[i - 1], { opacity: 1 }, '<')
    }
    // blobs[0] (layer-1, smallest) is now showing — STAYS showing

    // Hide loader. layer-1 blob stays visible.
    // Hero takes over with layer-1 already shown (seamless handoff).
    tl.call(() => {
      if (loader) loader.style.display = 'none'
      if (onComplete) onComplete()
      // Zero out loader blob — hero blob is now showing layer-1
      blobs.forEach(b => { b.style.opacity = '0' })
    })

    return () => tl.kill()
  }, [onComplete])

  return (
    <>
      <div className={styles.blobOverlay} aria-hidden="true">
        {LAYERS.map((src, i) => (
          <div
            key={i}
            ref={el => (blobRefs.current[i] = el)}
            className={styles.blobFrame}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>

      <div ref={loaderRef} className={styles.loader}>
        <div className={styles.topBar}>
          <span className={styles.logo}>AR</span>
          <span ref={counterRef} className={styles.counter}>000</span>
        </div>
        <div className={styles.nameRow} aria-label="Akila">
          {NAME.map((char, i) => (
            <span key={i} ref={el => (charsRef.current[i] = el)} className={styles.char} aria-hidden="true">{char}</span>
          ))}
        </div>
        <div ref={subRef} className={styles.sub}>
          Portfolio&nbsp;·&nbsp;2025&nbsp;·&nbsp;Frontend&nbsp;Development&nbsp;·&nbsp;AI&nbsp;Engineering
        </div>
        <div className={styles.progressWrap}>
          <div ref={lineRef} className={styles.progressLine} />
        </div>
      </div>
    </>
  )
}