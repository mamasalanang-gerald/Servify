import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { cn } from '../lib/utils';

// Eye icon components
const EyeOpen = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOff = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

// Password validation rules
const PASSWORD_RULES = [
  { id: 'length',  label: 'At least 8 characters',       test: (pw) => pw.length >= 8 },
  { id: 'upper',   label: 'One uppercase letter',         test: (pw) => /[A-Z]/.test(pw) },
  { id: 'lower',   label: 'One lowercase letter',         test: (pw) => /[a-z]/.test(pw) },
  { id: 'number',  label: 'One number',                   test: (pw) => /[0-9]/.test(pw) },
  { id: 'special', label: 'One special character (!@#…)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const RegisterBox = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword]        = useState(false);
  const [showConfirm, setShowConfirm]          = useState(false);
  const [loading, setLoading]                  = useState(false);
  const [error, setError]                      = useState('');
  const [passwordFocused, setPasswordFocused]  = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const passwordStrength = PASSWORD_RULES.filter((r) => r.test(formData.password)).length;

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][passwordStrength] || '';
  const strengthColor = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'][passwordStrength] || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password rules
    const failed = PASSWORD_RULES.find((r) => !r.test(formData.password));
    if (failed) {
      setError(`Password must include: ${failed.label.toLowerCase()}.`);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      await authService.register(formData);
      setLoading(false);
      navigate('/login');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ── Left decorative panel (from LoginBox design) ── */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-[#1a3a8f] via-[#2b52cc] to-[#4f70e0] dark:from-[#0f1e5c] dark:via-[#1a2fa8] dark:to-[#2a3fd4] lg:flex lg:items-center lg:justify-center lg:p-[60px_52px]">
        <div className="absolute w-[400px] h-[400px] bg-white/[0.06] dark:bg-white/[0.04] rounded-full -top-[120px] -right-[120px]" />
        <div className="absolute w-[300px] h-[300px] bg-white/[0.05] dark:bg-white/[0.03] rounded-full -bottom-[80px] -left-[60px]" />
        
        <div className="relative z-10 text-white max-w-[380px]">
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

      {/* ── Right form panel (ORIGINAL - UNCHANGED) ── */}
      <div className="flex items-center justify-center bg-background p-6 sm:p-8">
        <div className="w-full max-w-[500px]">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl text-2xl font-bold text-white shadow-[0_8px_24px_rgba(26,58,143,0.3)]" style={{
              background: 'linear-gradient(to bottom right, #1a3a8f, #2b52cc, #4f70e0)'
            }}>
              S
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground">Create an account</h1>
            <p className="text-sm text-muted-foreground">It's free and only takes a minute</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="fullName">Full name</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <Input
                  id="fullName" name="fullName" type="text"
                  className="pl-10"
                  placeholder="Juan dela Cruz"
                  value={formData.fullName}
                  onChange={handleChange}
                  required autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="email">Email address</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <Input
                  id="email" name="email" type="email"
                  className="pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required autoComplete="email"
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="phone">
                Phone number
                <span className="ml-1.5 text-xs font-normal text-muted-foreground">(optional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <Input
                  id="phone" name="phone" type="tel"
                  className="pl-10"
                  placeholder="+63 900 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="password">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <Input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="pl-10 pr-10"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {/* Strength bar */}
              {formData.password && (
                <div className="mt-2">
                  <div className="mb-1.5 flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        i <= passwordStrength ? "" : "bg-border"
                      )} style={{
                        backgroundColor: i <= passwordStrength ? strengthColor : undefined
                      }} />
                    ))}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </span>
                </div>
              )}

              {/* Requirements checklist — FIXED: bg-background + text-foreground for visibility */}
              {(passwordFocused || formData.password) && (
                <div className="mt-2.5 animate-in fade-in slide-in-from-top-2 duration-200 grid grid-cols-2 gap-x-3 gap-y-1.5 rounded-md border border-border bg-background p-3 shadow-sm">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <span key={rule.id} className={cn(
                        "flex items-center gap-1.5 text-xs font-medium transition-colors",
                        passed ? "text-green-600 dark:text-green-400" : "text-foreground"
                      )}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="flex-shrink-0">
                          {passed ? (
                            <polyline points="20 6 9 17 4 12" />
                          ) : (
                            <>
                              <circle cx="12" cy="12" r="10" />
                              <line x1="9" y1="9" x2="15" y2="15" />
                              <line x1="15" y1="9" x2="9" y2="15" />
                            </>
                          )}
                        </svg>
                        {rule.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground" htmlFor="confirmPassword">Confirm password</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <Input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={cn(
                    "pl-10 pr-10",
                    formData.confirmPassword && (
                      formData.password === formData.confirmPassword
                        ? "border-green-500 focus-visible:ring-green-500/20"
                        : "border-red-500 focus-visible:ring-red-500/20"
                    )
                  )}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Passwords do not match
                </span>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Passwords match
                </span>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-600 dark:border-red-900/30 dark:bg-red-950/20 dark:text-red-400">
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
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-background px-2 text-muted-foreground">or sign up with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" type="button" className="w-full">
              <svg width="18" height="18" viewBox="0 0 24 24" className="mr-2">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
          </div>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <a href="/login" className="font-medium text-primary underline-offset-4 hover:underline">Sign in</a>
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              Verified Providers
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Secure Payments
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              24/7 Support
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterBox;