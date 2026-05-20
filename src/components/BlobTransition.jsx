import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import styles from './BlobTransition.module.css'

import layer1 from '../assets/blob/layer-1.png'
import layer2 from '../assets/blob/layer-2.png'
import layer3 from '../assets/blob/layer-3.png'
import layer4 from '../assets/blob/layer-4.png'
import layer5 from '../assets/blob/layer-5.png'

const LAYERS = [layer1, layer2, layer3, layer4, layer5]

export default function BlobTransition({ triggerRef, onPeak }) {
  const overlayRef = useRef(null)
  const frameRefs  = useRef([])
  const peakFired  = useRef(false)

  useEffect(() => {
    if (!triggerRef?.current) return
    const frames = frameRefs.current.filter(Boolean)
    gsap.set(frames, { opacity: 0 })
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top center',
        end: 'bottom center',
        scrub: 1.2,
        onUpdate(self) {
          const frameIndex = Math.min(Math.floor(self.progress * frames.length), frames.length - 1)
          frames.forEach((f, i) => gsap.set(f, { opacity: i === frameIndex ? 1 : 0 }))
          if (frameIndex === frames.length - 1 && !peakFired.current) {
            peakFired.current = true
            onPeak?.()
          }
          if (frameIndex < frames.length - 1) peakFired.current = false
        },
      })
    })
    return () => ctx.revert()
  }, [triggerRef, onPeak])

  return (
    <div ref={overlayRef} className={styles.overlay} aria-hidden="true">
      {LAYERS.map((src, i) => (
        <div key={i} ref={el => (frameRefs.current[i] = el)} className={styles.frame} style={{ backgroundImage: `url(${src})` }} />
      ))}
    </div>
  )
}
