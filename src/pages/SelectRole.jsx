import { useState } from 'react'
import { useUser as useClerkUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { useAuth as useLocalAuth } from '../context/AuthContext.jsx'
import { hasClerk } from '../config/auth.js'

export default function SelectRole() {
  const { user: clerkUser } = useClerkUser()
  const { user: localUser, login } = useLocalAuth()
  const navigate = useNavigate()
  const { push } = useNotifications()
  const [role, setRole] = useState(hasClerk ? (clerkUser?.publicMetadata?.role || 'patient') : (localUser?.role || 'patient'))
  const [saving, setSaving] = useState(false)

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (hasClerk) {
        await clerkUser.update({ publicMetadata: { ...clerkUser.publicMetadata, role } })
      } else {
        if (!localUser) throw new Error('Please login first')
        login({ ...localUser, role })
      }
      push('Role saved', 'success')
      navigate('/dashboard')
    } catch (err) {
      push(err.message || 'Unable to save role', 'error')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="page">
      <h2>Select Your Role</h2>
      <p>Choose how you’ll use MediConnect.</p>
      <form onSubmit={save} className="form">
        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="patient">Patient</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <button className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save & Continue'}</button>
      </form>
    </section>
  )
}