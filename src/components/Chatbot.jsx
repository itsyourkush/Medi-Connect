import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { triage } from '../utils/triage.js'
import { useI18n } from '../context/I18nContext.jsx'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { t } = useI18n()

  const analyze = (e) => {
    e?.preventDefault()
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      setResult(triage(input))
      setLoading(false)
    }, 350)
  }

  const container = {
    position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 1000,
  }
  const panel = {
    width: '320px', maxWidth: '90vw', background: 'var(--surface)', color: 'var(--text)',
    border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 10px 24px rgba(0,0,0,0.15)',
    overflow: 'hidden'
  }
  const header = {
    padding: '0.75rem 1rem', background: 'var(--bg)', borderBottom: '1px solid var(--border)',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  }
  const body = { padding: '0.75rem 1rem' }
  const toggleBtn = {
    background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '999px',
    padding: '0.75rem 1rem', fontSize: '1rem', boxShadow: '0 6px 16px rgba(0,0,0,0.15)', cursor: 'pointer'
  }

  return (
    <div style={container} aria-live="polite">
      {open ? (
        <div style={panel} role="dialog" aria-label={t('chat.title')}>
          <div style={header}>
            <strong>{t('chat.title')}</strong>
            <button className="btn secondary" onClick={() => setOpen(false)} aria-label="Close">✕</button>
          </div>
          <div style={body}>
            {!result && (
              <>
                <p style={{ marginTop: 0 }}>{t('chat.hello')}</p>
                <p className="help" style={{ marginTop: '0.25rem' }}>{t('chat.typePrompt')}</p>
              </>
            )}
            {result && (
              <div className="card" style={{ marginTop: '0.5rem' }}>
                <div className="feature-icon">🤖</div>
                <p className="item meta" style={{ margin: 0 }}>{t('chat.recommended')}: {result.specialty}</p>
                <p className="item meta" style={{ margin: '0.25rem 0 0.5rem' }}>{t('chat.severity')}: {result.severity}</p>
                <div className="actions-row">
                  <button className="btn" onClick={() => navigate(`/doctors?specialty=${encodeURIComponent(result.specialty)}`)}>{t('chat.browseDoctors')}</button>
                  <button className="btn secondary" onClick={() => navigate('/appointments')}>{t('chat.bookAppointment')}</button>
                  <button className="btn" onClick={() => navigate('/consult/demo')}>{t('chat.startConsult')}</button>
                </div>
              </div>
            )}
            <form onSubmit={analyze} className="form" style={{ marginTop: '0.5rem' }}>
              <label style={{ display: 'block' }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('chat.placeholder')}
                  rows={3}
                  style={{ width: '100%' }}
                />
              </label>
              <div className="actions-row" style={{ marginTop: '0.5rem' }}>
                <button className="btn" disabled={loading || !input.trim()}>{loading ? 'Analyzing…' : t('symptom.analyze')}</button>
                <button type="button" className="btn secondary" onClick={() => { setInput(''); setResult(null) }}>{t('symptom.clear')}</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <button style={toggleBtn} onClick={() => setOpen(true)} aria-label={t('chat.title')}>💬 {t('chat.title')}</button>
      )}
    </div>
  )
}