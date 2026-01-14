import mongoose from 'mongoose'

const FeedSchema = new mongoose.Schema({
  authorId: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [String],
}, { timestamps: true })

export default mongoose.model('Feed', FeedSchema)