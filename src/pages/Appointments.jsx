import { useEffect, useMemo, useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { bookAppointment, listAppointments } from '../services/api.js'
import { doctors } from '../data/doctors.js'
import { getAvailableSlots } from '../utils/slots.js'
import { useLocation } from 'react-router-dom'

export default function Appointments() {
  const { user } = useCurrentUser()
  const { push } = useNotifications()
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const paramDoctorId = params.get('doctorId') || ''
  const paramSpecialty = params.get('specialty') || ''
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState('')
  const [doctorId, setDoctorId] = useState(paramDoctorId)
  const [notes, setNotes] = useState('')
  const [slots, setSlots] = useState([])
  const [slotLoading, setSlotLoading] = useState(false)
  const isDoctorValid = doctorId.trim().length > 0
  const selectedDate = date ? new Date(date) : null
  const isFuture = selectedDate ? selectedDate.getTime() > Date.now() : false
  const isFormValid = isDoctorValid && isFuture

  const filteredDoctors = useMemo(() => {
    if (!paramSpecialty) return doctors
    return doctors.filter(d => d.specialty.toLowerCase() === paramSpecialty.toLowerCase())
  }, [paramSpecialty])

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

  useEffect(() => {
    let active = true
    async function load() {
      if (!doctorId) { setSlots([]); return }
      setSlotLoading(true)
      const data = await getAvailableSlots(doctorId)
      if (active) {
        setSlots(data)
        setSlotLoading(false)
      }
    }
    load()
    return () => { active = false }
  }, [doctorId])

  const onBook = async (e) => {
    e.preventDefault()
    if (!isFormValid || !user) return
    const appt = await bookAppointment({ patientId: user.id, doctorId, date, notes })
    setAppointments((prev) => [appt, ...prev])
    setDate('')
    setDoctorId('')
    setNotes('')
    push('Appointment booked', 'success')
  }

  const onInstantBook = async (slotIso) => {
    if (!doctorId || !user) return
    const appt = await bookAppointment({ patientId: user.id, doctorId, date: slotIso, notes })
    setAppointments((prev) => [appt, ...prev])
    push('Appointment booked instantly', 'success')
    // Refresh slots to reflect newly booked time
    const next = await getAvailableSlots(doctorId)
    setSlots(next)
  }

  return (
    <section className="page">
      <h2>Appointments</h2>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Instant Booking</h3>
        <p className="help" style={{ marginBottom: '0.5rem' }}>
          {paramSpecialty ? `Filtered by specialty: ${paramSpecialty}` : 'Pick a doctor to see available slots'}
        </p>
        <div className="actions-row" style={{ alignItems: 'center' }}>
          <label style={{ flex: 1 }}>
            Doctor
            <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
              <option value="">Select a doctor</option>
              {filteredDoctors.map((d) => (
                <option key={d.id} value={d.id}>{d.name} — {d.specialty}</option>
              ))}
            </select>
          </label>
        </div>
        {doctorId && (
          <div>
            <div className="help" style={{ margin: '0.5rem 0' }}>Available slots</div>
            {slotLoading ? (
              <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>
            ) : (
              <div className="slots">
                {slots.map((iso) => (
                  <button
                    key={iso}
                    className="btn secondary"
                    onClick={() => onInstantBook(iso)}
                    title={new Date(iso).toLocaleString()}
                  >
                    {new Date(iso).toLocaleString()}
                  </button>
                ))}
                {slots.length === 0 && <p className="help">No slots found. Try another day or doctor.</p>}
              </div>
            )}
          </div>
        )}
      </div>
      {user?.publicMetadata?.role === 'patient' && (
        <form onSubmit={onBook} className="form">
          <label>
            Doctor ID
            <input value={doctorId} onChange={(e) => setDoctorId(e.target.value)} placeholder="Enter doctor ID" />
            <span className="help">{isDoctorValid ? 'Looks good' : 'Doctor ID is required'}</span>
          </label>
          <label>
            Date & Time
            <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} />
            <span className="help">{date ? (isFuture ? 'Future time selected' : 'Please pick a future time') : 'Pick a date & time'}</span>
          </label>
          <label>
            Notes
            <input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Short note" />
          </label>
          <button className="btn" disabled={!isFormValid}>Book Appointment</button>
        </form>
      )}
      <div className="list">
        {appointments.map((a) => (
          <article key={a.id} className="item">
            <div className="meta">{new Date(a.date).toLocaleString()}</div>
            <p>Doctor: {a.doctorId} | Patient: {a.patientId}</p>
            <p>{a.notes}</p>
          </article>
        ))}
        {loading && appointments.length === 0 && <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
        {!loading && appointments.length === 0 && <p>No appointments yet.</p>}
      </div>
    </section>
  )
}