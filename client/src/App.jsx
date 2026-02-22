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
import RegisterPage from './pages/RegisterPage';

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
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/provider" element={<ProviderDashboardPage />} />
        <Route path="/signup" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
