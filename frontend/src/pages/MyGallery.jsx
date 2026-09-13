import { useEffect, useState } from 'react'
import { listDesigns, deleteDesign } from '../api.js'

export default function MyGallery() {
  const [designs, setDesigns] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    try {
      const data = await listDesigns()
      setDesigns(data)
    } catch (err) {
      console.error(err)
      setError('Could not load your gallery right now.')
    }
  }

  useEffect(() => { load() }, [])

  async function handleDelete(id) {
    await deleteDesign(id)
    load()
  }

  function handleDownload(design) {
    const a = document.createElement('a')
    a.href = design.image_data
    a.download = `rangoli-${design.id}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div className="panel active">
      <h2>My Gallery</h2>
      <p className="lib-note">Your saved designs, kept permanently in your account. Download any of them anytime.</p>

      {error && <div className="empty-note">{error}</div>}
      {!error && designs === null && <div className="loading-note">Loading your gallery…</div>}
      {!error && designs && designs.length === 0 && (
        <div className="empty-note">No saved designs yet. Draw something and hit "Save to Gallery"! 🌸</div>
      )}
      {!error && designs && designs.length > 0 && (
        <div className="gallery-grid">
          {designs.map((d) => (
            <div className="gallery-item" key={d.id}>
              <img src={d.image_data} alt="Saved rangoli design" />
              <div className="meta">
                {d.label}
                <br />
                {new Date(d.created_at).toLocaleDateString()}
              </div>
              <div className="row">
                <button onClick={() => handleDownload(d)}>Download</button>
                <button onClick={() => handleDelete(d.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
