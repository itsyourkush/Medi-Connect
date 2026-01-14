import { useEffect, useMemo, useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { listAppointments, listRecordsServer, listRecords, bookAppointment, addRecord, createRecordServer } from '../services/api.js'
import { useLocation, useNavigate } from 'react-router-dom'

export default function DoctorPatientRecords() {
  const { user } = useCurrentUser()
  const { push } = useNotifications()
  const [appointments, setAppointments] = useState([])
  const [loadingAppts, setLoadingAppts] = useState(true)
  const [patientId, setPatientId] = useState('')
  const [records, setRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    if (user?.id) {
      setLoadingAppts(true)
      listAppointments(user.id).then((data) => {
        if (mounted) {
          // Seed demo appointments if none exist
          if (!data.length) {
            const demoNames = ['Ananya Singh','Rahul Mehta','Priya Nair']
            const demoPatients = demoNames.map((_, i) => `pat-${Math.random().toString(36).slice(2, 6)}`)
            const now = Date.now()
            Promise.all(demoPatients.map((pid, i) => bookAppointment({
              patientId: pid,
              doctorId: user.id,
              date: new Date(now + (i + 1) * 60 * 60 * 1000).toISOString(),
              notes: 'Auto-generated demo appointment'
            }))).then((created) => {
              setAppointments(created)
            })
          } else {
            setAppointments(data)
          }
          setLoadingAppts(false)
        }
      })
    } else {
      setLoadingAppts(false)
    }
    // Initialize patient from query param or last selection
    const params = new URLSearchParams(location.search)
    const qPatient = params.get('patientId')
    const last = localStorage.getItem('last_patient_id') || ''
    const initial = qPatient || last
    if (initial) setPatientId(initial)
    return () => { mounted = false }
  }, [user, location.search])

  const patients = useMemo(() => {
    const ids = new Set()
    appointments.forEach((a) => ids.add(a.patientId))
    return Array.from(ids)
  }, [appointments])

  const loadRecords = async (id) => {
    if (!id) return
    try {
      setLoadingRecords(true)
      localStorage.setItem('last_patient_id', id)
      const params = new URLSearchParams(location.search)
      params.set('patientId', id)
      navigate({ search: params.toString() }, { replace: true })
      let data = []
      try {
        data = await listRecordsServer(id)
      } catch (e) {
        data = await listRecords(id)
      }
      if (!data || !data.length) {
        // Generate demo records with names and images
        const nameMap = {
          [id]: ['Ananya Singh','Rahul Mehta','Priya Nair'][Math.floor(Math.random()*3)]
        }
        try {
          await createRecordServer({ patientId: id, patientName: nameMap[id], title: 'Lab Report', notes: 'CBC normal', diagnosis: 'Normal', dataUrl: '' })
          await fetch('http://localhost:4000/api/records', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ patientId: id, patientName: nameMap[id], title: 'Chest X-Ray', notes: 'Posteroanterior view', diagnosis: 'Clear lungs', fileUrl: 'https://images.unsplash.com/photo-1583912268184-bf49a273b37f?q=80&w=1200&auto=format', type: 'image' }) })
          await createRecordServer({ patientId: id, patientName: nameMap[id], title: 'Doctor Notes', notes: 'Hydration, rest, and follow up in 2 weeks', diagnosis: 'Stable' })
          data = await listRecordsServer(id)
        } catch {
          await addRecord(id, { patientName: nameMap[id], title: 'Lab Report', notes: 'CBC normal', diagnosis: 'Normal', type: 'file', fileUrl: 'https://example.com/demo-lab.pdf' })
          await addRecord(id, { patientName: nameMap[id], title: 'Chest X-Ray', notes: 'Posteroanterior view', diagnosis: 'Clear lungs', type: 'image', fileUrl: 'https://images.unsplash.com/photo-1583912268184-bf49a273b37f?q=80&w=1200&auto=format' })
          await addRecord(id, { patientName: nameMap[id], title: 'Doctor Notes', notes: 'Hydration, rest, and follow up in 2 weeks', diagnosis: 'Stable' })
          data = await listRecords(id)
        }
      }
      setRecords(data)
    } catch (err) {
      push(err.message || 'Failed to load records', 'error')
    } finally {
      setLoadingRecords(false)
    }
  }

  useEffect(() => {
    if (patientId) loadRecords(patientId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId])

  return (
    <section className="page">
      <h2>Patient Records</h2>
      <div className="card">
        <h3 style={{ marginTop: 0 }}>Find Patient</h3>
        <div className="actions-row" style={{ alignItems: 'center' }}>
          <label style={{ flex: 1 }}>
            Patient ID
            <input value={patientId} onChange={(e) => setPatientId(e.target.value)} placeholder="Enter patient ID" />
          </label>
          <button className="btn" onClick={() => loadRecords(patientId)} disabled={!patientId.trim()}>Load</button>
        </div>
        <div className="actions-row" style={{ alignItems: 'center' }}>
          <label style={{ flex: 1 }}>
            From appointments
            <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
              <option value="">Select a patient</option>
              {patients.map((pid) => (
                <option key={pid} value={pid}>{pid}</option>
              ))}
            </select>
          </label>
          {loadingAppts && <span className="help">Loading appointments…</span>}
        </div>
        {patients.length === 0 && (
          <p className="help">Demo patients generated. Use the dropdown or enter an ID.</p>
        )}
      </div>

      <div className="list" style={{ marginTop: '0.5rem' }}>
        {records.map((r) => (
          <article key={r._id || r.id} className="item">
            <div className="meta">{new Date(r.createdAt || r.date).toLocaleString()}</div>
            {r.patientName && <p className="item meta" style={{ margin: 0 }}>Patient: {r.patientName}</p>}
            <h4 style={{ margin: '0.25rem 0' }}>{r.title}</h4>
            {r.type === 'image' && r.fileUrl ? (
              <img src={r.fileUrl} alt={r.title} style={{ maxWidth: '100%', borderRadius: '8px' }} />
            ) : null}
            {r.type === 'file' && r.fileUrl ? (
              <a className="btn secondary" href={r.fileUrl} target="_blank" rel="noreferrer">Download Attachment</a>
            ) : null}
            {r.notes && <p>{r.notes}</p>}
            {r.diagnosis && <p><strong>Diagnosis:</strong> {r.diagnosis}</p>}
          </article>
        ))}
        {loadingRecords && records.length === 0 && <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
        {!loadingRecords && patientId && records.length === 0 && <p>No records found for this patient.</p>}
        {!patientId && <p className="help">Select a patient to view their records.</p>}
      </div>
    </section>
  )
}