import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext.jsx'

export default function Login() {
  const [isSignup, setIsSignup] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const { login, signup, user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/trace')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      if (isSignup) await signup(username, password)
      else await login(username, password)
      navigate('/trace')
    } catch (err) {
      setError(err?.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={handleSubmit}>
        <div className="dot-big" />
        <h2>Rangoli Studio</h2>
        <p className="sub">Create your profile to save and revisit your designs</p>
        <div className="login-error">{error}</div>
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" autoComplete="off" />
        <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'Please wait…' : isSignup ? 'Create Profile' : 'Log In'}
        </button>
        <div className="toggle-mode">
          {isSignup ? 'Already have a profile? ' : 'New here? '}
          <a onClick={() => setIsSignup(!isSignup)}>{isSignup ? 'Log in' : 'Create a profile'}</a>
        </div>
        <div className="privacy-note">
          Your profile is stored securely in the PostgreSQL database. Logging back in with the
          same username and password returns you to your same profile and gallery.
        </div>
      </form>
    </div>
  )
}
