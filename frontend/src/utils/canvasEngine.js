export function hexToRgba(hex) {
  const h = hex.replace('#', '')
  const bigint = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255, 255]
}

export function floodFill(ctx, startX, startY, fillColorHex, canvasWidth, canvasHeight) {
  startX = Math.round(startX)
  startY = Math.round(startY)
  if (startX < 0 || startY < 0 || startX >= canvasWidth || startY >= canvasHeight) return

  const imgData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const data = imgData.data
  const idx = (startY * canvasWidth + startX) * 4
  const target = [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]]
  const fill = hexToRgba(fillColorHex)
  if (target[0] === fill[0] && target[1] === fill[1] && target[2] === fill[2]) return

  const tolerance = 40
  function matches(i) {
    return (
      Math.abs(data[i] - target[0]) <= tolerance &&
      Math.abs(data[i + 1] - target[1]) <= tolerance &&
      Math.abs(data[i + 2] - target[2]) <= tolerance
    )
  }

  const stack = [[startX, startY]]
  const visited = new Uint8Array(canvasWidth * canvasHeight)
  while (stack.length) {
    const [x, y] = stack.pop()
    if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue
    const pxIndex = y * canvasWidth + x
    if (visited[pxIndex]) continue
    const i = pxIndex * 4
    if (!matches(i)) continue
    visited[pxIndex] = 1
    data[i] = fill[0]
    data[i + 1] = fill[1]
    data[i + 2] = fill[2]
    data[i + 3] = 255
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
  }
  ctx.putImageData(imgData, 0, 0)
}

/** Renders one stroke object onto a given canvas context. Shared between the
 * live drawing canvas and the offscreen canvases used for scoring/export. */
export function renderStroke(ctx, s, canvasWidth, canvasHeight) {
  if (s.type === 'path') {
    ctx.globalCompositeOperation = s.erase ? 'destination-out' : 'source-over'
    ctx.strokeStyle = s.color
    ctx.lineWidth = s.size
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    s.points.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    })
    ctx.stroke()
    ctx.globalCompositeOperation = 'source-over'
  } else if (s.type === 'line') {
    ctx.strokeStyle = s.color
    ctx.lineWidth = s.size
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(s.x1, s.y1)
    ctx.lineTo(s.x2, s.y2)
    ctx.stroke()
  } else if (s.type === 'rect') {
    ctx.strokeStyle = s.color
    ctx.fillStyle = s.color
    ctx.lineWidth = s.size
    const x = Math.min(s.x1, s.x2)
    const y = Math.min(s.y1, s.y2)
    const w = Math.abs(s.x2 - s.x1)
    const h = Math.abs(s.y2 - s.y1)
    if (s.filled) ctx.fillRect(x, y, w, h)
    else ctx.strokeRect(x, y, w, h)
  } else if (s.type === 'circle') {
    const r = Math.hypot(s.x2 - s.x1, s.y2 - s.y1)
    ctx.strokeStyle = s.color
    ctx.fillStyle = s.color
    ctx.lineWidth = s.size
    ctx.beginPath()
    ctx.arc(s.x1, s.y1, r, 0, Math.PI * 2)
    if (s.filled) ctx.fill()
    else ctx.stroke()
  } else if (s.type === 'triangle') {
    ctx.strokeStyle = s.color
    ctx.fillStyle = s.color
    ctx.lineWidth = s.size
    ctx.beginPath()
    ctx.moveTo((s.x1 + s.x2) / 2, s.y1)
    ctx.lineTo(s.x2, s.y2)
    ctx.lineTo(s.x1, s.y2)
    ctx.closePath()
    if (s.filled) ctx.fill()
    else ctx.stroke()
  } else if (s.type === 'fill') {
    floodFill(ctx, s.x, s.y, s.color, canvasWidth, canvasHeight)
  }
}

/** Loads an SVG string as an Image element (via a data: URI) so it can be
 * drawn onto a <canvas> for guide overlays, scoring, and PNG export. */
export function loadSvgImage(svgString) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
  })
}
