import { hasClerk } from '../config/auth.js'
import { useAuth as useClerkAuth, useUser as useClerkUser } from '@clerk/clerk-react'
import { useAuth as useLocalAuth } from '../context/AuthContext.jsx'

export function useCurrentUser() {
  if (hasClerk) {
    const { isSignedIn } = useClerkAuth()
    const { user } = useClerkUser()
    const normalized = user
      ? {
          id: user.id,
          fullName: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          role: user.publicMetadata?.role,
        }
      : null
    return { isSignedIn, user: normalized }
  }
  const { user } = useLocalAuth()
  return { isSignedIn: !!user, user }
}