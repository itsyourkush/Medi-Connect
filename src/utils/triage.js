export function triage(text) {
  const t = text.toLowerCase()
  const signals = {
    cardiology: /(chest pain|breath|palpitations|pressure)/,
    dermatology: /(rash|itch|skin|acne|psoriasis|eczema)/,
    general: /(fever|cough|cold|infection|headache|fatigue)/,
    psychiatry: /(anxiety|panic|mood|depression|sleep)/,
    orthopedics: /(back pain|joint|sprain|fracture|knee|shoulder)/,
    endocrinology: /(thyroid|blood sugar|diabetes|insulin)/,
  }
  let specialty = 'General Medicine'
  if (signals.cardiology.test(t)) specialty = 'Cardiology'
  else if (signals.dermatology.test(t)) specialty = 'Dermatology'
  else if (signals.psychiatry.test(t)) specialty = 'Psychiatry'
  else if (signals.orthopedics.test(t)) specialty = 'Orthopedics'
  else if (signals.endocrinology.test(t)) specialty = 'Endocrinology'
  else if (signals.general.test(t)) specialty = 'General Medicine'

  const severity = /(severe|intense|cannot|faint|bleeding|high fever|chest pain)/.test(t)
    ? 'High'
    : /(moderate|worsening|persistent|weeks)/.test(t)
    ? 'Moderate'
    : 'Low'
  return { specialty, severity }
}