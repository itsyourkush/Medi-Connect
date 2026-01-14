import { Router } from 'express'
import Feed from '../models/Feed.js'

const router = Router()

// List feed items
router.get('/', async (req, res) => {
  const items = await Feed.find().sort({ createdAt: -1 }).limit(50)
  res.json(items)
})

// Create feed item
router.post('/', async (req, res) => {
  const { authorId, title, content, tags } = req.body
  if (!authorId || !title || !content) return res.status(400).json({ error: 'Missing fields' })
  const item = await Feed.create({ authorId, title, content, tags })
  res.status(201).json(item)
})

export default router