import mongoose from 'mongoose'

const RecordSchema = new mongoose.Schema({
  patientId: { type: String, required: true },
  title: { type: String, required: true },
  notes: { type: String },
  diagnosis: { type: String },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' },
  fileUrl: { type: String },
  mimeType: { type: String },
}, { timestamps: true })

export default mongoose.model('Record', RecordSchema)