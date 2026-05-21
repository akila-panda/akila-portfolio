// src/utils/treeLayout.js
// Horizontal fan tree layout:
//   root (top-centre) → 3 branch nodes (spread left/centre/right) → leaf clusters below each branch
//
// Coordinate system: absolute pixels, top-left origin.
// All positions are the node's top-left corner so you can use them directly
// in { left, top } CSS or as GSAP targets.

export const ROOT_W    = 210
export const ROOT_H    = 58
export const BRANCH_W  = 170
export const BRANCH_H  = 46
export const NODE_W    = 128
export const NODE_H    = 34

// Vertical rhythm
const ROOT_TOP       = 48      // top padding above root
const ROOT_TO_BRANCH = 70      // root bottom → branch top
const BRANCH_TO_LEAF = 52      // branch bottom → first leaf row top
const LEAF_ROW_GAP   = 10      // vertical gap between leaf rows
const LEAF_COL_GAP   = 10      // horizontal gap between leaf columns

// Horizontal rhythm — branches at fixed fractional x positions
const BRANCH_CENTRES = [0.18, 0.50, 0.82]   // fraction of container width

/**
 * @param {Array}  branches   - skillTree.branches
 * @param {number} cW         - container pixel width
 * @returns {{ positions, svgHeight }}
 */
export function calculateTreePositions(branches, cW) {
  if (!cW || cW < 200) return { positions: {}, svgHeight: 700 }

  const positions = {}
  const COLS = 3   // leaf columns per branch

  // ── Root node ─────────────────────────────────────────────────
  const rootX = cW / 2 - ROOT_W / 2
  const rootY = ROOT_TOP
  positions['root'] = {
    x: rootX, y: rootY,
    cx: rootX + ROOT_W / 2,
    cy: rootY + ROOT_H / 2,
  }

  // ── Branch nodes ──────────────────────────────────────────────
  const branchY = rootY + ROOT_H + ROOT_TO_BRANCH
  const branchCentres = BRANCH_CENTRES.map(f => Math.round(cW * f))

  branches.forEach((branch, bi) => {
    const bCx = branchCentres[bi]
    const bx  = bCx - BRANCH_W / 2
    positions[branch.id] = {
      x: bx, y: branchY,
      cx: bCx,
      cy: branchY + BRANCH_H / 2,
    }
  })

  // ── Leaf nodes ─────────────────────────────────────────────────
  // Each branch gets its leaves packed in rows of COLS, centred on the branch cx.
  // We need the tallest branch to know total canvas height.
  let maxLeafBottom = branchY + BRANCH_H + BRANCH_TO_LEAF

  branches.forEach((branch, bi) => {
    const bCx     = branchCentres[bi]
    const count   = branch.nodes.length
    const cols    = Math.min(COLS, count)
    const rows    = Math.ceil(count / cols)
    const clusterW = cols * NODE_W + (cols - 1) * LEAF_COL_GAP
    const clusterX = bCx - clusterW / 2
    const leafTop  = branchY + BRANCH_H + BRANCH_TO_LEAF

    branch.nodes.forEach((_, ni) => {
      const col = ni % cols
      const row = Math.floor(ni / cols)
      const nx  = clusterX + col * (NODE_W + LEAF_COL_GAP)
      const ny  = leafTop  + row * (NODE_H + LEAF_ROW_GAP)

      positions[`${branch.id}-${ni}`] = {
        x: nx, y: ny,
        cx: nx + NODE_W / 2,
        cy: ny + NODE_H / 2,
      }

      const bottom = ny + NODE_H
      if (bottom > maxLeafBottom) maxLeafBottom = bottom
    })
  })

  const svgHeight = maxLeafBottom + 60   // bottom padding

  return { positions, svgHeight }
}