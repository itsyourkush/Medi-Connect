import { Router } from 'express'
import fs from 'fs'
import path from 'path'
import Record from '../models/Record.js'

const router = Router()
const uploadDir = path.join(process.cwd(), 'uploads')
fs.mkdirSync(uploadDir, { recursive: true })

// List records by patientId
router.get('/', async (req, res) => {
  const { patientId } = req.query
  if (!patientId) return res.status(400).json({ error: 'patientId required' })
  const items = await Record.find({ patientId }).sort({ createdAt: -1 }).limit(200)
  res.json(items)
})

// Create record: text or base64 dataUrl file/image
router.post('/', async (req, res) => {
  const { patientId, title, notes, diagnosis, dataUrl } = req.body
  if (!patientId || !title) return res.status(400).json({ error: 'patientId and title required' })

  let type = 'text'
  let fileUrl
  let mimeType
  if (dataUrl && typeof dataUrl === 'string' && dataUrl.startsWith('data:')) {
    // dataUrl format: data:<mime>;base64,<payload>
    const [head, payload] = dataUrl.split(',')
    const mime = head.slice(5, head.indexOf(';'))
    mimeType = mime
    const buf = Buffer.from(payload, 'base64')
    const ext = mime.split('/')[1] || 'bin'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const full = path.join(uploadDir, filename)
    fs.writeFileSync(full, buf)
    fileUrl = `/uploads/${filename}`
    type = mime.startsWith('image/') ? 'image' : 'file'
  }

  const rec = await Record.create({ patientId, title, notes, diagnosis, type, fileUrl, mimeType })
  res.status(201).json(rec)
})

export default router