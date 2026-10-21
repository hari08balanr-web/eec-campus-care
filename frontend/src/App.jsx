import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ThemeSelector from './components/ThemeSelector'

import LandingPage from './pages/LandingPage'
import StudentDashboard from './pages/StudentDashboard'
import NewComplaint from './pages/NewComplaint'
import MyComplaints from './pages/MyComplaints'
import TrackComplaint from './pages/TrackComplaint'
import AboutPage from './pages/AboutPage'
import DepartmentsPage from './pages/DepartmentsPage'
import FacilitiesPage from './pages/FacilitiesPage'
import ContactPage from './pages/ContactPage'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminComplaints from './pages/AdminComplaints'
import AdminComplaintDetail from './pages/AdminComplaintDetail'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg text-text transition-colors duration-300 relative">
      <Navbar />
      <main className="flex-grow pt-20 pb-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/track" element={<TrackComplaint />} />
          <Route path="/track/:ticketCode" element={<TrackComplaint />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/new-complaint" element={
            <ProtectedRoute>
              <NewComplaint />
            </ProtectedRoute>
          } />
          <Route path="/my-complaints" element={
            <ProtectedRoute>
              <MyComplaints />
            </ProtectedRoute>
          } />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/complaints" element={
            <ProtectedRoute adminOnly={true}>
              <AdminComplaints />
            </ProtectedRoute>
          } />
          <Route path="/admin/complaints/:id" element={
            <ProtectedRoute adminOnly={true}>
              <AdminComplaintDetail />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
      <ThemeSelector />
    </div>
  )
}

export default App
