import React, { useState } from 'react';
import '../pages/styles/ProviderBookings.css';

const allBookings = [
  { id: 1, client: 'Maria Santos',   avatar: 'MS', service: 'Deep House Cleaning', date: 'Feb 22, 2026', time: '9:00 AM',  amount: '₱149', status: 'pending' },
  { id: 2, client: 'Rico Buendia',   avatar: 'RB', service: 'Deep House Cleaning', date: 'Feb 20, 2026', time: '2:00 PM',  amount: '₱149', status: 'pending' },
  { id: 3, client: 'Trisha Cunanan', avatar: 'TC', service: 'Standard Clean',      date: 'Feb 23, 2026', time: '10:00 AM', amount: '₱89',  status: 'pending' },
  { id: 4, client: 'Lena Macaraeg',  avatar: 'LM', service: 'Standard Clean',      date: 'Feb 18, 2026', time: '11:00 AM', amount: '₱89',  status: 'confirmed' },
  { id: 5, client: 'James Torres',   avatar: 'JT', service: 'Deep House Cleaning', date: 'Feb 25, 2026', time: '1:00 PM',  amount: '₱229', status: 'confirmed' },
  { id: 6, client: 'Ana Reyes',      avatar: 'AR', service: 'Standard Clean',      date: 'Feb 10, 2026', time: '9:00 AM',  amount: '₱89',  status: 'completed' },
  { id: 7, client: 'Paul Katigbak',  avatar: 'PK', service: 'Deep House Cleaning', date: 'Feb 5, 2026',  time: '3:00 PM',  amount: '₱149', status: 'completed' },
  { id: 8, client: 'Sofia Araneta',  avatar: 'SA', service: 'Move-In/Out Clean',   date: 'Jan 28, 2026', time: '9:00 AM',  amount: '₱229', status: 'completed' },
  { id: 9, client: 'Marco Dizon',    avatar: 'MD', service: 'Standard Clean',      date: 'Jan 20, 2026', time: '2:00 PM',  amount: '₱89',  status: 'cancelled' },
];

const tabs = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];

const statusMap = {
  pending:   { label: 'Pending',   cls: 'p-badge--pending' },
  confirmed: { label: 'Confirmed', cls: 'p-badge--confirmed' },
  completed: { label: 'Completed', cls: 'p-badge--completed' },
  cancelled: { label: 'Cancelled', cls: 'p-badge--cancelled' },
};

const ProviderBookings = () => {
  const [activeTab, setActiveTab]     = useState('All');
  const [bookings, setBookings]       = useState(allBookings);
  const [detailModal, setDetailModal] = useState(null);

  const filtered = activeTab === 'All'
    ? bookings
    : bookings.filter((b) => b.status === activeTab.toLowerCase());

  const updateStatus = (id, newStatus) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    setDetailModal(null);
  };

  const counts = tabs.reduce((acc, tab) => {
    acc[tab] = tab === 'All' ? bookings.length : bookings.filter((b) => b.status === tab.toLowerCase()).length;
    return acc;
  }, {});

  return (
    <div className="bookings-wrapper">
      {/* Tab bar */}
      <div className="bookings-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`bookings-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
            <span className={`bookings-tab__count ${activeTab === tab ? 'bookings-tab__count--active' : ''}`}>
              {counts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Booking rows */}
      <div className="bookings-list">
        {filtered.length === 0 && (
          <div className="p-empty">
            <div className="p-empty__icon">📭</div>
            <div className="p-empty__text">No bookings in this category</div>
          </div>
        )}
        {filtered.map((b) => {
          const s = statusMap[b.status];
          return (
            <div key={b.id} className="booking-row p-card">
              <div className="booking-row__avatar">{b.avatar}</div>

              <div className="booking-row__info">
                <div className="booking-row__client">{b.client}</div>
                <div className="booking-row__service">{b.service}</div>
              </div>

              <div className="booking-row__datetime">
                <div className="booking-row__date">{b.date}</div>
                <div className="booking-row__time">{b.time}</div>
              </div>

              <div className="booking-row__amount">{b.amount}</div>

              <span className={`p-badge ${s.cls}`}>
                <span className="p-badge__dot" />{s.label}
              </span>

              <div className="booking-row__actions">
                {b.status === 'pending' && (
                  <>
                    <button className="p-btn p-btn--ghost p-btn--sm" onClick={() => updateStatus(b.id, 'confirmed')}>Accept</button>
                    <button className="p-btn p-btn--danger p-btn--sm" onClick={() => updateStatus(b.id, 'cancelled')}>Decline</button>
                  </>
                )}
                <button className="p-btn p-btn--ghost p-btn--sm" onClick={() => setDetailModal(b)}>Details</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail modal */}
      {detailModal && (
        <div className="p-modal-overlay" onClick={() => setDetailModal(null)}>
          <div className="p-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2 className="p-modal__title">Booking Details</h2>
              <button className="p-modal__close" onClick={() => setDetailModal(null)}>✕</button>
            </div>
            <div className="p-modal__body">
              {[
                ['Client',  detailModal.client],
                ['Service', detailModal.service],
                ['Date',    detailModal.date],
                ['Time',    detailModal.time],
                ['Amount',  detailModal.amount],
                ['Status',  detailModal.status.charAt(0).toUpperCase() + detailModal.status.slice(1)],
              ].map(([k, v]) => (
                <div key={k} className="booking-detail-row">
                  <span className="booking-detail-row__key">{k}</span>
                  <span className="booking-detail-row__val">{v}</span>
                </div>
              ))}
            </div>
            {detailModal.status === 'pending' && (
              <div className="p-modal__footer">
                <button className="p-btn p-btn--danger" onClick={() => updateStatus(detailModal.id, 'cancelled')}>Decline</button>
                <button className="p-btn p-btn--primary" onClick={() => updateStatus(detailModal.id, 'confirmed')}>Accept Booking</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;