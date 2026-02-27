import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import LoginPage             from './pages/LoginPage';
import DashboardPage         from './pages/Dashboardpage';
import LandingPage           from './pages/LandingPage';
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
import { initializeTheme } from './hooks/useTheme';

const getDashboardPath = (role) => {
  if (role === 'admin') return '/admin';
  if (role === 'provider') return '/provider';
  return '/dashboard';
};

const getAuthenticatedRedirectPath = () => {
  if (!authService.isAuthenticated()) return '/';
  return getDashboardPath(authService.getUser()?.role);
};

function App() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <SavedServicesProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route
            path="/"
            element={
              authService.isAuthenticated() ? (
                <Navigate to={getAuthenticatedRedirectPath()} replace />
              ) : (
                <LandingPage />
              )
            }
          />
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
                <Navigate to={getAuthenticatedRedirectPath()} replace />
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
