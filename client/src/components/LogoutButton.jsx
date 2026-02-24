import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Button } from './ui/button';

const LogoutButton = ({ confirm = true, className = '' }) => {
  const navigate        = useNavigate();
  const [show, setShow] = useState(false);

  const doLogout = async () => {
    await authService.logout();
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
        className={`flex items-center gap-2 w-full rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors ${className}`}
        onClick={handleClick}
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Sign Out
      </button>

      {/* Modal — portaled to document.body so it always covers the full screen */}
      {show && createPortal(
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-[9999] p-5 animate-in fade-in duration-200" onClick={() => setShow(false)}>
          <div className="bg-white rounded-2xl p-8 pt-9 w-full max-w-[340px] text-center shadow-2xl animate-in slide-in-from-bottom-4 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Sign out?</h3>
            <p className="text-sm text-slate-600 mb-6">You'll be redirected to the login page.</p>
            <div className="flex gap-2.5">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setShow(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="flex-1 bg-red-500 hover:bg-red-600"
                onClick={doLogout}
              >
                Yes, Sign Out
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default LogoutButton;