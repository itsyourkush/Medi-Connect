import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { listAppointments } from '../services/api.js'

export default function DoctorDashboard() {
  const { user } = useCurrentUser()
  const { notifications, remove } = useNotifications()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [room, setRoom] = useState('')
  const [lastRoom, setLastRoom] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    if (user?.id) {
      setLoading(true)
      listAppointments(user.id).then((data) => {
        if (mounted) {
          setAppointments(data)
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
    const savedRoom = localStorage.getItem('last_room_id') || ''
    setLastRoom(savedRoom)
    return () => { mounted = false }
  }, [user])

  const joinRoom = (e) => {
    e.preventDefault()
    if (!room.trim()) return
    const rid = room.trim()
    localStorage.setItem('last_room_id', rid)
    setLastRoom(rid)
    navigate(`/consult/${encodeURIComponent(rid)}`)
  }

  const generateRoom = () => {
    const rid = `room-${Math.random().toString(36).slice(2, 8)}`
    setRoom(rid)
  }

  return (
    <section className="page">
      <h2>Doctor Dashboard</h2>
      <div className="grid" style={{ marginTop: '0.5rem' }}>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Notifications</h3>
          <div className="list">
            {notifications.slice(0, 8).map((n) => (
              <article key={n.id} className={`item ${n.type}`}>
                <div className="meta">{new Date(n.createdAt).toLocaleString()}</div>
                <p>{n.message}</p>
                <button className="btn small" onClick={() => remove(n.id)}>Dismiss</button>
              </article>
            ))}
            {notifications.length === 0 && <p>No notifications.</p>}
          </div>
          <div className="actions-row">
            <a className="btn secondary" href="/notifications">View All</a>
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginTop: 0 }}>Video Consultations</h3>
          <p className="help">Join a scheduled consultation or start a new room.</p>
          <form onSubmit={joinRoom} className="form">
            <label>
              Room ID
              <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Enter room id" />
            </label>
            <button className="btn" disabled={!room.trim()}>Start/Join</button>
            <a className="btn secondary" href="/consult/demo">Join Demo</a>
          </form>
          <div className="actions-row">
            <button className="btn secondary" onClick={generateRoom}>Generate Room ID</button>
            {lastRoom && (
              <a className="btn" href={`/consult/${encodeURIComponent(lastRoom)}`}>Rejoin Last Room ({lastRoom})</a>
            )}
          </div>
          <div className="list" style={{ marginTop: '0.5rem' }}>
            {appointments.map((a) => (
              <article key={a.id} className="item">
                <div className="meta">{new Date(a.date).toLocaleString()}</div>
                <p>Patient: {a.patientId}</p>
                <a className="btn" href={`/consult/${a.id}`}>Join</a>
              </article>
            ))}
            {loading && appointments.length === 0 && <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
            {!loading && appointments.length === 0 && <p>No consultations scheduled.</p>}
          </div>
        </div>
      </div>
      <div className="actions" style={{ marginTop: '0.5rem' }}>
        <a className="btn" href="/doctor/records">Patient Records</a>
        <a className="btn secondary" href="/prescriptions">Prescriptions</a>
        <a className="btn" href="/appointments">Manage Appointments</a>
      </div>
    </section>
  )
}