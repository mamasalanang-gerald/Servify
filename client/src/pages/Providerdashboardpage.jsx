import React, { useState } from 'react';
import ProviderSidebar  from '../components/ProviderSidebar';
import ProviderOverview from '../components/ProviderOverview';
import ProviderServices from '../components/ProviderServices';
import ProviderBookings from '../components/ProviderBookings';
import ProviderEarnings from '../components/ProviderEarnings';
import ProviderProfile  from '../components/ProviderProfile';
import ProviderReviews  from '../components/ProviderReviews';
import './styles/Providerdashboard.css';

const pageMeta = {
  'Dashboard':           { title: 'Dashboard',           sub: "Welcome back, Juan! Here's your overview." },
  'My Services':         { title: 'My Services',         sub: 'Manage your service listings.' },
  'Bookings':            { title: 'Bookings',            sub: 'View and manage client booking requests.' },
  'Earnings':            { title: 'Earnings',            sub: 'Track your income and payouts.' },
  'Profile & Portfolio': { title: 'Profile & Portfolio', sub: 'Update your public profile and availability.' },
  'Reviews':             { title: 'Reviews',             sub: 'See what clients are saying about you.' },
};

const ProviderDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const meta = pageMeta[activeNav];

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':           return <ProviderOverview />;
      case 'My Services':         return <ProviderServices />;
      case 'Bookings':            return <ProviderBookings />;
      case 'Earnings':            return <ProviderEarnings />;
      case 'Profile & Portfolio': return <ProviderProfile />;
      case 'Reviews':             return <ProviderReviews />;
      default:                    return null;
    }
  };

  return (
    <div className="provider-page">
      <ProviderSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="p-main">
        <div className="p-topbar">
          <div>
            <div className="p-topbar__title">{meta.title}</div>
            <div className="p-topbar__sub">{meta.sub}</div>
          </div>
          <div className="p-topbar__actions">
            {activeNav === 'My Services' && (
              <button className="p-topbar__btn p-topbar__btn--primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Service
              </button>
            )}
          </div>
        </div>
        <div className="p-content">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;