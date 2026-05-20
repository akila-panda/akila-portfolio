// src/hooks/useMouseField.js
// Applies a magnetic field effect to an array of DOM nodes.
// Nodes within RADIUS px of the cursor drift toward it.
// Uses gsap.quickTo for butter-smooth GPU-composited motion.

import { useEffect } from 'react'
import { gsap } from '../utils/gsap'

const RADIUS       = 200    // px — influence radius
const MAX_PULL     = 24     // px — max displacement at cursor center
const RETURN_EASE  = 'elastic.out(1, 0.45)'
const RETURN_DUR   = 1.1
const PULL_DUR     = 0.35

/**
 * @param {React.RefObject} containerRef  - the section container
 * @param {React.RefObject<Array>} nodeRefs - array of DOM node refs
 * @param {React.RefObject<Object>} basePositions - { [id]: {cx, cy} } map
 * @param {boolean} enabled
 */
export function useMouseField(containerRef, nodeRefs, basePositions, enabled = true) {
  useEffect(() => {
    if (!enabled) return
    const container = containerRef.current
    if (!container) return

    // Build quickTo settlers lazily per node
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
      const rect = container.getBoundingClientRect()
      const mx   = e.clientX - rect.left
      const my   = e.clientY - rect.top

      const nodes = nodeRefs.current
      if (!nodes?.length) return

      nodes.forEach((el, i) => {
        if (!el) return
        const pos = Object.values(basePositions.current || {})[i]
        if (!pos) return

        // Use the node's DOM position as base if positions map isn't indexed by i
        const elRect = el.getBoundingClientRect()
        const bx = elRect.left - rect.left + elRect.width / 2
        const by = elRect.top  - rect.top  + elRect.height / 2

        const dx   = mx - bx
        const dy   = my - by
        const dist = Math.sqrt(dx * dx + dy * dy)

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
      // Return all nodes to origin on cleanup
      nodeRefs.current?.forEach(el => el && gsap.set(el, { x: 0, y: 0 }))
    }
  }, [enabled])
}