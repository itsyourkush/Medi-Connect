import { useEffect, useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { listAppointments } from '../services/api.js'

export default function Consultations() {
  const { user } = useCurrentUser()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    if (user) {
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
    return () => { mounted = false }
  }, [user])

  return (
    <section className="page">
      <h2>Virtual Consultations</h2>
      <p>Join your scheduled consultation from your appointment details.</p>
      <div className="list">
        {appointments.map((a) => (
          <article key={a.id} className="item">
            <div className="meta">{new Date(a.date).toLocaleString()}</div>
            <p>Doctor: {a.doctorId} | Patient: {a.patientId}</p>
            <a className="btn secondary" href={`/consult/${a.id}`}>Join</a>
          </article>
        ))}
        {loading && appointments.length === 0 && <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
        {!loading && appointments.length === 0 && <p>No consultations scheduled.</p>}
      </div>
    </section>
  )
}