import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { login as apiLogin } from '../services/api.js'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const { push } = useNotifications()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isEmailValid = /.+@.+\..+/.test(email)
  const isPasswordValid = password.length >= 6
  const formValid = isEmailValid && isPasswordValid

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formValid) return
    setLoading(true)
    try {
      const user = await apiLogin({ email, password })
      login(user)
      push('Logged in successfully', 'success')
      if (user.role === 'doctor') {
        navigate('/doctor', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      push(err.message || 'Login failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page auth">
      <h2>Login</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <span className="help">{isEmailValid ? 'Valid email' : 'Enter a valid email'}</span>
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span className="help">{isPasswordValid ? 'Looks good' : 'At least 6 characters'}</span>
        </label>
        <button className="btn" disabled={loading || !formValid}>{loading ? 'Logging in...' : 'Login'}</button>
      </form>
    </section>
  )
}