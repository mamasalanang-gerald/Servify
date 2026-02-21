import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/Dashboardpage'
import ServicesPage from './pages/ServicesPage'
import LandingPage from './pages/LandingPage'
import SavedServices from './components/SavedServices'
import ProfileSettings from './components/ProfileSettings'
import AccountSettings from './components/AccountSettings'
import ViewService from './components/ViewService'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/SavedServices" element={<SavedServices />} />
        <Route path="/ProfileSettings" element={<ProfileSettings />} />
        <Route path="/AccountSettings" element={<AccountSettings />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App