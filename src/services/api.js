// Simple in-memory mock API with server fallbacks
const store = {
  users: [], // {id, name, email, role, password}
  records: {}, // key: userId, value: array of records
  appointments: [], // {id, patientId, doctorId, date, notes}
  prescriptions: [], // {id, patientId, doctorId, text, date, medication, dosage, frequency, duration, instructions}
}

export async function register({ name, email, password, role }) {
  const exists = store.users.find((u) => u.email === email)
  if (exists) throw new Error('Email already registered')
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  const user = { id, name, email, password, role }
  store.users.push(user)
  return sanitize(user)
}

export async function login({ email, password }) {
  const user = store.users.find((u) => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid credentials')
  return sanitize(user)
}

export async function addRecord(userId, record) {
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  const r = { id, ...record, date: record.date || new Date().toISOString() }
  store.records[userId] = [r, ...(store.records[userId] || [])]
  return r
}

export async function listRecords(userId) {
  return store.records[userId] || []
}

// Records API (MongoDB server)
export async function listRecordsServer(patientId) {
  const res = await fetch(`${API_BASE}/records?patientId=${encodeURIComponent(patientId)}`)
  if (!res.ok) throw new Error('Failed to load records')
  return res.json()
}

export async function createRecordServer({ patientId, patientName, title, notes, diagnosis, dataUrl }) {
  const res = await fetch(`${API_BASE}/records`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ patientId, patientName, title, notes, diagnosis, dataUrl }),
  })
  if (!res.ok) throw new Error('Failed to create record')
  return res.json()
}

export async function bookAppointment({ patientId, doctorId, date, notes }) {
  try {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId, date, notes })
    })
    if (res.ok) return res.json()
  } catch {}
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  const appt = { id, patientId, doctorId, date, notes }
  store.appointments.push(appt)
  return appt
}

export async function listAppointments(userId) {
  try {
    const res = await fetch(`${API_BASE}/appointments?userId=${encodeURIComponent(userId)}`)
    if (res.ok) return res.json()
  } catch {}
  return store.appointments.filter((a) => a.patientId === userId || a.doctorId === userId)
}

export async function addPrescription({ patientId, doctorId, text, medication, dosage, frequency, duration, instructions }) {
  try {
    const res = await fetch(`${API_BASE}/prescriptions`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ patientId, doctorId, text, medication, dosage, frequency, duration, instructions })
    })
    if (res.ok) return res.json()
  } catch {}
  const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
  const pr = {
    id,
    patientId,
    doctorId,
    text,
    medication,
    dosage,
    frequency,
    duration,
    instructions,
    date: new Date().toISOString(),
  }
  store.prescriptions.push(pr)
  return pr
}

export async function listPrescriptions(userId) {
  try {
    const res = await fetch(`${API_BASE}/prescriptions?userId=${encodeURIComponent(userId)}`)
    if (res.ok) return res.json()
  } catch {}
  return store.prescriptions.filter((p) => p.patientId === userId || p.doctorId === userId)
}

// Server API base
const API_BASE = 'http://localhost:4000/api'
export async function listFeed() {
  const res = await fetch(`${API_BASE}/feed`)
  if (!res.ok) throw new Error('Failed to load feed')
  return res.json()
}
export async function createFeedItem({ authorId, title, content, tags = [] }) {
  const res = await fetch(`${API_BASE}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ authorId, title, content, tags }),
  })
  if (!res.ok) throw new Error('Failed to create feed item')
  return res.json()
}

function sanitize(user) {
  const { password, ...safe } = user
  return safe
}