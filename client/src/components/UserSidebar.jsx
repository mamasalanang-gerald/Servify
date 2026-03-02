import React from 'react';
import LogoutButton from './LogoutButton';
import { cn } from '../lib/utils';
import useAuth from '../hooks/useAuth';

const UserSidebar = ({ activeNav, setActiveNav }) => {
  const { user } = useAuth();

  const currentPath = window.location.pathname;

  const handleNavClick = (label) => {
    if (currentPath !== '/dashboard') {
      window.location.href = `/dashboard?tab=${encodeURIComponent(label)}`;
    } else {
      setActiveNav(label);
    }
  };

  const navItems = [
    {
      label: 'Services',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
        </svg>
      ),
      href: '/services',
    },
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
          {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || user?.email?.slice(0, 2).toUpperCase() || 'U'}
        </div>
        <div className="flex-1">
          <div className="font-semibold text-foreground">{user?.full_name || user?.email?.split('@')[0] || 'User'}</div>
          <div className="text-sm text-muted-foreground">Client</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors no-underline",
                  currentPath === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="flex-1 text-left">{item.label}</span>
              </a>
            );
          }

          return (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                activeNav === item.label && currentPath === '/dashboard'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              onClick={() => handleNavClick(item.label)}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          );
        })}

        {user && user.role === 'client' && (
          <>
            <div className="my-2 border-t border-border" />
            <a
              href="/become-provider"
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors no-underline",
                currentPath === '/become-provider'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
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
      <div className="border-t border-border p-4">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default UserSidebar;