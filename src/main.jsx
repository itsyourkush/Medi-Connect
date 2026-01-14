import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import './index.css'
import App from './App.jsx'
import { NotificationsProvider } from './context/NotificationsContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { I18nProvider } from './context/I18nContext.jsx'

const clerkKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

function Root() {
  if (!clerkKey) {
    return (
      <StrictMode>
        <BrowserRouter>
          <I18nProvider>
            <NotificationsProvider>
              <AuthProvider>
                <App />
              </AuthProvider>
            </NotificationsProvider>
          </I18nProvider>
        </BrowserRouter>
      </StrictMode>
    )
  }
  return (
    <StrictMode>
      <ClerkProvider publishableKey={clerkKey}>
        <BrowserRouter>
          <I18nProvider>
            <NotificationsProvider>
              <App />
            </NotificationsProvider>
          </I18nProvider>
        </BrowserRouter>
      </ClerkProvider>
    </StrictMode>
  )
}

createRoot(document.getElementById('root')).render(<Root />)
