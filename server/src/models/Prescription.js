import mongoose from 'mongoose'

const PrescriptionSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  doctorName: { type: String, required: true },
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  instructions: { type: String },
  issuedOn: { type: Date, default: () => new Date() }
}, { timestamps: true })

export default mongoose.model('Prescription', PrescriptionSchema)