import React, { useState } from 'react';
import ProviderSidebar  from '../components/ProviderSidebar';
import ProviderOverview from '../components/ProviderOverview';
import ProviderServices from '../components/ProviderServices';
import ProviderBookings from '../components/ProviderBookings';
import ProviderEarnings from '../components/ProviderEarnings';
import ProviderProfile  from '../components/ProviderProfile';
import ProviderReviews  from '../components/ProviderReviews';
import { Button } from '../components/ui/button';

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
    <div className="flex min-h-screen bg-slate-50">
      <ProviderSidebar activeNav={activeNav} setActiveNav={setActiveNav} />
      <div className="ml-[260px] flex-1 flex flex-col min-h-screen">
        <div className="bg-white/90 backdrop-blur-2xl border-b border-slate-200 px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
          <div>
            <div className="text-lg font-bold text-slate-900">{meta.title}</div>
            <div className="text-xs text-slate-500 mt-0.5">{meta.sub}</div>
          </div>
          <div className="flex items-center gap-2.5">
            {activeNav === 'My Services' && (
              <Button className="bg-gradient-to-br from-blue-900 to-blue-600 gap-1.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add Service
              </Button>
            )}
          </div>
        </div>
        <div className="px-8 py-7 flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;