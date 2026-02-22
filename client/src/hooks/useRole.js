import useAuth from './useAuth';

const ROLE_HOME = {
  user:     '/dashboard',
  provider: '/provider',
  admin:    '/admin',
};

const useRole = () => {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return {
    role,
    isUser:     role === 'user',
    isProvider: role === 'provider',
    isAdmin:    role === 'admin',
    hasRole:    (r) => role === r,
    homeRoute:  ROLE_HOME[role] ?? '/login',
  };
};

export default useRole;