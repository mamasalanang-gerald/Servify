import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage             from './pages/LoginPage';
import DashboardPage         from './pages/DashboardPage';
import ServicesPage          from './pages/ServicesPage';
import LandingPage           from './pages/LandingPage';
import SavedServices         from './components/SavedServices';
import ProfileSettings       from './components/ProfileSettings';
import AccountSettings       from './components/AccountSettings';
import ViewService           from './components/ViewService';
import ProviderDashboardPage from './pages/ProviderDashboardPage';
import AdminDashboardPage    from './pages/AdminDashboardPage';
import useAuth               from './hooks/useAuth';
import useRole               from './hooks/useRole';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { isLoggedIn } = useAuth();
  const { hasRole, homeRoute } = useRole();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (requiredRole && !hasRole(requiredRole)) return <Navigate to={homeRoute} replace />;

  return children;
};
// ────────────────────────────────────────────────────────────────────

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/services" element={<ServicesPage />} />

        {/* User-only */}
        <Route path="/dashboard" element={
          <ProtectedRoute requiredRole="user"><DashboardPage /></ProtectedRoute>
        } />
        <Route path="/SavedServices" element={
          <ProtectedRoute requiredRole="user"><SavedServices /></ProtectedRoute>
        } />
        <Route path="/ProfileSettings" element={
          <ProtectedRoute requiredRole="user"><ProfileSettings /></ProtectedRoute>
        } />
        <Route path="/AccountSettings" element={
          <ProtectedRoute requiredRole="user"><AccountSettings /></ProtectedRoute>
        } />

        {/* Provider-only */}
        <Route path="/provider" element={
          <ProtectedRoute requiredRole="provider"><ProviderDashboardPage /></ProtectedRoute>
        } />

        {/* Admin-only */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin"><AdminDashboardPage /></ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;