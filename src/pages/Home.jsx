import { useEffect, useMemo, useState } from 'react'

export default function Home() {
  const [roleTab, setRoleTab] = useState('patient')
  const [stats, setStats] = useState({ doctors: 0, patients: 0, consults: 0 })
  const [openFaq, setOpenFaq] = useState(null)

  // Animated counters
  useEffect(() => {
    const targets = { doctors: 120, patients: 2400, consults: 8200 }
    const duration = 800
    const start = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration)
      setStats({
        doctors: Math.floor(targets.doctors * p),
        patients: Math.floor(targets.patients * p),
        consults: Math.floor(targets.consults * p),
      })
      if (p < 1) requestAnimationFrame(tick)
    }
    const raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  const demoRoom = useMemo(() => `demo-${Math.random().toString(36).slice(2, 7)}`, [])

  return (
    <section className="page">
      <section className="hero" aria-label="Intro">
        <div className="hero-content">
          <h1 className="gradient-text">Care that feels close, anywhere</h1>
          <p>Digitally connect doctors and patients with a focus on rural and remote accessibility.</p>
          <div className="hero-actions">
            <a className="btn" href="/appointments">Get Started</a>
            <a className="btn secondary" href="/consultations">See Features</a>
          </div>
        </div>
      </section>

      <div className="tabs" role="tablist" aria-label="Audience" style={{ gap: '0.5rem' }}>
        <button
          className={`tab ${roleTab === 'patient' ? 'active' : ''}`}
          role="tab"
          aria-selected={roleTab === 'patient'}
          onClick={() => setRoleTab('patient')}
        >Patients</button>
        <button
          className={`tab ${roleTab === 'doctor' ? 'active' : ''}`}
          role="tab"
          aria-selected={roleTab === 'doctor'}
          onClick={() => setRoleTab('doctor')}
        >Doctors</button>
      </div>

      <div className="grid" style={{ marginTop: '1rem' }}>
        {roleTab === 'patient' ? (
          <>
            <div className="card">
              <div className="feature-icon">📅</div>
              <h3>Easy Scheduling</h3>
              <p>Find availability and book visits with a few taps.</p>
            </div>
            <div className="card">
              <div className="feature-icon">🎥</div>
              <h3>Video Consultations</h3>
              <p>Connect with doctors from home using secure calls.</p>
            </div>
            <div className="card">
              <div className="feature-icon">💊</div>
              <h3>Prescription History</h3>
              <p>Access prescriptions anytime and track refills.</p>
            </div>
          </>
        ) : (
          <>
            <div className="card">
              <div className="feature-icon">📋</div>
              <h3>Appointment Management</h3>
              <p>Organize bookings and streamline your daily schedule.</p>
            </div>
            <div className="card">
              <div className="feature-icon">🛠️</div>
              <h3>Consultation Tools</h3>
              <p>Reliable video, mute/camera controls, and quick invites.</p>
            </div>
            <div className="card">
              <div className="feature-icon">🧑‍⚕️</div>
              <h3>Patient Records</h3>
              <p>Review patient history with secure access controls.</p>
            </div>
          </>
        )}
      </div>

      <div className="stats">
        <div className="stat">
          <div className="num">{stats.doctors.toLocaleString()}</div>
          <div className="label">Trusted Doctors</div>
        </div>
        <div className="stat">
          <div className="num">{stats.patients.toLocaleString()}</div>
          <div className="label">Active Patients</div>
        </div>
        <div className="stat">
          <div className="num">{stats.consults.toLocaleString()}</div>
          <div className="label">Consultations Completed</div>
        </div>
      </div>

      <div className="actions" style={{ marginTop: '1rem' }}>
        <a className="btn" href="/appointments">Book Appointment</a>
        <a className="btn secondary" href="/consultations">Consultations</a>
        <a className="btn" href={`/consult/${demoRoom}`}>Start Demo Video Call</a>
      </div>

      <div className="accordion">
        {[
          { q: 'Are video consultations secure?', a: 'Yes. Calls use WebRTC with STUN and room-based signaling.' },
          { q: 'Can I reschedule my appointment?', a: 'Absolutely. You can reschedule or cancel directly in Appointments.' },
          { q: 'Do I need special software?', a: 'No. A modern browser is enough to join and host calls.' },
        ].map((item, idx) => (
          <div key={idx} className="accordion-item">
            <div
              className="accordion-header"
              role="button"
              aria-expanded={openFaq === idx}
              onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
            >
              <span>{item.q}</span>
              <span style={{ color: 'var(--muted)' }}>{openFaq === idx ? '−' : '+'}</span>
            </div>
            {openFaq === idx && (
              <div className="accordion-body">{item.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}