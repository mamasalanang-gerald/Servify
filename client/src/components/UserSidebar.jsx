import React, { useEffect, useState, useRef } from 'react';
import LogoutButton from './LogoutButton';
import { cn } from '../lib/utils';
import useAuth from '../hooks/useAuth';
import { userService } from '../services/userService';

const UserSidebar = ({ activeNav, setActiveNav }) => {
  const { user } = useAuth();
  const [profileImage, setProfileImage] = useState(
    user?.profile_image || localStorage.getItem('servify_profile_image') || ''
  );

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

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user?.id) return;
      try {
        const profile = await userService.getProfile();
        if (isMounted && profile?.profile_image) {
          setProfileImage(profile.profile_image);
          localStorage.setItem('servify_profile_image', profile.profile_image);
        }
      } catch (err) {
        // Non-critical
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, [user?.id]);

  const navItems = [
    {
      label: 'Dashboard',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
    },
    {
      label: 'Services',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
    },
    {
      label: 'Bookings',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      ),
    },
    {
      label: 'Saved Services',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      ),
    },
    {
      label: 'Profile',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: 'Settings',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-border bg-card z-[110]">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
          S
        </div>
        <span className="text-xl font-bold text-foreground">Servify</span>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
            {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'U'}
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-foreground">{user?.full_name || user?.email?.split('@')[0] || 'User'}</div>
          <div className="text-sm text-muted-foreground">Client</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
              activeNav === item.label
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
            onClick={() => setActiveNav(item.label)}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            <span className="flex-1 text-left">{item.label}</span>
          </button>
        ))}

        {/* Show "Become a Provider" link for clients only */}
        {user && user.role === 'client' && (
          <>
            <div className="my-2 border-t border-border" />
            <a
              href="/become-provider"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors no-underline",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="flex-shrink-0">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <polyline points="17 11 19 13 23 9" />
                </svg>
              </span>
              <span className="flex-1 text-left">Become a Provider</span>
            </a>
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4 flex flex-col gap-2">
        {/* Dark mode toggle */}
        <button
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          onClick={() => setDark(!dark)}
          aria-label="Toggle theme"
        >
          <span className="flex-shrink-0">
            {dark ? (
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" />
              </svg>
            ) : (
              <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="flex-1 text-left">{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <LogoutButton />
      </div>
    </aside>
  );
};

export default UserSidebar;