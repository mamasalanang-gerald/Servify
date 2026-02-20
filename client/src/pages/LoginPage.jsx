<<<<<<< Updated upstream
import React from 'react';
import Navbar from '../components/Navbar';
import LoginBox from '../components/LoginBox';
import './styles/login.css';

const LoginPage = () => {
  return (
    <div className="login-page">
      <Navbar />
      <main className="login-main">
        <LoginBox />
      </main>
    </div>
  );
};

export default LoginPage;
=======
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./LoginPage.css";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1200);
  };

  return (
    <div className="login-page">
      <Navbar />
      <div className="login-split">
        {/* Left Panel */}
        <div className="login-split__left">
          <div className="login-split__left-blob" />
          <div className="login-split__left-blob-2" />
          <div className="login-split__left-content">
            <div className="login-split__brand">
              <div className="login-split__brand-icon">S</div>
              Servify
            </div>
            <h2 className="login-split__tagline">Your trusted service marketplace</h2>
            <p className="login-split__desc">
              Connect with verified professionals for home services, repairs, beauty, tutoring, and more.
            </p>
            <div className="login-split__features">
              {["Verified Providers", "Secure Payments", "24/7 Support", "Money-back Guarantee"].map((f) => (
                <div key={f} className="login-split__feature">
                  <div className="login-split__feature-icon">✓</div>
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-split__right">
          <div className="login-card">
            <div className="login-card__header">
              <div className="login-card__logo-icon">S</div>
              <h1 className="login-card__title">Welcome back</h1>
              <p className="login-card__subtitle">Sign in to your Servify account</p>
            </div>

            <form className="login-form" onSubmit={handleSubmit}>
              <div className="login-form__group">
                <label className="login-form__label">Email</label>
                <div className="login-form__input-wrapper">
                  <span className="login-form__input-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </span>
                  <input
                    type="email"
                    className="login-form__input"
                    placeholder="you@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="login-form__group">
                <div className="login-form__label-row">
                  <label className="login-form__label">Password</label>
                  <a href="#" className="login-form__forgot">Forgot password?</a>
                </div>
                <div className="login-form__input-wrapper">
                  <span className="login-form__input-icon">
                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0110 0v4"/>
                    </svg>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="login-form__input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="login-form__toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <button type="submit" className="login-form__submit" disabled={loading}>
                {loading ? <span className="login-form__spinner" /> : "Sign In"}
              </button>
            </form>

            <div className="login-card__divider">or continue with</div>
            <div className="login-card__socials">
              <button className="login-social-btn">🌐 Google</button>
              <button className="login-social-btn">🍎 Apple</button>
            </div>

            <p className="login-card__register">
              Don't have an account? <a href="#">Sign up free</a>
            </p>

            <div className="login-card__trust">
              <span>🔒 SSL encrypted & secure</span>
              <span>🛡️ Your data is never sold</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
>>>>>>> Stashed changes
