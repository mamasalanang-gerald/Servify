import React, { useState, useEffect } from 'react';
import LogoutButton from './LogoutButton';
import useAuth from '../hooks/useAuth';
import { cn } from '../lib/utils';
import { userService } from '../services/userService';

const navItems = [
  {
    label: 'Services',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    ),
    href: '/services',
  },
  {
    label: 'Dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
    href: '/dashboard',
  },
  {
    label: 'Bookings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: 'Profile',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
  {
    label: 'Settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
];

// Additional nav item for clients only
const becomeProviderItem = {
  label: 'Become a Provider',
  icon: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="8.5" cy="7" r="4" />
      <polyline points="17 11 19 13 23 9" />
    </svg>
  ),
  href: '/become-provider',
};

const DashboardSidebar = ({ activeNav, setActiveNav }) => {
  const { user } = useAuth();
  const isGuest = !user;
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');

  useEffect(() => {
    if (isGuest) return;
    userService.getProfile()
      .then((profile) => {
        if (profile.profile_image) {
          setProfileImage(profile.profile_image);
          localStorage.setItem('servify_profile_image', profile.profile_image);
        }
      })
      .catch(() => {});
  }, [isGuest]);

  const displayName  = isGuest ? 'Guest'         : (user.full_name || user.email?.split('@')[0] || 'User');
  const displayEmail = isGuest ? 'Not logged in' : user.email;
  const initials     = isGuest ? null             : displayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-border bg-card z-[110]">

      {/* Profile */}
      <div className="flex flex-col items-center border-b border-border px-6 py-8">
        {isGuest ? (
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold bg-muted text-muted-foreground">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        ) : profileImage ? (
          <img src={profileImage} alt="Profile" className="mb-4 h-20 w-20 rounded-full object-cover border-2 border-gray-200" />
        ) : (
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full text-2xl font-bold bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            {initials}
          </div>
        )}
        <h3 className="mb-1 text-lg font-semibold text-foreground">{displayName}</h3>
        <p className="text-sm text-muted-foreground">{displayEmail}</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          // If item has href, render as link
          if (item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                className={cn(
                  "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors no-underline",
                  "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {item.label}
              </a>
            );
          }
          
          // Otherwise render as button (for dashboard sections)
          return (
            <button
              key={item.label}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                activeNav === item.label
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                isGuest && "cursor-not-allowed opacity-60"
              )}
              onClick={() => setActiveNav(item.label)}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {item.label}
              {isGuest && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="ml-auto flex-shrink-0 opacity-40">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </button>
          );
        })}
        
        {/* Show "Become a Provider" link for clients only */}
        {user && user.role === 'client' && (
          <>
            <div className="my-2 border-t border-border" />
            <a
              href={becomeProviderItem.href}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors no-underline",
                "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="flex-shrink-0">{becomeProviderItem.icon}</span>
              {becomeProviderItem.label}
            </a>
          </>
        )}
      </nav>

      {/* Footer - Logout Button */}
      {!isGuest && (
        <div className="border-t border-border p-4">
          <LogoutButton />
        </div>
      )}

    </aside>
  );
};

export default DashboardSidebar;