import { NavLink } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function Sidebar() {
  const { user } = useAuth()
  const initials = user?.username?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="sidebar">
      <div className="sb-brand">
        <div className="dot" />
        <h1>Rangoli Studio</h1>
      </div>

      <nav className="sb-nav">
        <NavLink to="/trace" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="sb-icon">🌸</span> Trace a Design
        </NavLink>
        <NavLink to="/draw" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="sb-icon">🎨</span> Free Draw
        </NavLink>
        <NavLink to="/library" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="sb-icon">📥</span> Get Designs
        </NavLink>
        <NavLink to="/gallery" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="sb-icon">🖼️</span> My Gallery
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
          <span className="sb-icon">👤</span> Profile
        </NavLink>
      </nav>

      <div className="sb-divider" />

      <div className="sb-profile-mini">
        <div className="avatar">
          {user?.avatar ? <img src={user.avatar} alt="avatar" /> : initials}
        </div>
        <div>
          <div className="name">{user?.username}</div>
          <div className="sub">Logged in</div>
        </div>
      </div>
    </div>
  )
}
