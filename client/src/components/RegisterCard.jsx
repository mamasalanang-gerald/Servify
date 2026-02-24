import React, { useState } from "react";
import "./RegisterCard.css";

const EyeOpen = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const EyeClosed = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none"
    viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round"
      d="M17.94 17.94A10.94 10.94 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M3 3l18 18" />
  </svg>
);

const strengthLevels = { Weak: 1, Medium: 2, Strong: 3, "Very Strong": 4 };

function RegisterCard() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const checkStrength = (value) => {
    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;
    switch (score) {
      case 1: setStrength("Weak"); break;
      case 2: setStrength("Medium"); break;
      case 3: setStrength("Strong"); break;
      case 4: setStrength("Very Strong"); break;
      default: setStrength("");
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    checkStrength(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    alert("Registration Successful!");
  };

  const handleGoogleSignIn = async () => {
    try {
      const { auth, googleProvider } = await import("../../firebase");
      const { signInWithPopup } = await import("firebase/auth");
      const result = await signInWithPopup(auth, googleProvider);
      alert(`Welcome, ${result.user.displayName}! Signed in with Google.`);
    } catch (err) {
      alert("Google sign-in failed. Please set up Firebase first.");
      console.error(err);
    }
  };

  return (
    <div className="register-card">

      <div className="card-header">
        <div className="card-logo">S</div>
        <h2>Create Your Servify Account</h2>
        <p>Join thousands of verified customers and service providers.</p>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="row">
          <div className="input-group">
            <label>First Name</label>
            <input type="text" placeholder="John" required />
          </div>
          <div className="input-group">
            <label>Last Name</label>
            <input type="text" placeholder="Doe" required />
          </div>
        </div>

        <div className="input-group">
          <label>Email Address</label>
          <input type="email" placeholder="you@example.com" required />
        </div>

        <div className="input-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Min. 6 characters"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOpen /> : <EyeClosed />}
            </span>
          </div>
          {strength && (
            <div className="strength-bar-wrapper">
              <div className="strength-bars">
                {[1, 2, 3, 4].slice(0, strengthLevels[strength]).map((lvl) => (
                  <div key={lvl}
                    className={`strength-bar ${strength.replace(" ", "").toLowerCase()}`}
                  />
                ))}
              </div>
              <small className={`strength ${strength.replace(" ", "").toLowerCase()}`}>
                {strength}
              </small>
            </div>
          )}
        </div>

        <div className="input-group">
          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span className="eye-icon" onClick={() => setShowConfirm(!showConfirm)}>
              {showConfirm ? <EyeOpen /> : <EyeClosed />}
            </span>
          </div>
        </div>

        {error && <small className="error">{error}</small>}

        <button type="submit" className="submit-btn">Create Account</button>

        <div className="divider"><span>or continue with</span></div>

        <div className="social-row">
          <button type="button" className="social-btn google-btn" onClick={handleGoogleSignIn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.14 0 5.95 1.08 8.17 2.84l6.08-6.08C34.5 3.1 29.56 1 24 1 14.82 1 7.07 6.48 3.64 14.22l7.08 5.5C12.4 13.67 17.74 9.5 24 9.5z"/>
              <path fill="#34A853" d="M46.1 24.55c0-1.64-.15-3.22-.43-4.75H24v9h12.43c-.54 2.9-2.18 5.36-4.64 7.01l7.19 5.58C43.17 37.07 46.1 31.27 46.1 24.55z"/>
              <path fill="#FBBC05" d="M10.72 28.28A14.6 14.6 0 019.5 24c0-1.49.26-2.93.72-4.28l-7.08-5.5A23.93 23.93 0 001 24c0 3.86.93 7.5 2.57 10.72l7.15-6.44z"/>
              <path fill="#4285F4" d="M24 47c5.56 0 10.23-1.84 13.64-5l-7.19-5.58c-1.88 1.26-4.29 2.01-6.45 2.01-6.26 0-11.6-4.17-13.28-9.72l-7.15 6.44C7.07 41.52 14.82 47 24 47z"/>
            </svg>
            Google
          </button>

          <button type="button" className="social-btn facebook-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
              <path fill="#1877F2" d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.791-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.268h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
            </svg>
            Facebook
          </button>
        </div>

      </form>

      <p className="login-link">
        Already have an account? <a href="#">Login</a>
      </p>
    </div>
  );
}

export default RegisterCard;