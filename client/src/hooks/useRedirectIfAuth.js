import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './useAuth';
import useRole from './useRole';

/**
 * useRedirectIfAuth
 * ─────────────────────────────────────────────
 * Use this on pages that logged-in users should
 * NOT see — like /login, /signup, or /.
 *
 * If a session exists, the user is immediately
 * redirected to their role's home dashboard.
 *
 * Usage (in LoginPage or LandingPage):
 *   useRedirectIfAuth();
 *
 * Optional — skip redirect for landing page:
 *   useRedirectIfAuth({ skip: true })
 * ─────────────────────────────────────────────
 */
const useRedirectIfAuth = ({ skip = false } = {}) => {
  const navigate          = useNavigate();
  const { isLoggedIn }    = useAuth();
  const { homeRoute }     = useRole();

  useEffect(() => {
    if (skip) return;
    if (isLoggedIn) {
      navigate(homeRoute, { replace: true });
    }
  }, [isLoggedIn, homeRoute, navigate, skip]);
};

export default useRedirectIfAuth;