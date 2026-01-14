import { Link, useParams } from 'react-router-dom'
import { useI18n } from '../context/I18nContext.jsx'
import { doctorsById } from '../data/doctors.js'
import PaymentOptions from '../components/PaymentOptions.jsx'

export default function DoctorProfile() {
  const { id } = useParams()
  const d = doctorsById[id]
  const { t } = useI18n()
  if (!d) {
    return (
      <section className="page">
        <h2>{t('doctors.notFoundTitle')}</h2>
        <p className="help">{t('doctors.notFoundHelp')}</p>
        <Link to="/doctors" className="btn">{t('doctors.backToList')}</Link>
      </section>
    )
  }

  return (
    <section className="page">
      <h2>{d.name}</h2>
      <div className="card">
        <div className="feature-icon">🩺</div>
        <p className="item meta" style={{ margin: 0 }}>{d.specialty} • {d.experience} yrs • ⭐ {d.rating}</p>
        <p style={{ margin: '0.5rem 0', color: 'var(--muted)' }}>{d.bio}</p>
        <p className="item meta">Next available: {d.nextAvailable}</p>
        <div className="actions-row">
          <Link to={`/appointments?doctorId=${encodeURIComponent(d.id)}`} className="btn">{t('doctors.schedule')}</Link>
          <Link to={`/consult/demo`} className="btn secondary">{t('doctors.startVideo')}</Link>
        </div>
        <div style={{ marginTop: '0.75rem' }}>
          <p className="help">Payment methods</p>
          <PaymentOptions doctorId={d.id} doctorName={d.name} />
        </div>
      </div>
      <div className="page actions">
        <Link to="/doctors" className="btn secondary">{t('doctors.backToList')}</Link>
      </div>
    </section>
  )
}