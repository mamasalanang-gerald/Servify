import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import '../pages/styles/LogoutButton.css';

const LogoutButton = ({ confirm = true, className = '' }) => {
  const navigate        = useNavigate();
  const [show, setShow] = useState(false);

  const doLogout = () => {
    localStorage.removeItem('servify_role');
    localStorage.removeItem('servify_email');
    navigate('/login', { replace: true });
  };

  const handleClick = () => {
    if (confirm) {
      setShow(true);
    } else {
      doLogout();
    }
  };

  return (
    <>
      {/* The button — stays inside the sidebar */}
      <button
        className={`logout-btn ${className}`}
        onClick={handleClick}
        type="button"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>

      {/* Modal — portaled to document.body so it always covers the full screen */}
      {show && createPortal(
        <div className="logout-overlay" onClick={() => setShow(false)}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="logout-modal__icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className="logout-modal__title">Sign out?</h3>
            <p className="logout-modal__msg">You'll be redirected to the login page.</p>
            <div className="logout-modal__actions">
              <button
                type="button"
                className="logout-modal__cancel"
                onClick={() => setShow(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-modal__confirm"
                onClick={doLogout}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LogoutButton;