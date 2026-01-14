import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '../context/I18nContext.jsx'
import { triage } from '../utils/triage.js'

export default function SymptomChecker() {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useI18n()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // In future, call backend /api/triage; for now, local rules.
    setTimeout(() => {
      setResult(triage(text))
      setLoading(false)
    }, 350)
  }

  return (
    <section className="page">
      <h2>{t('symptom.title')}</h2>
      <p className="help">{t('symptom.describe')}</p>
      <form onSubmit={submit} className="form">
        <label>
          {t('symptom.field')}
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="e.g. chest pain and shortness of breath for 2 days" />
        </label>
        <div className="actions-row">
          <button className="btn" disabled={loading || !text.trim()}>{loading ? 'Analyzing…' : t('symptom.analyze')}</button>
          <button type="button" className="btn secondary" onClick={() => setText('')}>{t('symptom.clear')}</button>
        </div>
      </form>

      {result && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div className="feature-icon">🧠</div>
          <h3 style={{ marginTop: 0 }}>{t('symptom.suggested')}</h3>
          <p className="item meta" style={{ margin: 0 }}>{t('symptom.recommended')}: {result.specialty}</p>
          <p className="item meta" style={{ margin: '0.25rem 0 0.5rem' }}>{t('symptom.severity')}: {result.severity}</p>
          {result.severity !== 'Low' ? (
            <p style={{ color: 'var(--primary)', margin: '0.25rem 0' }}>{t('symptom.unlocked')}</p>
          ) : (
            <p style={{ color: 'var(--muted)', margin: '0.25rem 0' }}>{t('symptom.low')}</p>
          )}
          <div className="actions-row" style={{ marginTop: '0.5rem' }}>
            <Link to={`/doctors?specialty=${encodeURIComponent(result.specialty)}`} className="btn">{t('symptom.browseDoctors')}</Link>
            <Link to={`/appointments?specialty=${encodeURIComponent(result.specialty)}`} className="btn secondary">{t('symptom.bookAppointment')}</Link>
            <button className="btn" onClick={() => navigate('/consult/demo')}>{t('symptom.startConsult')}</button>
          </div>
        </div>
      )}
    </section>
  )
}