import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage             from './pages/LoginPage';
import DashboardPage         from './pages/Dashboardpage';
import ServicesPage          from './pages/ServicesPage';
import LandingPage           from './pages/LandingPage';
import SavedServices         from './components/SavedServices';
import ProfileSettings       from './components/ProfileSettings';
import AccountSettings       from './components/AccountSettings';
import ViewService           from './components/ViewService';
import ProviderDashboardPage from './pages/Providerdashboardpage';
import AdminDashboardPage    from './pages/AdminDashboardPage';
import RegisterPage          from './pages/RegisterPage';
import ProtectedRoute        from './components/ProtectedRoute';
import { authService }       from './services/authService';
import BecomeProviderPage from './pages/BecomeProviderPage';
import { SavedServicesProvider } from './contexts/SavedServicesContext';

function App() {
  return (
    <SavedServicesProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          
          <Route
            path="/become-provider"
            element={
              <ProtectedRoute requiredRole="client">
                <BecomeProviderPage />
              </ProtectedRoute>
          }
        />

          {/* Protected routes - User */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="user">
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute requiredRole="user">
                <ServicesPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Provider */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute requiredRole="provider">
                <ProviderDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Protected routes - Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to appropriate dashboard or landing */}
          <Route
            path="*"
            element={
              authService.isAuthenticated() ? (
                <Navigate 
                  to={
                    authService.getUser()?.role === 'admin' 
                      ? '/admin' 
                      : authService.getUser()?.role === 'provider' 
                      ? '/provider' 
                      : '/dashboard'  // client or user goes to dashboard
                  } 
                  replace 
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </SavedServicesProvider>
  );
}

export default App;
