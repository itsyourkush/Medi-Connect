import { useEffect } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { useNavigate } from 'react-router-dom'

export default function Dashboard() {
  const { user } = useCurrentUser()
  const navigate = useNavigate()
  useEffect(() => {
    if (user?.role === 'doctor') navigate('/doctor', { replace: true })
  }, [user, navigate])
  return (
    <section className="page">
      <h2>Dashboard</h2>
      {user ? (
        <div className="card">
          <p>Welcome, {user.fullName || user.email}.</p>
          <p>Role: <strong>{user.role || 'not set'}</strong></p>
          <ul>
            {user.role === 'doctor' ? (
              <>
                <li>Review patient records</li>
                <li>Manage appointments and consultations</li>
                <li>Create prescriptions</li>
              </>
            ) : (
              <>
                <li>Manage your medical records</li>
                <li>Book appointments</li>
                <li>Attend virtual consultations</li>
              </>
            )}
          </ul>
        </div>
      ) : (
        <p>Please login or register to continue.</p>
      )}
    </section>
  )
}