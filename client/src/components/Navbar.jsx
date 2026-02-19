import { useState, useEffect } from "react";
import "./Navbar.css";

export default function Navbar() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <div className="logo-icon">S</div>
        <span className="logo-text">Servify</span>
      </div>

      <ul className="navbar-links">
        <li><a href="#">Services</a></li>
        <li><a href="#">Become a Provider</a></li>
        <li><a href="#">Dashboard</a></li>
      </ul>

      <div className="navbar-actions">
        <button className="icon-btn" onClick={() => setDark(!dark)} aria-label="Toggle theme">
          {dark ? (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="5"/>
              <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <button className="icon-btn" aria-label="Account">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </button>
        <button className="signup-btn">Sign Up</button>
      </div>
    </nav>
  );
}