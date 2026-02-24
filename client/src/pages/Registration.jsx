import React, { useState, useEffect } from "react";
import "./Registration.css";
import Navbar from "../../components/Navbar/Navbar";
import RegisterCard from "../../components/RegisterCard/RegisterCard";

function Registration() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <Navbar darkMode={darkMode} onToggleDark={() => setDarkMode(!darkMode)} />
      <div className="register-page">

        {/* LEFT PANEL */}
        <div className="register-left">
          <div className="left-blob blob-1" />
          <div className="left-blob blob-2" />
          <div className="left-content">
            <div className="left-brand">
              <div className="left-logo">S</div>
              <span className="left-brand-name">Servify</span>
            </div>
            <h1 className="left-heading">Your trusted platform for every service need.</h1>
            <p className="left-sub">Connect with thousands of verified professionals ready to help you anytime, anywhere.</p>
            <ul className="left-features">
              <li>
                <span className="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                50,000+ satisfied customers
              </li>
              <li>
                <span className="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                3,200+ verified providers
              </li>
              <li>
                <span className="check-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                Secure & instant payments
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="register-right">
          <RegisterCard />
        </div>

      </div>
    </>
  );
}

export default Registration;