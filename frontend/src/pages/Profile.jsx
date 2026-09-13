import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'
import { updateAvatar } from '../api.js'

export default function Profile() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 800 * 1024) {
      alert('Please choose an image smaller than 800KB.')
      return
    }
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const updated = await updateAvatar(ev.target.result)
        setUser(updated)
      } catch (err) {
        console.error(err)
        alert('Could not update your avatar. Please try again.')
      }
    }
    reader.readAsDataURL(file)
  }

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user?.username?.charAt(0)?.toUpperCase() || '?'

  return (
    <div className="panel active">
      <h2>Profile</h2>
      <div className="profile-card">
        <div className="avatar-lg">
          {user?.avatar ? (
            <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            initials
          )}
        </div>
        <div className="uname">{user?.username}</div>
        <label style={{ fontSize: '12px', color: '#8a6f52' }}>
          Change avatar image:
          <input type="file" accept="image/*" onChange={handleFile} />
        </label>
        <div className="profile-note">Your image is stored securely with your account in the database.</div>
        <button className="logout-btn" onClick={handleLogout}>Log Out</button>
      </div>
    </div>
  )
}
