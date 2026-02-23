/**
 * Protected Route Component
 * Wraps routes that require authentication and role-based access
 */
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

// Role hierarchy for access control
const ROLE_HIERARCHY = {
  admin: 3,
  provider: 2,
  user: 1,
  client: 1, // client is same as user
};

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const user = authService.getUser();
  const isAuthenticated = authService.isAuthenticated();

  // Not authenticated - redirect to login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access if required
  if (requiredRole) {
    const userLevel = ROLE_HIERARCHY[user.role] || 0;
    const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;

    // User doesn't have sufficient role level
    if (userLevel < requiredLevel) {
      // Redirect to appropriate dashboard based on user's role
      const redirectMap = {
        user: '/dashboard',
        client: '/dashboard',
        provider: '/provider',
        admin: '/admin',
      };
      return <Navigate to={redirectMap[user.role] || '/login'} replace />;
    }
  }

  // User is authenticated and has required role - render children
  return children;
};

export default ProtectedRoute;
