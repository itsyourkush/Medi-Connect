import { Router } from 'express'
import Prescription from '../models/Prescription.js'

const router = Router()

router.get('/', async (req, res) => {
  const items = await Prescription.find().sort({ createdAt: -1 }).limit(100)
  res.json(items)
})

router.post('/', async (req, res) => {
  const { patientName, doctorName, medication, dosage, instructions } = req.body
  if (!patientName || !doctorName || !medication || !dosage) {
    return res.status(400).json({ error: 'Missing required fields' })
  }
  const p = await Prescription.create({ patientName, doctorName, medication, dosage, instructions })
  res.status(201).json(p)
})

export default router