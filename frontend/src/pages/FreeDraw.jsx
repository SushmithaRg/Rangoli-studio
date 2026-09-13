import CanvasBoard from '../components/CanvasBoard.jsx'
import { createDesign } from '../api.js'

export default function FreeDraw() {
  async function handleSave(dataUrl) {
    await createDesign({ category: 'freedraw', label: 'Free Draw', image_data: dataUrl })
  }

  return (
    <div className="panel active">
      <h2>Free Draw</h2>
      <CanvasBoard width={500} height={500} onSave={handleSave} />
    </div>
  )
}
