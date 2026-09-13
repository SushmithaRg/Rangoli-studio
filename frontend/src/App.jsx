import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import Sidebar from './components/Sidebar.jsx'
import Login from './pages/Login.jsx'
import TraceDesign from './pages/TraceDesign.jsx'
import FreeDraw from './pages/FreeDraw.jsx'
import GetDesigns from './pages/GetDesigns.jsx'
import MyGallery from './pages/MyGallery.jsx'
import Profile from './pages/Profile.jsx'

function PrivateLayout() {
  const { user, loading } = useAuth()

  if (loading) return <div className="loading-screen">Loading…</div>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/trace" replace />} />
          <Route path="/trace" element={<TraceDesign />} />
          <Route path="/draw" element={<FreeDraw />} />
          <Route path="/library" element={<GetDesigns />} />
          <Route path="/gallery" element={<MyGallery />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <div className="app">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/*" element={<PrivateLayout />} />
        </Routes>
      </div>
    </AuthProvider>
  )
}
