import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'

import appointmentsRouter from './routes/appointments.js'
import prescriptionsRouter from './routes/prescriptions.js'
import feedRouter from './routes/feed.js'
import recordsRouter from './routes/records.js'
import path from 'path'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mediconnect'

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }))
app.use(express.json())
app.use(morgan('dev'))
// Static uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')))

// Health
app.get('/api/health', (req, res) => res.json({ ok: true }))

// Routes
app.use('/api/appointments', appointmentsRouter)
app.use('/api/prescriptions', prescriptionsRouter)
app.use('/api/feed', feedRouter)
app.use('/api/records', recordsRouter)

// Connect DB and start
mongoose.connect(MONGO_URI).then(() => {
  console.log('MongoDB connected')
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`))
}).catch(err => {
  console.error('Mongo connection error:', err)
  process.exit(1)
})