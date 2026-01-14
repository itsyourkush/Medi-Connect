import { useNotifications } from '../context/NotificationsContext.jsx'

export default function ToastStack() {
  const { notifications, remove } = useNotifications()
  if (!notifications.length) return null
  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {notifications.map((n) => (
        <div key={n.id} className={`toast ${n.type}`} role="status">
          <div className="toast-content">
            <p>{n.message}</p>
            <small className="meta">{new Date(n.createdAt).toLocaleTimeString()}</small>
          </div>
          <button className="btn small secondary" onClick={() => remove(n.id)} aria-label="Dismiss">×</button>
        </div>
      ))}
    </div>
  )
}