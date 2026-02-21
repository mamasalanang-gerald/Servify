import React, { useState } from 'react';
import '../pages/styles/ProviderOverview.css';

const recentBookings = [
  { id: 1, client: 'Maria Santos',  service: 'Deep House Cleaning', date: 'Feb 22, 2026', amount: '₱149', status: 'pending' },
  { id: 2, client: 'Rico Buendia',  service: 'Deep House Cleaning', date: 'Feb 20, 2026', amount: '₱149', status: 'confirmed' },
  { id: 3, client: 'Lena Macaraeg', service: 'Standard Clean',      date: 'Feb 18, 2026', amount: '₱89',  status: 'completed' },
  { id: 4, client: 'James Torres',  service: 'Deep House Cleaning', date: 'Feb 15, 2026', amount: '₱229', status: 'completed' },
  { id: 5, client: 'Ana Reyes',     service: 'Standard Clean',      date: 'Feb 12, 2026', amount: '₱89',  status: 'cancelled' },
];

const weeklyData = [
  { day: 'Mon', amount: 0   },
  { day: 'Tue', amount: 149 },
  { day: 'Wed', amount: 89  },
  { day: 'Thu', amount: 378 },
  { day: 'Fri', amount: 149 },
  { day: 'Sat', amount: 229 },
  { day: 'Sun', amount: 89  },
];
const maxVal = Math.max(...weeklyData.map((d) => d.amount));

const statusMap = {
  pending:   { label: 'Pending',   cls: 'p-badge--pending' },
  confirmed: { label: 'Confirmed', cls: 'p-badge--confirmed' },
  completed: { label: 'Completed', cls: 'p-badge--completed' },
  cancelled: { label: 'Cancelled', cls: 'p-badge--cancelled' },
};

const ProviderOverview = () => {
  const [chartPeriod, setChartPeriod] = useState('Week');

  return (
    <div className="overview-wrapper">
      {/* Stats */}
      <div className="overview-stats">
        {[
        {
          label: 'Total Earnings', value: '₱12,480', change: '+18%', up: true,
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
          cls: 'stat-icon--green',
        },
        {
          label: 'Total Bookings', value: '84', change: '+12%', up: true,
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
          cls: 'stat-icon--blue',
        },
        {
          label: 'Pending Requests', value: '3', change: '+2', up: false,
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
          cls: 'stat-icon--yellow',
        },
        {
          label: 'Avg. Rating', value: '4.9', change: '+0.1', up: true,
          icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
          cls: 'stat-icon--blue',
        },
      ].map((s) => (
        <div className="overview-stat p-card" key={s.label}>
          <div className="overview-stat__top">
            <div className={`overview-stat__icon ${s.cls}`}>{s.icon}</div>
            <span className={`overview-stat__change ${s.up ? 'change--up' : 'change--down'}`}>
              {s.up ? '↑' : '↓'} {s.change}
            </span>
          </div>
          <div className="overview-stat__value">{s.value}</div>
          <div className="overview-stat__label">{s.label}</div>
        </div>
      ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="overview-mid">
        {/* Earnings chart */}
        <div className="p-card">
          <div className="p-card__header">
            <h3 className="p-card__title">Earnings Overview</h3>
            <div className="p-tabs" style={{ margin: 0 }}>
              {['Week', 'Month'].map((p) => (
                <button key={p} className={`p-tab ${chartPeriod === p ? 'active' : ''}`} onClick={() => setChartPeriod(p)}>{p}</button>
              ))}
            </div>
          </div>
          <div className="p-card__body">
            <div className="overview-chart">
              {weeklyData.map((d) => (
                <div key={d.day} className="overview-chart__col">
                  <span className="overview-chart__val">{d.amount > 0 ? `₱${d.amount}` : ''}</span>
                  <div className="overview-chart__spacer">
                    <div
                      className={`overview-chart__bar ${d.amount === maxVal ? 'overview-chart__bar--peak' : ''}`}
                      style={{ height: d.amount > 0 ? `${(d.amount / maxVal) * 100}%` : '4px' }}
                    />
                  </div>
                  <span className="overview-chart__day">{d.day}</span>
                </div>
              ))}
            </div>
            <div className="overview-chart__footer">
              <span>This week</span>
              <span className="overview-chart__total">₱1,083</span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="p-card">
          <div className="p-card__header"><h3 className="p-card__title">Quick Actions</h3></div>
          <div className="p-card__body overview-actions">
            {[
              { label: 'Add New Service',     emoji: '＋', color: '#2b52cc', bg: '#eef2ff' },
              { label: 'View Pending (3)',     emoji: '⏳', color: '#b45309', bg: '#fef3c7' },
              { label: 'Update Availability', emoji: '📅', color: '#059669', bg: '#dcfce7' },
              { label: 'View All Reviews',    emoji: '⭐', color: '#2b52cc', bg: '#eef2ff' },
            ].map((a) => (
              <button key={a.label} className="overview-action-btn">
                <span className="overview-action-btn__icon" style={{ background: a.bg, color: a.color }}>{a.emoji}</span>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="p-card overview-bookings">
        <div className="p-card__header">
          <h3 className="p-card__title">Recent Bookings</h3>
          <span className="overview-view-all">View All →</span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="p-table">
            <thead>
              <tr><th>Client</th><th>Service</th><th>Date</th><th>Amount</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => {
                const s = statusMap[b.status];
                return (
                  <tr key={b.id}>
                    <td className="overview-client">{b.client}</td>
                    <td>{b.service}</td>
                    <td>{b.date}</td>
                    <td className="overview-amount">{b.amount}</td>
                    <td><span className={`p-badge ${s.cls}`}><span className="p-badge__dot" />{s.label}</span></td>
                    <td>
                      {b.status === 'pending' ? (
                        <div className="overview-row-actions">
                          <button className="p-btn p-btn--ghost p-btn--sm">Accept</button>
                          <button className="p-btn p-btn--danger p-btn--sm">Decline</button>
                        </div>
                      ) : (
                        <button className="p-btn p-btn--ghost p-btn--sm">Details</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProviderOverview;