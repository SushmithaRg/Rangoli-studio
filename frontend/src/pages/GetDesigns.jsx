import { useState } from 'react'
import { LEVELS, DESIGNS } from '../data/designs.js'

function downloadSvgAsPng(svgString, filename) {
  const img = new Image()
  img.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 800
    canvas.height = 800
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, 800, 800)
    ctx.drawImage(img, 0, 0, 800, 800)
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
  img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgString)
}

export default function GetDesigns() {
  const [filter, setFilter] = useState('all')
  const items =
    filter === 'all'
      ? LEVELS.flatMap((l) => DESIGNS[l].map((d) => ({ ...d, level: l })))
      : DESIGNS[filter].map((d) => ({ ...d, level: filter }))

  return (
    <div className="panel active">
      <h2>Get Designs</h2>
      <p className="lib-note">
        A free, downloadable library of original rangoli artwork — not part of the game, just here
        for you to enjoy or use for your own rangoli. Tap "Download PNG" to save any design.
      </p>

      <div className="lib-filters">
        {['all', ...LEVELS].map((f) => (
          <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
            {f === 'all' ? 'All Styles' : f}
          </button>
        ))}
      </div>

      <div className="lib-grid">
        {items.map((d) => (
          <div className="lib-card" key={d.level + d.name}>
            <div dangerouslySetInnerHTML={{ __html: d.svg }} />
            <h4>{d.name}</h4>
            <div className="tag">{d.level}</div>
            <button onClick={() => downloadSvgAsPng(d.svg, `${d.name.replace(/\s+/g, '-').toLowerCase()}.png`)}>
              ⬇ Download PNG
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
