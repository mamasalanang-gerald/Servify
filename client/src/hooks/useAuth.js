/**
 * useAuth
 * Single source of truth for auth session.
 * Reads/writes directly to localStorage.
 */
const useAuth = () => {
  const getUser = () => {
    const role = localStorage.getItem('servify_role');
    const email = localStorage.getItem('servify_email');
    const id = localStorage.getItem('servify_user_id');
    const full_name = localStorage.getItem('servify_full_name');
    const profile_image = localStorage.getItem('servify_profile_image');
    
    if (!role) return null;
    
    return { 
      role, 
      email, 
      id: id || null, // ID is a UUID string, not an integer
      full_name,
      profile_image: profile_image || null,
    };
  };

  const setUser = ({ role, email, accessToken, id, full_name, profile_image }) => {
    localStorage.setItem('servify_role', role);
    localStorage.setItem('servify_email', email);
    if (id) {
      localStorage.setItem('servify_user_id', id.toString());
    }
    if (full_name) {
      localStorage.setItem('servify_full_name', full_name);
    }
    if (accessToken) {
      localStorage.setItem('servify_token', accessToken);
    }
    if (profile_image) {
      localStorage.setItem('servify_profile_image', profile_image);
    }
  };

  const updateUserRole = (role) => {
    localStorage.setItem('servify_role', role);
  };

  const getToken = () => {
    return localStorage.getItem('servify_token');
  };

  const clearUser = () => {
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
    localStorage.removeItem('servify_token');
    localStorage.removeItem('servify_user_id');
    localStorage.removeItem('servify_full_name');
    localStorage.removeItem('servify_profile_image');
  };

  const user = getUser();
  const isLoggedIn = !!user;

  return { user, isLoggedIn, setUser, updateUserRole, clearUser, getToken };
};

export default useAuth;