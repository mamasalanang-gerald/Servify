import React, { useState } from 'react';
import LogoutButton from '../components/LogoutButton';
import './styles/AdminDashboard.css';

const navItems = [
  {
    label: 'Overview',
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
    label: 'Users',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    label: 'Providers',
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
    label: 'Reports',
    icon: (
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6"  y1="20" x2="6"  y2="14" />
      </svg>
    ),
  },
];

const stats = [
  { label: 'Total Users',     value: '12,480', change: '+8%',  up: true  },
  { label: 'Total Providers', value: '3,240',  change: '+12%', up: true  },
  { label: 'Bookings Today',  value: '284',    change: '+5%',  up: true  },
  { label: 'Open Reports',    value: '7',      change: '+3',   up: false },
];

const recentUsers = [
  { id: 1, name: 'Maria Santos',   email: 'maria@email.com',   role: 'user',     joined: 'Feb 20, 2026', status: 'active'  },
  { id: 2, name: 'Juan dela Cruz', email: 'juan@email.com',    role: 'provider', joined: 'Feb 19, 2026', status: 'active'  },
  { id: 3, name: 'Rico Buendia',   email: 'rico@email.com',    role: 'user',     joined: 'Feb 18, 2026', status: 'active'  },
  { id: 4, name: 'Lena Macaraeg',  email: 'lena@email.com',    role: 'provider', joined: 'Feb 17, 2026', status: 'suspended'},
  { id: 5, name: 'Ana Reyes',      email: 'ana@email.com',     role: 'user',     joined: 'Feb 15, 2026', status: 'active'  },
];

const AdminDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Overview');

  return (
    <div className="admin-page">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <a href="/" className="admin-sidebar__brand">
          <div className="admin-sidebar__brand-icon">S</div>
          <span className="admin-sidebar__brand-name">Servify</span>
          <span className="admin-sidebar__brand-tag">Admin</span>
        </a>

        {/* Admin info */}
        <div className="admin-sidebar__user">
          <div className="admin-sidebar__avatar">AD</div>
          <div>
            <div className="admin-sidebar__uname">Admin User</div>
            <div className="admin-sidebar__usub">Super Administrator</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`admin-nav__item ${activeNav === item.label ? 'active' : ''}`}
              onClick={() => setActiveNav(item.label)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Footer — reuses shared LogoutButton */}
        <div className="admin-sidebar__footer">
          <LogoutButton />
        </div>
      </aside>

      {/* Main */}
      <div className="admin-main">
        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <div className="admin-topbar__title">{activeNav}</div>
            <div className="admin-topbar__sub">Servify Admin Panel · Feb 21, 2026</div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {/* Stats */}
          <div className="admin-stats">
            {stats.map((s) => (
              <div key={s.label} className="admin-stat">
                <div className="admin-stat__top">
                  <span className={`admin-stat__change ${s.up ? 'up' : 'down'}`}>
                    {s.up ? '↑' : '↓'} {s.change}
                  </span>
                </div>
                <div className="admin-stat__value">{s.value}</div>
                <div className="admin-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Recent users table */}
          <div className="admin-card">
            <div className="admin-card__header">
              <h3 className="admin-card__title">Recent Users</h3>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => (
                    <tr key={u.id}>
                      <td className="admin-table__name">{u.name}</td>
                      <td>{u.email}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${u.role}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.joined}</td>
                      <td>
                        <span className={`admin-badge admin-badge--${u.status}`}>
                          <span className="admin-badge__dot" />
                          {u.status}
                        </span>
                      </td>
                      <td>
                        <button className="admin-btn admin-btn--sm admin-btn--ghost">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;