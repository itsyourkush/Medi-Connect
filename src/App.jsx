import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Doctors from './pages/Doctors.jsx'
import DoctorProfile from './pages/DoctorProfile.jsx'
import SymptomChecker from './pages/SymptomChecker.jsx'
import { SignIn, SignUp, SignedIn } from '@clerk/clerk-react'
import Dashboard from './pages/Dashboard.jsx'
import MedicalRecords from './pages/MedicalRecords.jsx'
import Appointments from './pages/Appointments.jsx'
import Consultations from './pages/Consultations.jsx'
import VideoConsultations from './pages/VideoConsultations.jsx'
import Prescriptions from './pages/Prescriptions.jsx'
import NotificationsPage from './pages/Notifications.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import SelectRole from './pages/SelectRole.jsx'
import { hasClerk } from './config/auth.js'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import DoctorDashboard from './pages/DoctorDashboard.jsx'
import DoctorPatientRecords from './pages/DoctorPatientRecords.jsx'
import './App.css'
import ToastStack from './components/ToastStack.jsx'
import Chatbot from './components/Chatbot.jsx'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          {hasClerk ? (
            <>
              <Route path="/sign-in" element={<SignIn routing="path" path="/sign-in" />} />
              <Route path="/sign-up" element={<SignUp routing="path" path="/sign-up" />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/select-role" element={<SignedIn><SelectRole /></SignedIn>} />
              <Route path="/records" element={<ProtectedRoute allowRoles={["patient","doctor"]}><MedicalRecords /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Appointments /></ProtectedRoute>} />
              <Route path="/doctors" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Doctors /></ProtectedRoute>} />
              <Route path="/doctor/:id" element={<ProtectedRoute allowRoles={["patient","doctor"]}><DoctorProfile /></ProtectedRoute>} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/consultations" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Consultations /></ProtectedRoute>} />
              <Route path="/consult/:id" element={<ProtectedRoute allowRoles={["patient","doctor"]}><VideoConsultations /></ProtectedRoute>} />
              <Route path="/prescriptions" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Prescriptions /></ProtectedRoute>} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/select-role" element={<SelectRole />} />
              <Route path="/records" element={<ProtectedRoute allowRoles={["patient","doctor"]}><MedicalRecords /></ProtectedRoute>} />
              <Route path="/appointments" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Appointments /></ProtectedRoute>} />
              <Route path="/doctors" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Doctors /></ProtectedRoute>} />
              <Route path="/doctor/:id" element={<ProtectedRoute allowRoles={["patient","doctor"]}><DoctorProfile /></ProtectedRoute>} />
              <Route path="/symptom-checker" element={<SymptomChecker />} />
              <Route path="/consultations" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Consultations /></ProtectedRoute>} />
              <Route path="/consult/:id" element={<ProtectedRoute allowRoles={["patient","doctor"]}><VideoConsultations /></ProtectedRoute>} />
              <Route path="/prescriptions" element={<ProtectedRoute allowRoles={["patient","doctor"]}><Prescriptions /></ProtectedRoute>} />
            </>
          )}
          <Route path="/doctor" element={<ProtectedRoute allowRoles={["doctor"]}><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/records" element={<ProtectedRoute allowRoles={["doctor"]}><DoctorPatientRecords /></ProtectedRoute>} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Routes>
      </main>
      <ToastStack />
      <Chatbot />
    </div>
  )
}

export default App
