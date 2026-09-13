import { useState } from 'react'
import CanvasBoard from '../components/CanvasBoard.jsx'
import { LEVELS, DESIGNS } from '../data/designs.js'
import { createDesign } from '../api.js'

const LEVEL_LABELS = { beginner: '🌱 Beginner', intermediate: '🌼 Intermediate', advanced: '🔥 Advanced' }

export default function TraceDesign() {
  const [level, setLevel] = useState('beginner')
  const [index, setIndex] = useState(0)
  const design = DESIGNS[level][index]

  async function handleSave(dataUrl) {
    await createDesign({
      category: 'trace',
      label: `Traced: ${design.name} (${level})`,
      level,
      image_data: dataUrl,
    })
  }

  return (
    <div className="panel active">
      <h2>Trace a Design</h2>

      <div className="level-tabs">
        {LEVELS.map((l) => (
          <button
            key={l}
            className={`lvl-${l} ${level === l ? 'active' : ''}`}
            onClick={() => { setLevel(l); setIndex(0) }}
          >
            {LEVEL_LABELS[l]}
          </button>
        ))}
      </div>

      <div className="trace-layout">
        <div className="trace-side">
          <h3>Reference Design</h3>
          <div className="design-preview" dangerouslySetInnerHTML={{ __html: design.svg }} />
          <div className="design-picker">
            {DESIGNS[level].map((d, i) => (
              <button key={d.name} className={i === index ? 'active' : ''} onClick={() => setIndex(i)}>
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div className="trace-side">
          <h3>Your Canvas</h3>
          <CanvasBoard
            key={`${level}-${index}`}
            width={480}
            height={480}
            guideSvg={design.svg}
            enableCheck
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  )
}
