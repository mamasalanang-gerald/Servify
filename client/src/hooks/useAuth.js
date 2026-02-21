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

  const setUser = ({ role, email }) => {
    localStorage.setItem('servify_role',  role);
    localStorage.setItem('servify_email', email);
  };

  const clearUser = () => {
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
  };

  const user      = getUser();
  const isLoggedIn = !!user;

  return { user, isLoggedIn, setUser, clearUser };
};

export default useAuth;