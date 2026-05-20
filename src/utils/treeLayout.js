// src/utils/treeLayout.js
// Calculates absolute pixel positions for every node in the skills tree.
// Returns a flat map: { [nodeId]: { x, y, w, h } }

export const NODE_W   = 130   // leaf node width
export const NODE_H   = 36    // leaf node height
export const BRANCH_W = 160   // branch header width
export const BRANCH_H = 44    // branch header height
export const ROOT_W   = 200   // root node width
export const ROOT_H   = 56    // root node height

// Column X positions (as fractions of container width)
const ROOT_COL    = 0.08
const BRANCH_COL  = 0.32
const LEAF_COL    = 0.56   // leaves start here; can wrap into 2 sub-cols

// Vertical layout constants
const TOP_PAD     = 60
const BRANCH_GAP  = 36    // vertical gap between branch groups
const LEAF_GAP_Y  = 12    // vertical gap between leaf rows within a branch
const LEAF_GAP_X  = 14    // horizontal gap between leaf columns

/**
 * @param {Array} branches   - skillTree.branches array
 * @param {number} cW        - container pixel width
 * @returns {Object}         - positions map + svgHeight
 */
export function calculateTreePositions(branches, cW) {
  if (!cW || cW < 10) return { positions: {}, svgHeight: 600 }

  const positions = {}

  const rootX   = cW * ROOT_COL
  const branchX = cW * BRANCH_COL
  const leafX   = cW * LEAF_COL
  const leafCols = 2
  const colW    = NODE_W + LEAF_GAP_X

  // First pass: calculate height needed per branch
  const branchHeights = branches.map(branch => {
    const rows = Math.ceil(branch.nodes.length / leafCols)
    return Math.max(BRANCH_H, rows * (NODE_H + LEAF_GAP_Y) - LEAF_GAP_Y)
  })

  const totalBranchH = branchHeights.reduce((a, h) => a + h + BRANCH_GAP, -BRANCH_GAP)
  const svgHeight    = TOP_PAD * 2 + Math.max(ROOT_H, totalBranchH) + 80

  // Root node — vertically centered
  const rootY = svgHeight / 2 - ROOT_H / 2
  positions['root'] = { x: rootX, y: rootY, w: ROOT_W, h: ROOT_H, cx: rootX + ROOT_W / 2, cy: rootY + ROOT_H / 2 }

  // Branch + leaf nodes
  let cursor = (svgHeight - totalBranchH) / 2

  branches.forEach((branch, bi) => {
    const bH   = branchHeights[bi]
    const bY   = cursor + bH / 2 - BRANCH_H / 2

    positions[branch.id] = {
      x: branchX, y: bY, w: BRANCH_W, h: BRANCH_H,
      cx: branchX + BRANCH_W / 2, cy: bY + BRANCH_H / 2
    }

    // Leaf nodes — 2 columns
    branch.nodes.forEach((_, ni) => {
      const col  = ni % leafCols
      const row  = Math.floor(ni / leafCols)
      const nx   = leafX + col * colW
      const totalLeafH = Math.ceil(branch.nodes.length / leafCols) * (NODE_H + LEAF_GAP_Y) - LEAF_GAP_Y
      const leafStartY = cursor + bH / 2 - totalLeafH / 2
      const ny   = leafStartY + row * (NODE_H + LEAF_GAP_Y)

      positions[`${branch.id}-${ni}`] = {
        x: nx, y: ny, w: NODE_W, h: NODE_H,
        cx: nx + NODE_W / 2, cy: ny + NODE_H / 2
      }
    })

    cursor += bH + BRANCH_GAP
  })

  return { positions, svgHeight }
}