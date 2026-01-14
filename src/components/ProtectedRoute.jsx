import { Navigate } from 'react-router-dom'
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react'
import { useAuth as useLocalAuth } from '../context/AuthContext.jsx'
import { hasClerk } from '../config/auth.js'

export default function ProtectedRoute({ children, allowRoles }) {
  if (!hasClerk) {
    const { user } = useLocalAuth()
    if (!user) return <Navigate to="/login" replace />
    const role = user.role
    if (allowRoles && !allowRoles.includes(role)) {
      if (!role) return <Navigate to="/select-role" replace />
      return <Navigate to="/" replace />
    }
    return children
  }
  const { isSignedIn } = useClerkAuth()
  const { user } = useClerkUser()
  if (!isSignedIn) return <Navigate to="/sign-in" replace />
  const role = user?.publicMetadata?.role
  if (allowRoles && !allowRoles.includes(role)) {
    if (!role) return <Navigate to="/select-role" replace />
    return <Navigate to="/" replace />
  }
  return children
}