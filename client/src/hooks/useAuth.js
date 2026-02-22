/**
 * useAuth
 * Single source of truth for auth session.
 * Reads/writes directly to localStorage.
 */
const useAuth = () => {
  const getUser = () => {
    const role  = localStorage.getItem('servify_role');
    const email = localStorage.getItem('servify_email');
    if (!role) return null;
    return { role, email };
  };

  const setUser = ({ role, email, accessToken }) => {
    localStorage.setItem('servify_role',  role);
    localStorage.setItem('servify_email', email);
    if (accessToken) {
      localStorage.setItem('servify_token', accessToken);
    }
  };

  const getToken = () => {
    return localStorage.getItem('servify_token');
  };

  const clearUser = () => {
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
    localStorage.removeItem('servify_token');
  };

  const user      = getUser();
  const isLoggedIn = !!user;

  return { user, isLoggedIn, setUser, clearUser, getToken };
};

export default useAuth;