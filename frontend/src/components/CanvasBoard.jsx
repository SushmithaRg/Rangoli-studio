import { useRef, useState, useEffect, useCallback } from 'react'
import { renderStroke, loadSvgImage } from '../utils/canvasEngine.js'

const COLORS = ['#b5233a', '#f4a300', '#f6c453', '#5c7a4a', '#ffffff', '#e07a3f', '#7a3fa0', '#3a2a20', '#1e6091']

const TOOL_ICONS = { pen: '✏️', eraser: '🧽', line: '╱', rect: '▭', circle: '⚪', triangle: '△', dot: '⚬', fill: '🪣' }
const SHAPE_TOOLS = ['line', 'rect', 'circle', 'triangle']

/**
 * Reusable drawing canvas used by both "Trace a Design" and "Free Draw".
 *
 * Props:
 *  - width, height: logical canvas resolution (px)
 *  - guideSvg: optional SVG string shown as a faint overlay to trace over
 *  - enableCheck: if true (and guideSvg given), shows the "Check My Drawing" button
 *  - onSave(dataUrl): called when the user saves; should return a Promise
 */
export default function CanvasBoard({ width = 480, height = 480, guideSvg = null, enableCheck = false, onSave }) {
  const canvasRef = useRef(null)
  const strokesRef = useRef([])
  const currentPathRef = useRef(null)
  const shapeStartRef = useRef(null)
  const previewShapeRef = useRef(null)
  const dotPointsRef = useRef([])
  const firstDotRef = useRef(null)
  const drawingRef = useRef(false)
  const guideImgRef = useRef(null)

  const [tool, setTool] = useState('pen')
  const [color, setColor] = useState(COLORS[0])
  const [brushSize, setBrushSize] = useState(4)
  const [filledShape, setFilledShape] = useState(false)
  const [showGrid, setShowGrid] = useState(false)
  const [guideEnabled, setGuideEnabled] = useState(true)
  const [saveMsg, setSaveMsg] = useState('')
  const [score, setScore] = useState(null)

  const computeGridDots = useCallback(() => {
    const canvas = canvasRef.current
    const spacing = canvas.width / 12
    const pts = []
    for (let x = spacing; x < canvas.width; x += spacing) {
      for (let y = spacing; y < canvas.height; y += spacing) {
        pts.push({ x, y })
      }
    }
    dotPointsRef.current = pts
  }, [])

  const redrawAll = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#fffdf8'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    if (guideEnabled && guideImgRef.current) {
      ctx.globalAlpha = 0.22
      ctx.drawImage(guideImgRef.current, 0, 0, canvas.width, canvas.height)
      ctx.globalAlpha = 1
    }
    if (showGrid) computeGridDots()
    strokesRef.current.forEach((s) => renderStroke(ctx, s, canvas.width, canvas.height))
    if (previewShapeRef.current) renderStroke(ctx, previewShapeRef.current, canvas.width, canvas.height)
    if (showGrid) {
      ctx.fillStyle = '#d8c7a8'
      dotPointsRef.current.forEach((p) => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2)
        ctx.fill()
      })
    }
  }, [guideEnabled, showGrid, computeGridDots])

  // (Re)load the guide image whenever the reference design changes.
  useEffect(() => {
    let cancelled = false
    strokesRef.current = []
    setScore(null)
    if (guideSvg) {
      loadSvgImage(guideSvg).then((img) => {
        if (!cancelled) {
          guideImgRef.current = img
          redrawAll()
        }
      })
    } else {
      guideImgRef.current = null
      redrawAll()
    }
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guideSvg])

  useEffect(() => { redrawAll() }, [redrawAll])

  function nearestDot(x, y) {
    let best = null
    let bestDist = 18
    dotPointsRef.current.forEach((p) => {
      const d = Math.hypot(p.x - x, p.y - y)
      if (d < bestDist) { bestDist = d; best = p }
    })
    return best
  }

  function getPos(e) {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY }
  }

  function handlePointerDown(e) {
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    const pos = getPos(e)
    if (tool === 'pen' || tool === 'eraser') {
      drawingRef.current = true
      currentPathRef.current = {
        type: 'path',
        color,
        size: tool === 'eraser' ? brushSize * 3 : brushSize,
        points: [pos],
        erase: tool === 'eraser',
      }
    } else if (tool === 'dot') {
      const dot = nearestDot(pos.x, pos.y) || pos
      if (!firstDotRef.current) {
        firstDotRef.current = dot
      } else {
        strokesRef.current.push({ type: 'line', x1: firstDotRef.current.x, y1: firstDotRef.current.y, x2: dot.x, y2: dot.y, color, size: brushSize })
        firstDotRef.current = dot
        redrawAll()
      }
    } else if (SHAPE_TOOLS.includes(tool)) {
      drawingRef.current = true
      shapeStartRef.current = pos
    } else if (tool === 'fill') {
      strokesRef.current.push({ type: 'fill', x: pos.x, y: pos.y, color })
      redrawAll()
    }
  }

  function handlePointerMove(e) {
    if (!drawingRef.current) return
    e.preventDefault()
    const pos = getPos(e)
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (tool === 'pen' || tool === 'eraser') {
      currentPathRef.current.points.push(pos)
      redrawAll()
      renderStroke(ctx, currentPathRef.current, canvas.width, canvas.height)
    } else if (SHAPE_TOOLS.includes(tool)) {
      const base = { color, size: brushSize, filled: filledShape, x1: shapeStartRef.current.x, y1: shapeStartRef.current.y, x2: pos.x, y2: pos.y }
      previewShapeRef.current = tool === 'line' ? { type: 'line', ...base } : { type: tool, ...base }
      redrawAll()
    }
  }

  function handlePointerUp() {
    if (tool === 'pen' || tool === 'eraser') {
      if (drawingRef.current && currentPathRef.current && currentPathRef.current.points.length > 1) {
        strokesRef.current.push(currentPathRef.current)
      }
    } else if (SHAPE_TOOLS.includes(tool)) {
      if (previewShapeRef.current) strokesRef.current.push(previewShapeRef.current)
      previewShapeRef.current = null
    }
    drawingRef.current = false
    currentPathRef.current = null
    redrawAll()
  }

  function handleUndo() { strokesRef.current.pop(); redrawAll() }
  function handleClear() { strokesRef.current = []; firstDotRef.current = null; setScore(null); redrawAll() }

  function handleDownload() {
    const canvas = canvasRef.current
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = `rangoli-${Date.now()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  async function handleSave() {
    setSaveMsg('Saving…')
    try {
      const dataUrl = canvasRef.current.toDataURL('image/png')
      await onSave(dataUrl)
      setSaveMsg('✅ Saved to My Gallery!')
    } catch (err) {
      console.error(err)
      setSaveMsg('⚠️ Could not save right now — please try again.')
    }
    setTimeout(() => setSaveMsg(''), 3500)
  }

  async function handleCheck() {
    setScore({ pct: '…', msg: '' })
    const canvas = canvasRef.current
    const w = canvas.width
    const h = canvas.height
    try {
      const refImg = await loadSvgImage(guideSvg)
      const refCanvas = document.createElement('canvas')
      refCanvas.width = w
      refCanvas.height = h
      const refCtx = refCanvas.getContext('2d')
      refCtx.drawImage(refImg, 0, 0, w, h)
      const refData = refCtx.getImageData(0, 0, w, h).data

      const userCanvas = document.createElement('canvas')
      userCanvas.width = w
      userCanvas.height = h
      const userCtx = userCanvas.getContext('2d')
      strokesRef.current.forEach((s) => renderStroke(userCtx, s, w, h))
      const userData = userCtx.getImageData(0, 0, w, h).data

      let refInk = 0
      let userInk = 0
      let overlap = 0
      for (let i = 0; i < refData.length; i += 4) {
        const isRef = refData[i + 3] > 20
        const isUser = userData[i + 3] > 20
        if (isRef) refInk++
        if (isUser) userInk++
        if (isRef && isUser) overlap++
      }

      let pct = 0
      if (refInk > 0) {
        const recall = overlap / refInk
        const precision = userInk > 0 ? overlap / userInk : 0
        pct = Math.round((recall * 0.7 + precision * 0.3) * 100)
        pct = Math.max(0, Math.min(100, pct))
      }

      let msg
      if (pct >= 80) msg = '🌟 Excellent! Your rangoli closely matches the design.'
      else if (pct >= 55) msg = '👍 Good effort! Try tracing the guide lines a bit more closely.'
      else if (pct >= 25) msg = '✏️ Getting there — turn on the guide outline and trace over it.'
      else msg = '🌸 Turn on "Show Guide Outline" and draw directly over the faint design.'

      setScore({ pct, msg })
    } catch (err) {
      console.error(err)
      setScore({ pct: '—', msg: 'Could not check the drawing right now.' })
    }
  }

  return (
    <div>
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>

      <div className="toolbar">
        <div className="tool-btns">
          {Object.keys(TOOL_ICONS).map((t) => (
            <button
              key={t}
              className={tool === t ? 'active' : ''}
              title={t}
              onClick={() => {
                setTool(t)
                firstDotRef.current = null
                if (t === 'dot' && !showGrid) setShowGrid(true)
              }}
            >
              {TOOL_ICONS[t]}
            </button>
          ))}
        </div>

        <label>
          <input type="checkbox" checked={filledShape} onChange={(e) => setFilledShape(e.target.checked)} /> Filled shape
        </label>

        <div className="swatches">
          {COLORS.map((c) => (
            <div
              key={c}
              className={`swatch ${color === c ? 'selected' : ''}`}
              style={{ background: c, border: c === '#ffffff' ? '2px solid #d8c7a8' : undefined }}
              onClick={() => setColor(c)}
            />
          ))}
        </div>

        <label>
          Size <input type="range" min="2" max="18" value={brushSize} onChange={(e) => setBrushSize(parseInt(e.target.value, 10))} />
        </label>

        <div className="tool-btns">
          <button onClick={() => setShowGrid(!showGrid)}>{showGrid ? 'Hide Dots' : 'Show Dots'}</button>
        </div>

        {guideSvg && (
          <label>
            <input type="checkbox" checked={guideEnabled} onChange={(e) => setGuideEnabled(e.target.checked)} /> Show Guide Outline
          </label>
        )}
      </div>

      <div className="action-btns">
        <button className="btn-undo" onClick={handleUndo}>↩ Undo</button>
        <button className="btn-clear" onClick={handleClear}>🗑 Clear</button>
        <button className="btn-save" onClick={handleSave}>💾 Save to Gallery</button>
        <button className="btn-download" onClick={handleDownload}>⬇ Download to Device</button>
        {enableCheck && guideSvg && <button className="btn-check" onClick={handleCheck}>✓ Check My Drawing</button>}
      </div>

      <div className="save-msg">{saveMsg}</div>

      {score && (
        <div className="score-box show">
          <div className="pct">{score.pct}{typeof score.pct === 'number' ? '%' : ''}</div>
          <div className="bar-bg">
            <div className="bar-fill" style={{ width: `${typeof score.pct === 'number' ? score.pct : 0}%` }} />
          </div>
          <div className="msg">{score.msg}</div>
        </div>
      )}
    </div>
  )
}
