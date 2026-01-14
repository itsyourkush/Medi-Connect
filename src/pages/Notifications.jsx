import { useState } from 'react'
import { useNotifications } from '../context/NotificationsContext.jsx'
import Modal from '../components/Modal.jsx'

export default function NotificationsPage() {
  const { notifications, remove, clear } = useNotifications()
  const [confirmOpen, setConfirmOpen] = useState(false)
  return (
    <section className="page">
      <h2>Notifications</h2>
      <div className="actions-row">
        <button className="btn secondary" onClick={() => setConfirmOpen(true)}>Clear All</button>
      </div>
      <div className="list">
        {notifications.map((n) => (
          <article key={n.id} className={`item ${n.type}`}>
            <div className="meta">{new Date(n.createdAt).toLocaleString()}</div>
            <p>{n.message}</p>
            <button className="btn small" onClick={() => remove(n.id)}>Dismiss</button>
          </article>
        ))}
        {notifications.length === 0 && <p>No notifications.</p>}
      </div>
      <Modal open={confirmOpen} title="Clear all notifications" onClose={() => setConfirmOpen(false)}>
        <p>This will remove all notifications. Are you sure?</p>
        <div className="actions-row">
          <button className="btn" onClick={() => { clear(); setConfirmOpen(false) }}>Yes, clear</button>
          <button className="btn secondary" onClick={() => setConfirmOpen(false)}>Cancel</button>
        </div>
      </Modal>
    </section>
  )
}