// src/components/Skills.jsx
// Neural Constellation Tree

import {
  useEffect, useLayoutEffect, useRef, useState, useCallback, Fragment
} from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion }    from '../hooks/useReducedMotion'
import { useMouseField }       from '../hooks/useMouseField'
import {
  calculateTreePositions,
  NODE_W, NODE_H, BRANCH_W, BRANCH_H, ROOT_W, ROOT_H,
} from '../utils/treeLayout'
import styles from './Skills.module.css'

// ─── Skill data (complete, matches spec) ──────────────────────
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
        'Jest', 'React Testing Library', 'Cypress',
      ],
    },
    {
      id: 'design',
      label: 'DESIGN & TOOLS',
      color: '#3dba7e',
      nodes: [
        'Figma', 'Adobe XD', 'WordPress', 'WCAG 2.1',
        'Git / CI/CD', 'Vite', 'Webpack', 'Linux', 'Vercel',
      ],
    },
  ],
}

// ─── Ambient particles (CSS-only) ────────────────────────────
// NOTE: no opacity in inline style — CSS @keyframes controls visibility
const PARTICLE_COUNT = 20
const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id:    i,
  left:  `${4 + (i * 79 % 92)}%`,
  top:   `${4 + (i * 61 % 92)}%`,
  dur:   `${10 + (i * 41 % 14)}s`,
  delay: `-${(i * 1.7 % 18).toFixed(1)}s`,
  tx:    `${(i % 2 === 0 ? 1 : -1) * (18 + i * 19 % 55)}px`,
  ty:    `${(i % 3 === 0 ? -1 : 1) * (14 + i * 23 % 48)}px`,
  op:    (0.14 + (i % 5) * 0.07).toFixed(2),
  color: ['#39d0d0', '#e8a020', '#3dba7e'][i % 3],
}))

// ─── SVG Connector Lines ──────────────────────────────────────
function ConnectorLines({ positions, branches, animate }) {
  const pathRefs = useRef([])
  const lines    = []

  // Root → each branch: curve from root bottom-centre to branch top
  const root = positions['root']
  branches.forEach((branch) => {
    const b = positions[branch.id]
    if (!root || !b) return
    // Control point: midway between root bottom and branch top, slight horizontal nudge
    const startX = root.cx
    const startY = root.y + ROOT_H
    const endX   = b.cx
    const endY   = b.y
    const cpY    = startY + (endY - startY) * 0.5
    lines.push({
      d: `M ${startX} ${startY} C ${startX} ${cpY} ${endX} ${cpY} ${endX} ${endY}`,
      color:    branch.color,
      opacity:  0.65,
      width:    1.8,
      branchId: branch.id,
      key:      `root-${branch.id}`,
    })
  })

  // Branch → each leaf: short organic drop
  branches.forEach((branch) => {
    const b = positions[branch.id]
    if (!b) return
    branch.nodes.forEach((_, ni) => {
      const leaf = positions[`${branch.id}-${ni}`]
      if (!leaf) return
      const startX = b.cx
      const startY = b.y + BRANCH_H
      const endX   = leaf.cx
      const endY   = leaf.y
      const cpY    = startY + (endY - startY) * 0.5
      lines.push({
        d: `M ${startX} ${startY} C ${startX} ${cpY} ${endX} ${cpY} ${endX} ${endY}`,
        color:    branch.color,
        opacity:  0.2,
        width:    0.75,
        branchId: branch.id,
        key:      `${branch.id}-leaf-${ni}`,
        isLeaf:   true,
      })
    })
  })

  useEffect(() => {
    if (!animate) return
    pathRefs.current.forEach((path, i) => {
      if (!path) return
      const len = path.getTotalLength() || 100
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len, opacity: 0 })
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: lines[i]?.opacity ?? 0.4,
        duration: lines[i]?.isLeaf ? 0.55 : 0.95,
        delay:    i * 0.022 + (lines[i]?.isLeaf ? 0.45 : 0),
        ease:     'power2.inOut',
      })
    })
  }, [animate]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <svg className={styles.linesSvg} aria-hidden="true">
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
        />
      ))}
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function Skills() {
  const sectionRef    = useRef(null)
  const nodeRefs      = useRef([])
  const bgRef         = useRef(null)
  const reducedMotion = useReducedMotion()

  const [dimensions,    setDimensions]    = useState({ w: 0, h: 0 })
  const [linesAnimate,  setLinesAnimate]  = useState(false)

  // ── BUG FIX: reset nodeRefs in layout effect, not render body ─
  // Resetting in render body wiped refs before effects could read them.
  useLayoutEffect(() => {
    nodeRefs.current = []
  })

  // ── Measure container ─────────────────────────────────────────
  useEffect(() => {
    const measure = () => {
      if (!sectionRef.current) return
      const w = sectionRef.current.offsetWidth
      const { svgHeight } = calculateTreePositions(skillTree.branches, w)
      setDimensions({ w, h: svgHeight })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(sectionRef.current)
    return () => ro.disconnect()
  }, [])

  // ── Magnetic cursor field ─────────────────────────────────────
  useMouseField(sectionRef, nodeRefs, null, !reducedMotion && dimensions.w > 0)

  // ── Scroll entry: nodes fly in ───────────────────────────────
  useEffect(() => {
    if (!dimensions.w) return

    if (reducedMotion) {
      setLinesAnimate(true)
      return
    }

    // Capture the refs list at the moment the effect fires — stable snapshot
    const allNodes = nodeRefs.current.filter(Boolean)
    if (!allNodes.length) return

    // Scatter to random offsets around their final positions
    gsap.set(allNodes, (i) => ({
      x:        gsap.utils.random(-300, 300),
      y:        gsap.utils.random(-180, 180),
      opacity:  0,
      scale:    0.25,
      rotation: gsap.utils.random(-30, 30),
    }))

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start:   'top 78%',
        once:    true,
        onEnter: () => {
          gsap.to(allNodes, {
            x: 0, y: 0,
            opacity:  1,
            scale:    1,
            rotation: 0,
            duration: 0.95,
            stagger: {
              amount: 0.75,
              from:   'center',
              ease:   'power2.inOut',
            },
            ease:       'elastic.out(1, 0.52)',
            onComplete: () => setLinesAnimate(true),
          })
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [dimensions.w, reducedMotion])

  // ── BUG FIX: background glow via tween proxy ─────────────────
  // gsap.quickTo cannot animate CSS custom properties.
  // Solution: tween a plain JS object, call style.setProperty in onUpdate.
  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !bgRef.current) return
    const section = sectionRef.current
    const bg      = bgRef.current

    const proxy = { gx: 50, gy: 35 }
    let tween = null

    const onMove = (e) => {
      const rect = section.getBoundingClientRect()
      const tx   = ((e.clientX - rect.left) / rect.width  * 100)
      const ty   = ((e.clientY - rect.top)  / rect.height * 100)

      if (tween) tween.kill()
      tween = gsap.to(proxy, {
        gx: tx,
        gy: ty,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => {
          bg.style.setProperty('--gx', proxy.gx.toFixed(2) + '%')
          bg.style.setProperty('--gy', proxy.gy.toFixed(2) + '%')
        },
      })
    }

    section.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      section.removeEventListener('mousemove', onMove)
      tween?.kill()
    }
  }, [reducedMotion])

  // ── Hover: branch focus / dim ─────────────────────────────────
  const focusRef  = useRef(null)
  const hoveredEl = useRef(null)

  const handleNodeEnter = useCallback((e, branchId) => {
    const el = e.currentTarget
    if (focusRef.current === branchId && hoveredEl.current === el) return
    focusRef.current  = branchId
    hoveredEl.current = el

    const nodes = sectionRef.current?.querySelectorAll('[data-node]')
    const lines = sectionRef.current?.querySelectorAll('[data-branch]')

    nodes?.forEach(node => {
      const same   = node.dataset.branch === branchId
      const isRoot = node.dataset.node   === 'root'
      const isThis = node === el
      gsap.to(node, {
        opacity:  isRoot ? 0.65 : same ? 1 : 0.08,
        scale:    isThis ? 1.12 : same ? 1 : 0.96,
        duration: 0.22,
        overwrite: 'auto',
      })
    })

    lines?.forEach(line => {
      const same = line.dataset.branch === branchId
      gsap.to(line, {
        attr: {
          opacity:     same ? (line.dataset.leaf ? 0.65 : 1.0) : 0.025,
          strokeWidth: same ? (line.dataset.leaf ? 1.2  : 2.6) : 0.35,
        },
        duration:  0.22,
        overwrite: 'auto',
      })
    })
  }, [])

  const handleNodeLeave = useCallback(() => {
    focusRef.current  = null
    hoveredEl.current = null
    const nodes = sectionRef.current?.querySelectorAll('[data-node]')
    const lines = sectionRef.current?.querySelectorAll('[data-branch]')
    nodes?.forEach(node => gsap.to(node, { opacity: 1, scale: 1, duration: 0.35, overwrite: 'auto' }))
    lines?.forEach(line => {
      const baseOp = line.dataset.leaf ? 0.2  : 0.65
      const baseW  = line.dataset.leaf ? 0.75 : 1.8
      gsap.to(line, { attr: { opacity: baseOp, strokeWidth: baseW }, duration: 0.35, overwrite: 'auto' })
    })
  }, [])

  // ── Compute positions ─────────────────────────────────────────
  const { positions } = dimensions.w
    ? calculateTreePositions(skillTree.branches, dimensions.w)
    : { positions: {} }

  const rootPos = positions['root']

  return (
    <div
      ref={sectionRef}
      className={styles.skills}
      style={{ minHeight: dimensions.h || 640 }}
    >
      {/* Radial glow — tracked via CSS vars updated by tween proxy */}
      <div ref={bgRef} className={styles.glowBg} aria-hidden />

      {/* Ambient particles — NO inline opacity (CSS animation controls it) */}
      <div className={styles.particleLayer} aria-hidden>
        {particles.map(p => (
          <span
            key={p.id}
            className={styles.particle}
            style={{
              left:  p.left,
              top:   p.top,
              color: p.color,
              '--dur':   p.dur,
              '--delay': p.delay,
              '--tx':    p.tx,
              '--ty':    p.ty,
              '--op':    p.op,
            }}
          />
        ))}
      </div>

      {/* SVG connector lines */}
      {dimensions.w > 0 && (
        <ConnectorLines
          positions={positions}
          branches={skillTree.branches}
          animate={linesAnimate}
        />
      )}

      {/* Root node */}
      {rootPos && (
        <div
          ref={el => { nodeRefs.current.push(el) }}
          className={`${styles.node} ${styles.rootNode}`}
          style={{ left: rootPos.x, top: rootPos.y, width: ROOT_W, height: ROOT_H }}
          data-node="root"
          data-branch="root"
          onMouseEnter={e => handleNodeEnter(e, 'root')}
          onMouseLeave={handleNodeLeave}
        >
          <span className={styles.rootLabel}>{skillTree.root.label}</span>
          <span className={styles.rootSub}>Senior Frontend + AI Engineer</span>
        </div>
      )}

      {/* Branch + leaf nodes */}
      {skillTree.branches.map((branch) => {
        const bPos = positions[branch.id]
        return (
          <Fragment key={branch.id}>
            {bPos && (
              <div
                ref={el => { nodeRefs.current.push(el) }}
                className={`${styles.node} ${styles.branchNode}`}
                style={{
                  left:   bPos.x,
                  top:    bPos.y,
                  width:  BRANCH_W,
                  height: BRANCH_H,
                  '--accent':      branch.color,
                  '--float-dur':   '3.4s',
                  '--float-delay': `${skillTree.branches.indexOf(branch) * 0.45}s`,
                }}
                data-node={branch.id}
                data-branch={branch.id}
                onMouseEnter={e => handleNodeEnter(e, branch.id)}
                onMouseLeave={handleNodeLeave}
              >
                {branch.label}
              </div>
            )}

            {branch.nodes.map((nodeName, ni) => {
              const lPos = positions[`${branch.id}-${ni}`]
              if (!lPos) return null
              return (
                <div
                  key={nodeName}
                  ref={el => { nodeRefs.current.push(el) }}
                  className={`${styles.node} ${styles.leafNode}`}
                  style={{
                    left:   lPos.x,
                    top:    lPos.y,
                    width:  NODE_W,
                    height: NODE_H,
                    '--accent':      branch.color,
                    '--float-dur':   `${2.6 + ((ni * 137) % 22) / 10}s`,
                    '--float-delay': `-${((ni * 97) % 32) / 10}s`,
                  }}
                  data-node={`${branch.id}-${ni}`}
                  data-branch={branch.id}
                  onMouseEnter={e => handleNodeEnter(e, branch.id)}
                  onMouseLeave={handleNodeLeave}
                >
                  {nodeName}
                </div>
              )
            })}
          </Fragment>
        )
      })}

      {/* ── Mobile fallback — hidden on desktop by CSS ── */}
      <div className={styles.mobileTree} aria-hidden="true">
        {skillTree.branches.map(branch => (
          <div key={branch.id} className={styles.mobileBranchGroup}>
            <div
              className={`${styles.node} ${styles.branchNode}`}
              style={{ '--accent': branch.color }}
            >
              {branch.label}
            </div>
            <div className={styles.mobileLeaves}>
              {branch.nodes.map(n => (
                <span
                  key={n}
                  className={`${styles.node} ${styles.leafNode}`}
                  style={{ '--accent': branch.color }}
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}