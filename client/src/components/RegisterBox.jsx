import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    // Simulate network delay — replace with real API call
    await new Promise((res) => setTimeout(res, 1200));
    setLoading(false);

    // On success, navigate to login (or wherever)
    navigate('/login');
  };

  /* ── Eye icon helpers ── */
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

  return (
    <div className="login-split">
      {/* ── Left decorative panel ── */}
      <div className="login-split__left">
        <div className="login-split__left-content">
          <div className="login-split__brand">
            <div className="login-split__brand-icon">S</div>
            <span>Servify</span>
          </div>
          <h2 className="login-split__tagline">
            Join thousands who trust Servify every day.
          </h2>
          <p className="login-split__desc">
            Create your free account and get instant access to verified professionals ready to help you anytime, anywhere.
          </p>
          <div className="login-split__features">
            {[
              'Free to join — no hidden fees',
              'Browse 3,200+ verified providers',
              'Secure bookings & payments',
            ].map((f) => (
              <div key={f} className="login-split__feature">
                <div className="login-split__feature-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="login-split__left-blob" />
        <div className="login-split__left-blob-2" />
      </div>

      {/* ── Right form panel ── */}
      <div className="login-split__right">
        <div className="login-card" style={{ maxWidth: 500 }}>
          <div className="login-card__header">
            <div className="login-card__logo-icon">S</div>
            <h1 className="login-card__title">Create an account</h1>
            <p className="login-card__subtitle">It's free and only takes a minute</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="fullName">Full name</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                <input
                  id="fullName" name="fullName" type="text"
                  className="login-form__input"
                  placeholder="Juan dela Cruz"
                  value={formData.fullName}
                  onChange={handleChange}
                  required autoComplete="name"
                />
              </div>
            </div>

            {/* Email */}
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="email">Email address</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                <input
                  id="email" name="email" type="email"
                  className="login-form__input"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required autoComplete="email"
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="phone">
                Phone number
                <span style={{ fontWeight: 400, color: 'var(--text-muted)', marginLeft: 6, fontSize: '0.8rem' }}>(optional)</span>
              </label>
              <div className="login-form__input-wrapper">
                <span className="login-form__input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.91a16 16 0 0 0 6.07 6.07l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                <input
                  id="phone" name="phone" type="tel"
                  className="login-form__input"
                  placeholder="+63 900 000 0000"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="password">Password</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password" name="password"
                  type={showPassword ? 'text' : 'password'}
                  className="login-form__input"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  required autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-form__toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>

              {/* Strength bar */}
              {formData.password && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                    {[1,2,3,4,5].map((i) => (
                      <div key={i} style={{
                        flex: 1,
                        height: 4,
                        borderRadius: 99,
                        background: i <= passwordStrength ? strengthColor : 'var(--border)',
                        transition: 'background 0.3s',
                      }} />
                    ))}
                  </div>
                  <span style={{ fontSize: '0.78rem', color: strengthColor, fontWeight: 600 }}>
                    {strengthLabel}
                  </span>
                </div>
              )}

              {/* Requirements checklist */}
              {(passwordFocused || formData.password) && (
                <div className="register-requirements">
                  {PASSWORD_RULES.map((rule) => {
                    const passed = rule.test(formData.password);
                    return (
                      <span key={rule.id} className={`register-req-item ${passed ? 'passed' : ''}`}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          {passed
                            ? <polyline points="20 6 9 17 4 12" />
                            : <circle cx="12" cy="12" r="10" />}
                        </svg>
                        {rule.label}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="confirmPassword">Confirm password</label>
              <div className="login-form__input-wrapper">
                <span className="login-form__input-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </span>
                <input
                  id="confirmPassword" name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className={`login-form__input ${
                    formData.confirmPassword
                      ? formData.password === formData.confirmPassword
                        ? 'input--valid'
                        : 'input--invalid'
                      : ''
                  }`}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required autoComplete="new-password"
                />
                <button
                  type="button"
                  className="login-form__toggle-pw"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirm ? <EyeOff /> : <EyeOpen />}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <span style={{ fontSize: '0.78rem', color: '#ef4444', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  Passwords do not match
                </span>
              )}
              {formData.confirmPassword && formData.password === formData.confirmPassword && (
                <span style={{ fontSize: '0.78rem', color: '#22c55e', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Passwords match
                </span>
              )}
            </div>

            {error && (
              <div className="login-form__error">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={`login-form__submit ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? <span className="login-form__spinner" /> : 'Create Account'}
            </button>
          </form>

          <div className="login-card__divider"><span>or sign up with</span></div>

          <div className="login-card__socials">
            <button className="login-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Google
            </button>
            <button className="login-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </button>
          </div>

          <p className="login-card__register">
            Already have an account?{' '}
            <a href="/login">Sign in</a>
          </p>

          <div className="login-card__trust">
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
              Verified Providers
            </span>
            <span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              Secure Payments
            </span>
            <span>
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
