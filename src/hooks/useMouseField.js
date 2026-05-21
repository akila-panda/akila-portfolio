// src/hooks/useMouseField.js
// Magnetic cursor field — nodes within RADIUS px drift toward the mouse.
// Uses getBoundingClientRect so it always reads the true rendered position
// (after any CSS animation offset) rather than a stale positions map.
// quickTo for butter-smooth GPU-composited motion.

import { useEffect } from 'react'
import { gsap } from '../utils/gsap'

const RADIUS      = 200    // px — influence radius
const MAX_PULL    = 26     // px — max displacement at cursor centre
const RETURN_EASE = 'elastic.out(1, 0.45)'
const RETURN_DUR  = 1.1
const PULL_DUR    = 0.32

export function useMouseField(containerRef, nodeRefs, basePositions, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    // Lazily build quickTo settlers per DOM element
    const settlers = new WeakMap()
    const pulled    = new Set()

    const getSettler = (el) => {
      if (!settlers.has(el)) {
        settlers.set(el, {
          xTo: gsap.quickTo(el, 'x', { duration: PULL_DUR, ease: 'power2.out', overwrite: 'auto' }),
          yTo: gsap.quickTo(el, 'y', { duration: PULL_DUR, ease: 'power2.out', overwrite: 'auto' }),
        })
      }
      return settlers.get(el)
    }

    const onMove = (e) => {
      const containerRect = container.getBoundingClientRect()
      const mx = e.clientX - containerRect.left
      const my = e.clientY - containerRect.top

      nodeRefs.current.forEach((el) => {
        if (!el) return

        // Read the node's actual rendered centre (includes CSS float animation offset)
        const elRect = el.getBoundingClientRect()
        const bx = elRect.left - containerRect.left + elRect.width  / 2
        const by = elRect.top  - containerRect.top  + elRect.height / 2

        const dx   = mx - bx
        const dy   = my - by
        const dist = Math.hypot(dx, dy)

        const { xTo, yTo } = getSettler(el)

        if (dist < RADIUS && dist > 0) {
          const force = (1 - dist / RADIUS) * MAX_PULL
          xTo((dx / dist) * force)
          yTo((dy / dist) * force)
          pulled.add(el)
        } else if (pulled.has(el)) {
          gsap.to(el, { x: 0, y: 0, duration: RETURN_DUR, ease: RETURN_EASE, overwrite: 'auto' })
          pulled.delete(el)
        }
      })
    }

    const onLeave = () => {
      pulled.forEach(el => {
        gsap.to(el, { x: 0, y: 0, duration: RETURN_DUR, ease: RETURN_EASE, overwrite: 'auto' })
      })
      pulled.clear()
    }

    container.addEventListener('mousemove', onMove, { passive: true })
    container.addEventListener('mouseleave', onLeave, { passive: true })

    return () => {
      container.removeEventListener('mousemove', onMove)
      container.removeEventListener('mouseleave', onLeave)
      nodeRefs.current?.forEach(el => el && gsap.set(el, { x: 0, y: 0 }))
    }
  }, [enabled])
}