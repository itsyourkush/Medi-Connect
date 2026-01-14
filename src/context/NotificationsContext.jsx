import { createContext, useContext, useMemo, useState, useRef } from 'react'

const NotificationsContext = createContext(null)

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const timersRef = useRef(new Map())

  const push = (message, type = 'info', options = {}) => {
    const id = crypto.randomUUID?.() || Math.random().toString(36).slice(2)
    const durations = { success: 4000, info: 5000, error: 7000 }
    const duration = typeof options.duration === 'number' ? options.duration : durations[type] || 5000
    const item = { id, message, type, createdAt: Date.now(), duration }
    setNotifications((prev) => [item, ...prev].slice(0, 50))
    // auto-dismiss after duration
    if (duration && duration > 0) {
      const timer = setTimeout(() => remove(id), duration)
      timersRef.current.set(id, timer)
    }
    return id
  }

  const remove = (id) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      clearTimeout(timer)
      timersRef.current.delete(id)
    }
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }
  const clear = () => setNotifications([])

  const value = useMemo(() => ({ notifications, push, remove, clear }), [notifications])
  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider')
  return ctx
}