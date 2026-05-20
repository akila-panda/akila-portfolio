// src/components/Skills.jsx
// Neural Constellation Tree — beyond Awwwards level skills section.
//
// Features:
//  • SVG bezier connector lines that draw themselves in on scroll
//  • Nodes fly in from random positions → elastic snap to tree layout
//  • Magnetic cursor field — nodes drift toward mouse within 200px radius
//  • Hover focus system — hovered node + branch illuminate, rest dim to 12%
//  • Radial bg glow tracks cursor with heavy lag
//  • Ambient CSS-only particle system
//  • Subtle per-node float idle animation
//  • Three branch accent colors (cyan / amber / green)

import { useEffect, useRef, useState, useCallback, Fragment } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { useMouseField } from '../hooks/useMouseField'
import { calculateTreePositions, NODE_W, NODE_H, BRANCH_W, BRANCH_H, ROOT_W, ROOT_H } from '../utils/treeLayout'
import styles from './Skills.module.css'

// ─── Skill data ───────────────────────────────────────────────
const skillTree = {
  root: { label: "AKILA'S SKILLS", id: 'root' },
  branches: [
    {
      id: 'frontend',
      label: 'FRONTEND',
      color: '#39d0d0',
      nodes: [
        'React.js', 'Next.js', 'Vue.js', 'TypeScript',
        'JavaScript', 'Tailwind', 'SCSS', 'CSS-in-JS',
        'GSAP', 'Framer Motion', 'Lenis Scroll',
      ],
    },
    {
      id: 'backend',
      label: 'BACKEND & AI',
      color: '#e8a020',
      nodes: [
        'LangChain', 'RAG Pipelines', 'NVIDIA NIM', 'FastAPI',
        'ChromaDB', 'Python', 'Twilio API', 'Slack API',
        'RESTful APIs', 'Webhooks',
      ],
    },
    {
      id: 'design',
      label: 'DESIGN & TOOLS',
      color: '#3dba7e',
      nodes: [
        'Figma', 'Adobe XD', 'WordPress', 'WCAG 2.1',
        'Git / CI/CD', 'Vite', 'Webpack', 'Vercel',
        'Jest', 'Cypress',
      ],
    },
  ],
}

// ─── Ambient particles (CSS-only, zero JS cost) ───────────────
const PARTICLE_COUNT = 18
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  left:     `${5 + (i * 83 % 90)}%`,
  top:      `${5 + (i * 67 % 90)}%`,
  dur:      `${9 + (i * 37 % 14)}s`,
  delay:    `-${i * 1.3}s`,
  tx:       `${(i % 2 === 0 ? 1 : -1) * (20 + i * 17 % 60)}px`,
  ty:       `${(i % 3 === 0 ? -1 : 1) * (15 + i * 23 % 50)}px`,
  opacity:  0.15 + (i % 5) * 0.06,
  color:    ['#39d0d0', '#e8a020', '#3dba7e'][i % 3],
}))

// ─── SVG Connector Lines ──────────────────────────────────────
function ConnectorLines({ positions, branches, animate }) {
  const pathRefs = useRef([])
  const lines    = []

  // Root → each branch (3 organic curves)
  const root = positions['root']
  branches.forEach((branch) => {
    const b = positions[branch.id]
    if (!root || !b) return
    // Bezier: start from right edge of root, control point hovers between, end at left of branch
    const cpX = root.x + ROOT_W + (b.x - root.x - ROOT_W) * 0.5
    lines.push({
      d: `M ${root.x + ROOT_W} ${root.cy} C ${cpX} ${root.cy} ${cpX} ${b.cy} ${b.x} ${b.cy}`,
      color: branch.color,
      opacity: 0.55,
      width: 1.5,
      branchId: branch.id,
      key: `root-${branch.id}`,
    })
  })

  // Branch → each leaf
  branches.forEach((branch) => {
    const b = positions[branch.id]
    if (!b) return
    branch.nodes.forEach((_, ni) => {
      const leaf = positions[`${branch.id}-${ni}`]
      if (!leaf) return
      const cpX = b.x + BRANCH_W + (leaf.x - b.x - BRANCH_W) * 0.55
      lines.push({
        d: `M ${b.x + BRANCH_W} ${b.cy} C ${cpX} ${b.cy} ${cpX} ${leaf.cy} ${leaf.x} ${leaf.cy}`,
        color: branch.color,
        opacity: 0.22,
        width: 0.8,
        branchId: branch.id,
        key: `${branch.id}-leaf-${ni}`,
        isLeaf: true,
      })
    })
  })

  useEffect(() => {
    if (!animate) return
    pathRefs.current.forEach((path, i) => {
      if (!path) return
      const len = path.getTotalLength() || 120
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: lines[i]?.opacity ?? 0.5,
        duration: lines[i]?.isLeaf ? 0.6 : 1.0,
        delay: i * 0.025 + (lines[i]?.isLeaf ? 0.5 : 0),
        ease: 'power2.inOut',
      })
    })
  }, [animate])

  return (
    <svg
      className={styles.linesSvg}
      aria-hidden="true"
      data-lines-svg
    >
      {lines.map((line, i) => (
        <path
          key={line.key}
          ref={el => { pathRefs.current[i] = el }}
          d={line.d}
          stroke={line.color}
          strokeWidth={line.width}
          opacity={animate ? 0 : line.opacity}
          fill="none"
          data-branch={line.branchId}
          data-leaf={line.isLeaf ? 'true' : undefined}
          className={styles.connectorLine}
        />
      ))}
    </svg>
  )
}

// ─── Main Skills component ────────────────────────────────────
export default function Skills() {
  const sectionRef    = useRef(null)
  const nodeRefs      = useRef([])
  const basePositions = useRef({})
  const bgRef         = useRef(null)
  const reducedMotion = useReducedMotion()

  const [dimensions, setDimensions] = useState({ w: 0, h: 0 })
  const [linesAnimate, setLinesAnimate] = useState(false)

  // ── Measure container ──────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current) return
      const w = sectionRef.current.offsetWidth
      const { positions, svgHeight } = calculateTreePositions(skillTree.branches, w)
      basePositions.current = positions
      setDimensions({ w, h: svgHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(sectionRef.current)
    return () => ro.disconnect()
  }, [])

  // ── Magnetic field ─────────────────────────────────────────
  useMouseField(sectionRef, nodeRefs, basePositions, !reducedMotion && dimensions.w > 0)

  // ── Scroll entry — nodes fly in ────────────────────────────
  useEffect(() => {
    if (!dimensions.w || reducedMotion) {
      setLinesAnimate(true)
      return
    }

    const allNodes = nodeRefs.current.filter(Boolean)
    if (!allNodes.length) return

    // Scatter to random start positions
    gsap.set(allNodes, (i) => ({
      x: gsap.utils.random(-280, 280),
      y: gsap.utils.random(-160, 160),
      opacity: 0,
      scale: 0.3,
      rotation: gsap.utils.random(-25, 25),
    }))

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.to(allNodes, {
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.9,
            stagger: {
              amount: 0.7,
              from: 'center',
              ease: 'power2.inOut',
            },
            ease: 'elastic.out(1, 0.55)',
            onComplete: () => setLinesAnimate(true),
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [dimensions.w, reducedMotion])

  // ── Background glow tracks cursor ─────────────────────────
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    const section = sectionRef.current
    const bg = bgRef.current

    let gxTo, gyTo
    // Wait a tick for gsap to be ready
    const init = () => {
      gxTo = gsap.quickTo(bg, '--gx', { duration: 1.4, ease: 'power2.out' })
      gyTo = gsap.quickTo(bg, '--gy', { duration: 1.4, ease: 'power2.out' })
    }
    init()

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      const px = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1)
      const py = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1)
      gxTo?.(px)
      gyTo?.(py)
    }

    section.addEventListener('mousemove', onMove, { passive: true })
    return () => section.removeEventListener('mousemove', onMove)
  }, [reducedMotion])

  // ── Hover: focus / dim system ─────────────────────────────
  const focusRef = useRef(null)

  const handleNodeEnter = useCallback((branchId) => {
    if (focusRef.current === branchId) return
    focusRef.current = branchId

    const nodes = sectionRef.current?.querySelectorAll('[data-node]')
    const lines = sectionRef.current?.querySelectorAll('[data-branch]')

    nodes?.forEach(node => {
      const same = node.dataset.branch === branchId
      const isRoot = node.dataset.node === 'root'
      gsap.to(node, {
        opacity: isRoot ? 0.7 : same ? 1 : 0.1,
        scale: same ? 1 : 0.97,
        duration: 0.22,
        overwrite: 'auto',
      })
    })

    lines?.forEach(line => {
      const same = line.dataset.branch === branchId
      gsap.to(line, {
        attr: {
          opacity: same ? (line.dataset.leaf ? 0.6 : 1.0) : 0.03,
          strokeWidth: same && !line.dataset.leaf ? 2.5 : line.dataset.leaf && same ? 1.2 : 0.4,
        },
        duration: 0.22,
        overwrite: 'auto',
      })
    })
  }, [])

  const handleNodeLeave = useCallback(() => {
    focusRef.current = null
    const nodes = sectionRef.current?.querySelectorAll('[data-node]')
    const lines = sectionRef.current?.querySelectorAll('[data-branch]')
    nodes?.forEach(node => gsap.to(node, { opacity: 1, scale: 1, duration: 0.35, overwrite: 'auto' }))
    lines?.forEach(line => {
      const baseOp = line.dataset.leaf ? 0.22 : 0.55
      const baseW  = line.dataset.leaf ? 0.8  : 1.5
      gsap.to(line, { attr: { opacity: baseOp, strokeWidth: baseW }, duration: 0.35, overwrite: 'auto' })
    })
  }, [])

  // ── Reset nodeRefs array ──────────────────────────────────
  nodeRefs.current = []

  const { positions } = dimensions.w
    ? calculateTreePositions(skillTree.branches, dimensions.w)
    : { positions: {} }

  const rootPos = positions['root']

  return (
    <div
      ref={sectionRef}
      className={styles.skills}
      style={{ minHeight: dimensions.h || 600 }}
    >
      {/* Radial glow bg — tracks cursor */}
      <div ref={bgRef} className={styles.glowBg} aria-hidden />

      {/* Ambient particles */}
      <div className={styles.particleLayer} aria-hidden>
        {particles.map(p => (
          <span
            key={p.id}
            className={styles.particle}
            style={{
              left: p.left,
              top: p.top,
              color: p.color,
              animationDuration: p.dur,
              animationDelay: p.delay,
              '--tx': p.tx,
              '--ty': p.ty,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* SVG connector lines — rendered below nodes */}
      {dimensions.w > 0 && (
        <ConnectorLines
          positions={positions}
          branches={skillTree.branches}
          animate={linesAnimate}
        />
      )}

      {/* ── Root node ── */}
      {rootPos && (
        <div
          ref={el => { nodeRefs.current.push(el) }}
          className={`${styles.node} ${styles.rootNode}`}
          style={{ left: rootPos.x, top: rootPos.y, width: ROOT_W, height: ROOT_H }}
          data-node="root"
          data-branch="root"
        >
          <span className={styles.rootLabel}>{skillTree.root.label}</span>
          <span className={styles.rootSub}>Senior Frontend + AI</span>
        </div>
      )}

      {/* ── Branch + leaf nodes ── */}
      {skillTree.branches.map((branch) => {
        const bPos = positions[branch.id]
        return (
          <Fragment key={branch.id}>
            {/* Branch header */}
            {bPos && (
              <div
                ref={el => { nodeRefs.current.push(el) }}
                className={`${styles.node} ${styles.branchNode}`}
                style={{
                  left: bPos.x, top: bPos.y,
                  width: BRANCH_W, height: BRANCH_H,
                  '--accent': branch.color,
                  '--float-dur': '3.2s',
                  '--float-delay': `${skillTree.branches.indexOf(branch) * 0.4}s`,
                }}
                data-node={branch.id}
                data-branch={branch.id}
                onMouseEnter={() => handleNodeEnter(branch.id)}
                onMouseLeave={handleNodeLeave}
              >
                {branch.label}
              </div>
            )}

            {/* Leaf nodes */}
            {branch.nodes.map((nodeName, ni) => {
              const lPos = positions[`${branch.id}-${ni}`]
              if (!lPos) return null
              return (
                <div
                  key={nodeName}
                  ref={el => { nodeRefs.current.push(el) }}
                  className={`${styles.node} ${styles.leafNode}`}
                  style={{
                    left: lPos.x, top: lPos.y,
                    width: NODE_W, height: NODE_H,
                    '--accent': branch.color,
                    '--float-dur': `${2.8 + ((ni * 137) % 20) / 10}s`,
                    '--float-delay': `-${((ni * 97) % 30) / 10}s`,
                  }}
                  data-node={`${branch.id}-${ni}`}
                  data-branch={branch.id}
                  onMouseEnter={() => handleNodeEnter(branch.id)}
                  onMouseLeave={handleNodeLeave}
                >
                  {nodeName}
                </div>
              )
            })}
          </Fragment>
        )
      })}
    </div>
  )
}