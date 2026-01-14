import { Router } from 'express'
import Appointment from '../models/Appointment.js'

const router = Router()

// List
router.get('/', async (req, res) => {
  const items = await Appointment.find().sort({ createdAt: -1 })
  res.json(items)
})

// Create
router.post('/', async (req, res) => {
  try {
    const created = await Appointment.create(req.body)
    res.status(201).json(created)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Update
router.put('/:id', async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(updated)
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (e) {
    res.status(400).json({ error: e.message })
  }
})

export default router