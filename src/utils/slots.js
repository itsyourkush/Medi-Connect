import { listAppointments } from '../services/api.js'

// Generate available slots for a doctor for the next N days, at a given interval.
// Working hours: 10:00–17:30, 30-minute intervals by default.
export async function getAvailableSlots(doctorId, {
  days = 7,
  intervalMinutes = 30,
  startHour = 10,
  endHour = 17,
} = {}) {
  const booked = await listAppointments(doctorId)
  const bookedTimes = new Set(booked.map((a) => new Date(a.date).toISOString()))

  const slots = []
  const now = new Date()
  now.setSeconds(0, 0)

  for (let d = 0; d < days; d++) {
    const day = new Date(now)
    day.setDate(now.getDate() + d)

    for (let h = startHour; h <= endHour; h++) {
      for (let m = 0; m < 60; m += intervalMinutes) {
        const slot = new Date(day)
        slot.setHours(h, m, 0, 0)
        if (slot.getTime() <= now.getTime()) continue
        const iso = slot.toISOString()
        if (!bookedTimes.has(iso)) {
          slots.push(iso)
        }
      }
    }
  }

  return slots.slice(0, 24) // cap to first 24 slots for UI brevity
}