import { useNavigate } from 'react-router-dom';

/**
 * useLogout
 * Clears localStorage directly and navigates to /login.
 * Kept simple — no hook dependency chain that can break.
 */
const useLogout = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
    navigate('/login', { replace: true });
  };

  return logout;
};

export default useLogout;