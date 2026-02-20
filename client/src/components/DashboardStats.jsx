import React from 'react';

const stats = [
  {
    label: 'Upcoming',
    value: '2',
    color: '#2b52cc',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2b52cc" strokeWidth="1.8">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
  },
  {
    label: 'Completed',
    value: '2',
    color: '#16a34a',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.8">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
  {
    label: 'Total Spent',
    value: '₱619',
    color: '#d97706',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="1.8">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
];

const DashboardStats = () => {
  return (
    <div className="dash-stats">
      {stats.map((stat, i) => (
        <div className="dash-stat-card" key={i}>
          <div className="dash-stat-card__info">
            <span className="dash-stat-card__label">{stat.label}</span>
            <span className="dash-stat-card__value" style={{ color: stat.color }}>{stat.value}</span>
          </div>
          <div className="dash-stat-card__icon">{stat.icon}</div>
        </div>
      ))}
    </div>
  );
};

export default DashboardStats;