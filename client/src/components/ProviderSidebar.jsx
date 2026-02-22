import React from 'react';
import LogoutButton from './LogoutButton';
import '../pages/styles/Providersidebar.css';

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
    badge: 3,
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

const ProviderSidebar = ({ activeNav, setActiveNav }) => {
  return (
    <aside className="p-sidebar">
      {/* Brand */}
      <div className="p-sidebar__brand">
        <div className="p-sidebar__brand-icon">S</div>
        <span className="p-sidebar__brand-name">Servify</span>
        <span className="p-sidebar__brand-tag">Pro</span>
      </div>

      {/* Provider info */}
      <div className="p-sidebar__provider">
        <div className="p-sidebar__avatar">JD</div>
        <div>
          <div className="p-sidebar__pname">Juan dela Cruz</div>
          <div className="p-sidebar__psub">Service Provider</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="p-nav">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`p-nav__item ${activeNav === item.label ? 'active' : ''}`}
            onClick={() => setActiveNav(item.label)}
          >
            {item.icon}
            {item.label}
            {item.badge && <span className="p-nav__badge">{item.badge}</span>}
          </button>
        ))}
      </nav>

      {/* Footer — uses shared LogoutButton */}
      <div className="p-sidebar__footer">
        <LogoutButton />
      </div>
    </aside>
  );
};

export default ProviderSidebar;