import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import useRedirectIfAuth from '../hooks/useRedirectIfAuth';
import { Input } from './ui/input';
import { Button } from './ui/button';

const ROLE_HOME = {
  user:     '/dashboard',
  client:   '/dashboard',
  provider: '/provider',
  admin:    '/admin',
};

const LoginBox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useRedirectIfAuth();

  const [formData, setFormData]         = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Attempting login with:', formData.email);
      const data = await authService.login(formData);
      console.log('Login response:', data);
      console.log('User type:', data.user.user_type);
      const role = data.user.user_type;
      const isClientRole = role === 'client' || role === 'user';

      const redirectState = location.state || {};
      const shouldOpenClientServices =
        isClientRole &&
        redirectState.redirectAfterLogin === '/dashboard' &&
        redirectState.initialNav === 'Services';

      const destination = ROLE_HOME[role] || '/dashboard';
      console.log('Navigating to:', destination);
      setLoading(false);
      navigate(
        destination,
        shouldOpenClientServices
          ? {
              replace: true,
              state: {
                initialNav: 'Services',
                initialCategory: redirectState.initialCategory || null,
                initialSearchQuery: redirectState.initialSearchQuery || '',
                source: redirectState.source || 'login-redirect',
              },
            }
          : { replace: true },
      );
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-70px)]">
      {/* Left decorative panel */}
      <div className="w-[45%] bg-gradient-to-br from-[#1a3a8f] via-[#2b52cc] to-[#4f70e0] dark:from-[#0f1e5c] dark:via-[#1a2fa8] dark:to-[#2a3fd4] flex items-center justify-center p-[60px_52px] relative overflow-hidden flex-shrink-0 max-[900px]:w-full max-[900px]:min-h-auto max-[900px]:p-[40px_32px] max-[600px]:hidden">
        <div className="absolute w-[400px] h-[400px] bg-white/[0.06] dark:bg-white/[0.04] rounded-full -top-[120px] -right-[120px]" />
        <div className="absolute w-[300px] h-[300px] bg-white/[0.05] dark:bg-white/[0.03] rounded-full -bottom-[80px] -left-[60px]" />
        
        <div className="relative z-[1] text-white max-w-[380px]">
          <div className="flex items-center gap-3 mb-12 font-extrabold text-[1.3rem]">
            <div className="w-11 h-11 bg-white/20 dark:bg-white/10 border-2 border-white/30 dark:border-white/20 rounded-xl flex items-center justify-center font-extrabold text-[1.2rem] backdrop-blur-sm">
              S
            </div>
            <span>Servify</span>
          </div>
          <h2 className="text-[1.85rem] max-[900px]:text-[1.4rem] font-bold leading-[1.25] mb-4 tracking-tight">
            Your trusted platform for every service need.
          </h2>
          <p className="text-[0.95rem] text-white/70 leading-[1.7] mb-10">
            Connect with thousands of verified professionals ready to help you anytime, anywhere.
          </p>
          <div className="flex flex-col gap-3.5">
            {[
              '50,000+ satisfied customers',
              '3,200+ verified providers',
              'Secure & instant payments',
            ].map((f) => (
              <div key={f} className="flex items-center gap-3 text-[0.9rem] text-white/85 font-medium">
                <div className="w-7 h-7 bg-white/[0.18] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-[40px_32px] max-[900px]:p-[32px_20px] max-[600px]:p-[24px_16px] overflow-y-auto bg-[#f8faff] dark:bg-[#0f172a]">
        <div className="relative z-[2] bg-card dark:bg-[#1e293b] rounded-2xl shadow-[0_20px_60px_rgba(26,58,143,0.15)] p-12 max-[600px]:p-8 w-full max-w-[460px] mx-auto animate-[cardIn_0.6s_cubic-bezier(0.22,1,0.36,1)_both] border border-[rgba(226,232,240,0.6)] dark:border-[#1e293b]">
          <div className="text-center mb-9">
            <div className="w-14 h-14 bg-gradient-to-br from-app-primary to-app-accent text-white rounded-2xl flex items-center justify-center font-extrabold text-2xl mx-auto mb-5 shadow-[0_8px_24px_rgba(26,58,143,0.3)]">
              S
            </div>
            <h1 className="text-[1.75rem] font-bold text-app-text dark:text-[#f1f5f9] mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-[0.9rem] text-app-text-muted dark:text-[#94a3b8] leading-[1.5]">
              Sign in to your Servify account
            </p>
          </div>

          <form className="flex flex-col gap-4.5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.85rem] font-semibold text-app-text dark:text-[#f1f5f9] tracking-[0.01em]" htmlFor="email">
                Email address
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-app-text-muted dark:text-[#94a3b8] flex items-center pointer-events-none transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className="w-full py-3.5 pl-[42px] pr-3.5 border-[1.5px] border-app-border dark:border-[#1e293b] rounded-[10px] bg-[#f8faff] dark:bg-[#0f172a] font-sans text-[0.92rem] text-app-text dark:text-[#f1f5f9] outline-none transition-all placeholder:text-[#94a3b8] focus:border-app-accent focus:bg-white dark:focus:bg-[#1e293b] focus:shadow-[0_0_0_4px_rgba(43,82,204,0.10)]"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[0.85rem] font-semibold text-app-text dark:text-[#f1f5f9] tracking-[0.01em]" htmlFor="password">
                  Password
                </label>
                <a href="/forgot-password" className="text-[0.82rem] text-app-accent font-medium no-underline transition-colors hover:text-app-primary hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-app-text-muted dark:text-[#94a3b8] flex items-center pointer-events-none transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="w-full py-3.5 pl-[42px] pr-[42px] border-[1.5px] border-app-border dark:border-[#1e293b] rounded-[10px] bg-[#f8faff] dark:bg-[#0f172a] font-sans text-[0.92rem] text-app-text dark:text-[#f1f5f9] outline-none transition-all placeholder:text-[#94a3b8] focus:border-app-accent focus:bg-white dark:focus:bg-[#1e293b] focus:shadow-[0_0_0_4px_rgba(43,82,204,0.10)]"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 bg-none border-none cursor-pointer text-app-text-muted dark:text-[#94a3b8] flex items-center p-1 rounded-md transition-all hover:text-app-accent hover:bg-app-accent-light dark:hover:bg-[#1e3a5f]"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-[0.85rem] font-medium">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="mt-1.5 py-3.5 bg-gradient-to-br from-app-primary to-app-accent text-white border-none rounded-[10px] font-sans text-[0.97rem] font-semibold cursor-pointer transition-all flex items-center justify-center min-h-[48px] shadow-[0_4px_16px_rgba(26,58,143,0.28)] tracking-[0.01em] hover:opacity-[0.93] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(26,58,143,0.35)] active:translate-y-0 disabled:opacity-65 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="w-5 h-5 border-[2.5px] border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5.5 text-app-text-muted dark:text-[#94a3b8] text-[0.8rem] font-medium before:content-[''] before:flex-1 before:h-px before:bg-app-border dark:before:bg-[#1e293b] after:content-[''] after:flex-1 after:h-px after:bg-app-border dark:after:bg-[#1e293b]">
            <span>or continue with</span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5 max-[400px]:grid-cols-1">
            <button className="flex items-center justify-center gap-2 py-[11px] px-4 border-[1.5px] border-app-border dark:border-[#1e293b] rounded-[10px] bg-white dark:bg-[#0f172a] font-sans text-[0.88rem] font-semibold text-app-text dark:text-[#f1f5f9] cursor-pointer transition-all hover:bg-app-accent-light dark:hover:bg-[#1e3a5f] hover:border-app-accent hover:-translate-y-0.5 hover:shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-[11px] px-4 border-[1.5px] border-app-border dark:border-[#1e293b] rounded-[10px] bg-white dark:bg-[#0f172a] font-sans text-[0.88rem] font-semibold text-app-text dark:text-[#f1f5f9] cursor-pointer transition-all hover:bg-app-accent-light dark:hover:bg-[#1e3a5f] hover:border-app-accent hover:-translate-y-0.5 hover:shadow-sm">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-[0.875rem] text-app-text-muted dark:text-[#94a3b8] mb-5">
            Don&apos;t have an account?{' '}
            <a href="/signup" className="text-app-accent no-underline font-semibold transition-colors hover:text-app-primary hover:underline">
              Create one free
            </a>
          </p>

          <div className="flex flex-col items-start gap-2.5 pt-4.5 border-t border-app-border dark:border-[#1e293b]">
            <span className="flex items-center gap-1.5 text-[0.76rem] text-app-text-muted dark:text-[#94a3b8] font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-app-accent flex-shrink-0">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Verified Providers
            </span>
            <span className="flex items-center gap-1.5 text-[0.76rem] text-app-text-muted dark:text-[#94a3b8] font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-app-accent flex-shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Secure Payments
            </span>
            <span className="flex items-center gap-1.5 text-[0.76rem] text-app-text-muted dark:text-[#94a3b8] font-medium">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-app-accent flex-shrink-0">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginBox;
