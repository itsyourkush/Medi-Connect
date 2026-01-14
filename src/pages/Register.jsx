import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { register as apiRegister } from '../services/api.js'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('patient')
  const { login } = useAuth()
  const { push } = useNotifications()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const isNameValid = name.trim().length >= 2
  const isEmailValid = /.+@.+\..+/.test(email)
  const isPasswordValid = password.length >= 6
  const formValid = isNameValid && isEmailValid && isPasswordValid

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!formValid) return
    setLoading(true)
    try {
      const user = await apiRegister({ name, email, password, role })
      login(user)
      push('Registered successfully', 'success')
      if (user.role === 'doctor') {
        navigate('/doctor', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }
    } catch (err) {
      push(err.message || 'Registration failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="page auth">
      <h2>Register</h2>
      <form onSubmit={onSubmit} className="form">
        <label>
          Full Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <span className="help">{isNameValid ? 'Looks good' : 'Enter at least 2 characters'}</span>
        </label>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <span className="help">{isEmailValid ? 'Valid email' : 'Enter a valid email'}</span>
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <span className="help">{isPasswordValid ? 'Strong enough' : 'At least 6 characters'}</span>
        </label>
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <button className="btn" disabled={loading || !formValid}>{loading ? 'Creating...' : 'Create Account'}</button>
      </form>
    </section>
  )
}