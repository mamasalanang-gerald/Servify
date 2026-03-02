import React, { useEffect, useState } from 'react';
import LogoutButton from './LogoutButton';
import { cn } from '../lib/utils';
import { Badge } from './ui/badge';
import useAuth from '../hooks/useAuth';
import { bookingService } from '../services/bookingService';
import { userService } from '../services/userService';

const ProviderSidebar = ({ activeNav, setActiveNav }) => {
  const { user } = useAuth();
  const [bookingCount, setBookingCount] = useState(0);
  const [profileImage, setProfileImage] = useState(user?.profile_image || '');

  useEffect(() => {
    let isMounted = true;

    const fetchBookingCount = async () => {
      if (!user?.id) return;
      try {
        const bookings = await bookingService.getProviderBookings(user.id);
        if (isMounted) {
          setBookingCount(Array.isArray(bookings) ? bookings.length : 0);
        }
      } catch (err) {
        console.error("Failed to fetch booking count", err);
      }
    };

    const fetchProfile = async () => {
      try {
        const profile = await userService.getProfile();
        if (isMounted && profile.profile_image) {
          setProfileImage(profile.profile_image);
          localStorage.setItem('servify_profile_image', profile.profile_image);
        }
      } catch (err) {
        // Non-critical
      }
    };

    fetchBookingCount();
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
      label: 'My Services',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
    },
    {
      label: 'Bookings',
      badge: bookingCount > 0 ? bookingCount : null,
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
      label: 'Earnings',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: 'Profile & Portfolio',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      label: 'Reviews',
      icon: (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
          S
        </div>
        <span className="text-xl font-bold text-foreground">Servify</span>
        <Badge variant="secondary" className="ml-auto bg-primary/10 text-primary hover:bg-primary/10">Pro</Badge>
      </div>

      {/* Provider info */}
      <div className="flex items-center gap-3 border-b border-border px-6 py-5">
        {profileImage ? (
          <img src={profileImage} alt="Profile" className="h-12 w-12 rounded-full object-cover border-2 border-gray-200" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-lg font-bold text-white">
            {user?.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'JD'}
          </div>
        )}
        <div className="flex-1">
          <div className="font-semibold text-foreground">{user?.full_name || 'Juan dela Cruz'}</div>
          <div className="text-sm text-muted-foreground">Service Provider</div>
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
            {item.badge && (
              <Badge variant="secondary" className="ml-auto bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-950 dark:text-red-400">
                {item.badge}
              </Badge>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default ProviderSidebar;