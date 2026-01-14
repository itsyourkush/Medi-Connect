import { useEffect, useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { addPrescription, listPrescriptions } from '../services/api.js'

export default function Prescriptions() {
  const { user } = useCurrentUser()
  const { push } = useNotifications()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [patientId, setPatientId] = useState('')
  const [medication, setMedication] = useState('')
  const [dosage, setDosage] = useState('')
  const [frequency, setFrequency] = useState('')
  const [duration, setDuration] = useState('')
  const [instructions, setInstructions] = useState('')

  useEffect(() => {
    let mounted = true
    if (user) {
      setLoading(true)
      listPrescriptions(user.id).then((data) => {
        if (mounted) {
          setItems(data)
          setLoading(false)
        }
      })
    } else {
      setLoading(false)
    }
    return () => { mounted = false }
  }, [user])

  const onAdd = async (e) => {
    e.preventDefault()
    if (user?.publicMetadata?.role !== 'doctor') return
    if (!patientId || !medication.trim() || !dosage.trim()) return
    const pr = await addPrescription({
      patientId,
      doctorId: user.id,
      medication,
      dosage,
      frequency,
      duration,
      instructions,
    })
    setItems((prev) => [pr, ...prev])
    setMedication('')
    setDosage('')
    setFrequency('')
    setDuration('')
    setInstructions('')
    setPatientId('')
    push('Prescription added', 'success')
  }

  return (
    <section className="page">
      <h2>Prescriptions</h2>
      {user?.publicMetadata?.role === 'doctor' && (
        <form onSubmit={onAdd} className="form">
          <label>
            Patient ID
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Enter patient ID" />
          </label>
          <div className="grid" style={{ gap: '0.75rem' }}>
            <label>
              Medication
              <input value={medication} onChange={(e) => setMedication(e.target.value)} placeholder="e.g., Amoxicillin" />
            </label>
            <label>
              Dosage
              <input value={dosage} onChange={(e) => setDosage(e.target.value)} placeholder="e.g., 500 mg" />
            </label>
            <label>
              Frequency
              <input value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="e.g., 2 times/day" />
            </label>
            <label>
              Duration
              <input value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="e.g., 5 days" />
            </label>
          </div>
          <label>
            Instructions
            <textarea value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="e.g., Take after meals, avoid alcohol" />
          </label>
          <button className="btn">Add Prescription</button>
        </form>
      )}
      <div className="list">
        {items.map((p) => (
          <article key={p.id} className="item">
            <div className="meta">{new Date(p.date || p.issuedOn || Date.now()).toLocaleString()}</div>
            <p>Doctor: {p.doctorId || p.doctorName} | Patient: {p.patientId || p.patientName}</p>
            {p.medication ? (
              <div>
                <p><strong>{p.medication}</strong> — {p.dosage}</p>
                <p>Frequency: {p.frequency || '—'} • Duration: {p.duration || '—'}</p>
                {p.instructions && <p>{p.instructions}</p>}
              </div>
            ) : (
              <p>{p.text}</p>
            )}
          </article>
        ))}
        {loading && items.length === 0 && <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
        {!loading && items.length === 0 && <p>No prescriptions yet.</p>}
      </div>
    </section>
  )
}