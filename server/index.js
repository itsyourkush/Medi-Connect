import express from 'express'
import cors from 'cors'
import fs from 'fs'
import path from 'path'

const app = express()
const PORT = 4000
const DATA_FILE = path.join(process.cwd(), 'server', 'db.json')

app.use(cors({ origin: true }))
app.use(express.json({ limit: '5mb' }))

function ensureDB() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })
      fs.writeFileSync(DATA_FILE, JSON.stringify({ records: [], feed: [] }, null, 2))
    }
  } catch {}
}

function loadDB() {
  ensureDB()
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw)
  } catch {
    return { records: [], feed: [] }
  }
}

function saveDB(db) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2))
  } catch {}
}

function genId() {
  return globalThis.crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
}

// Health
app.get('/api/health', (req, res) => {
  res.json({ ok: true, uptime: process.uptime() })
})

// Records API
app.get('/api/records', (req, res) => {
  const { patientId } = req.query
  const db = loadDB()
  let items = db.records
  if (patientId) items = items.filter((r) => r.patientId === patientId)
  items = items.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime())
  res.json(items)
})

app.post('/api/records', (req, res) => {
  const { patientId, patientName, title, notes, diagnosis, dataUrl, type, fileUrl } = req.body || {}
  if (!patientId || !title) {
    return res.status(400).json({ error: 'patientId and title are required' })
  }
  const db = loadDB()
  const item = {
    _id: genId(),
    patientId,
    patientName,
    title,
    notes: notes || '',
    diagnosis: diagnosis || '',
    type: type || (dataUrl?.startsWith('data:image') ? 'image' : (fileUrl ? 'file' : 'note')),
    fileUrl: fileUrl || (dataUrl && dataUrl.startsWith('data:') ? dataUrl : undefined),
    date: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  db.records.unshift(item)
  saveDB(db)
  res.status(201).json(item)
})

// Appointments API
app.get('/api/appointments', (req, res) => {
  const { userId } = req.query
  const db = loadDB()
  let items = db.appointments || []
  if (userId) items = items.filter((a) => a.patientId === userId || a.doctorId === userId)
  items = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  res.json(items)
})

app.post('/api/appointments', (req, res) => {
  const { patientId, doctorId, date, notes } = req.body || {}
  if (!patientId || !doctorId || !date) {
    return res.status(400).json({ error: 'patientId, doctorId and date are required' })
  }
  const db = loadDB()
  if (!db.appointments) db.appointments = []
  const appt = { id: genId(), patientId, doctorId, date, notes: notes || '' }
  db.appointments.unshift(appt)
  saveDB(db)
  res.status(201).json(appt)
})

// Prescriptions API
app.get('/api/prescriptions', (req, res) => {
  const { userId } = req.query
  const db = loadDB()
  let items = db.prescriptions || []
  if (userId) items = items.filter((p) => p.patientId === userId || p.doctorId === userId)
  items = items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  res.json(items)
})

app.post('/api/prescriptions', (req, res) => {
  const { patientId, doctorId, text, medication, dosage, frequency, duration, instructions } = req.body || {}
  if (!patientId || !doctorId) {
    return res.status(400).json({ error: 'patientId and doctorId are required' })
  }
  const db = loadDB()
  if (!db.prescriptions) db.prescriptions = []
  const pr = {
    id: genId(),
    patientId,
    doctorId,
    text: text || '',
    medication: medication || '',
    dosage: dosage || '',
    frequency: frequency || '',
    duration: duration || '',
    instructions: instructions || '',
    date: new Date().toISOString(),
  }
  db.prescriptions.unshift(pr)
  saveDB(db)
  res.status(201).json(pr)
})

// Feed API
app.get('/api/feed', (req, res) => {
  const db = loadDB()
  const items = db.feed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  res.json(items)
})

app.post('/api/feed', (req, res) => {
  const { authorId, title, content, tags = [] } = req.body || {}
  if (!authorId || !title) {
    return res.status(400).json({ error: 'authorId and title are required' })
  }
  const db = loadDB()
  const item = { id: genId(), authorId, title, content: content || '', tags, createdAt: new Date().toISOString() }
  db.feed.unshift(item)
  saveDB(db)
  res.status(201).json(item)
})

app.listen(PORT, () => {
  console.log(`API server listening on http://localhost:${PORT}/api`)
})