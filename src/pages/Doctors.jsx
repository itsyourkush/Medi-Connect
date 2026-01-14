import { Link, useLocation } from 'react-router-dom'
import { useI18n } from '../context/I18nContext.jsx'
import { doctors as allDoctors } from '../data/doctors.js'

export default function Doctors() {
  const { search } = useLocation()
  const params = new URLSearchParams(search)
  const filter = params.get('specialty')
  const doctors = filter ? allDoctors.filter(d => d.specialty.toLowerCase() === filter.toLowerCase()) : allDoctors
  const { t } = useI18n()

  return (
    <section className="page">
      <h2>{t('doctors.title')}</h2>
      {filter ? <p className="help">{t('doctors.filterBy')}: {filter}</p> : <p className="help">{t('doctors.browse')}</p>}
      <div className="grid">
        {doctors.map((d) => (
          <article className="card" key={d.id}>
            <div className="feature-icon">👩‍⚕️</div>
            <h3 style={{ margin: '0 0 0.25rem' }}>{d.name}</h3>
            <p className="item meta" style={{ margin: 0 }}>{d.specialty} • {d.experience} yrs • ⭐ {d.rating}</p>
            <p style={{ margin: '0.5rem 0', color: 'var(--muted)' }}>{d.bio}</p>
            <p className="item meta">Next available: {d.nextAvailable}</p>
            <div className="actions-row">
              <Link to={`/doctor/${d.id}`} className="btn">{t('doctors.viewProfile')}</Link>
              <Link to={`/appointments?doctorId=${encodeURIComponent(d.id)}`} className="btn secondary">{t('doctors.book')}</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}