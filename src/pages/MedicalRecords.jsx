import { useEffect, useRef, useState } from 'react'
import { useCurrentUser } from '../hooks/useCurrentUser.js'
import { useNotifications } from '../context/NotificationsContext.jsx'
import { listRecordsServer, createRecordServer } from '../services/api.js'

export default function MedicalRecords() {
  const { user } = useCurrentUser()
  const { push } = useNotifications()
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [diagnosis, setDiagnosis] = useState('')
  const [dataUrl, setDataUrl] = useState('')
  const [cameraOn, setCameraOn] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    let mounted = true
    if (user) {
      setLoading(true)
      listRecordsServer(user.id).then((data) => {
        if (mounted) {
          setRecords(data)
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
    if (!title.trim()) return
    const r = await createRecordServer({ patientId: user.id, patientName: user?.name || user?.email || user?.id, title: title.trim(), notes: notes.trim(), diagnosis: diagnosis.trim(), dataUrl })
    setRecords((prev) => [r, ...prev])
    setTitle('')
    setNotes('')
    setDiagnosis('')
    setDataUrl('')
    push('Record saved', 'success')
  }

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
    } catch (err) {
      push('Camera access denied', 'error')
    }
  }

  const stopCamera = () => {
    try { streamRef.current?.getTracks().forEach((t) => t.stop()) } catch {}
    streamRef.current = null
    if (videoRef.current) videoRef.current.srcObject = null
    setCameraOn(false)
  }

  const capturePhoto = () => {
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 640
    canvas.height = video.videoHeight || 480
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const url = canvas.toDataURL('image/png')
    setDataUrl(url)
    push('Photo captured', 'success')
  }

  const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      setDataUrl(typeof result === 'string' ? result : '')
      push('File ready to upload', 'success')
    }
    reader.readAsDataURL(file)
  }

  useEffect(() => () => stopCamera(), [])

  return (
    <section className="page">
      <h2>Medical Records</h2>
      <form onSubmit={onAdd} className="form">
        <label>
          Title
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. X-Ray Report, Diagnosis Note" />
        </label>
        <label>
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Symptoms, findings, treatment..." />
        </label>
        <label>
          Diagnosis
          <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="Optional diagnosis" />
        </label>

        <div className="actions-row" style={{ marginTop: '0.5rem' }}>
          {!cameraOn ? (
            <button type="button" className="btn secondary" onClick={startCamera}>Start Camera</button>
          ) : (
            <>
              <button type="button" className="btn" onClick={capturePhoto}>Capture Photo</button>
              <button type="button" className="btn secondary" onClick={stopCamera}>Stop Camera</button>
            </>
          )}
          <label className="btn secondary" style={{ cursor: 'pointer' }}>
            Upload File
            <input type="file" style={{ display: 'none' }} onChange={onFileChange} />
          </label>
        </div>

        {cameraOn && (
          <div className="video-tile" style={{ marginTop: '0.5rem' }}>
            <video ref={videoRef} autoPlay playsInline style={{ maxWidth: '100%', borderRadius: '8px' }} />
            <div className="meta">Live Camera</div>
          </div>
        )}
        {dataUrl && (
          <div className="item" style={{ marginTop: '0.5rem' }}>
            {dataUrl.startsWith('data:image') ? (
              <img src={dataUrl} alt="Preview" style={{ maxWidth: '100%', borderRadius: '8px' }} />
            ) : (
              <p>File attached</p>
            )}
            <div className="meta">Ready to upload</div>
          </div>
        )}

        <button className="btn" disabled={!title.trim()}>Save Record</button>
      </form>
      <div className="list">
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
        {loading && records.length === 0 && <div className="item skeleton"><div className="skeleton-line" /><div className="skeleton-line" /><div className="skeleton-line" /></div>}
        {!loading && records.length === 0 && <p>No records yet.</p>}
      </div>
    </section>
  )
}