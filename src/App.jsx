import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsContext'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import WhatsAppButton from './components/layout/WhatsAppButton'
import Home from './pages/Home'
import Forms from './pages/Forms'
import Candidates from './pages/Candidates'
import Academy from './pages/Academy'
import Payments from './pages/Payments'
import Admin from './pages/Admin'
import Login from './pages/Login'
import Register from './pages/Register'
import Membership from './pages/Membership'
import './index.css'

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}

function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/formularios" element={<Forms />} />
              <Route path="/postulantes" element={<Candidates />} />
              <Route path="/academia" element={<Academy />} />
              <Route path="/pagos" element={<Payments />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registro" element={<Register />} />
              <Route path="/membresia" element={<Membership />} />
            </Route>
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SettingsProvider>
  </AuthProvider>
  )
}

export default App
