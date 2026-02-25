import { useState } from 'react';
import ProviderSidebar from '../components/ProviderSidebar';
import ProviderOverview from '../components/ProviderOverview';
import ProviderServices from '../components/ProviderServices';
import ProviderBookings from '../components/ProviderBookings';
import ProviderEarnings from '../components/ProviderEarnings';
import ProviderProfile from '../components/ProviderProfile';
import ProviderReviews from '../components/ProviderReviews';
import useAuth from '../hooks/useAuth';

const ProviderDashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [quickActionContext, setQuickActionContext] = useState(null);
  const { user } = useAuth();
  const firstName = user?.full_name?.split(' ')[0] || 'User';

  const pageMeta = {
    Dashboard: { title: 'Dashboard', sub: `Welcome back, ${firstName}! Here's your overview.` },
    'My Services': { title: 'My Services', sub: 'Manage your service listings.' },
    Bookings: { title: 'Bookings', sub: 'View and manage client booking requests.' },
    Earnings: { title: 'Earnings', sub: 'Track your income and payouts.' },
    'Profile & Portfolio': { title: 'Profile & Portfolio', sub: 'Update your public profile and availability.' },
    Reviews: { title: 'Reviews', sub: 'See what clients are saying about you.' },
  };

  const meta = pageMeta[activeNav] || pageMeta.Dashboard;

  const handleSidebarNavChange = (nextNav) => {
    setQuickActionContext(null);
    setActiveNav(nextNav);
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'add-service') {
      setActiveNav('My Services');
      setQuickActionContext('add-service');
      return;
    }

    if (actionId === 'view-pending') {
      setActiveNav('Bookings');
      setQuickActionContext('view-pending');
      return;
    }

    if (actionId === 'view-all-bookings') {
      setActiveNav('Bookings');
      setQuickActionContext('view-all-bookings');
      return;
    }

    if (actionId === 'update-availability') {
      setActiveNav('Profile & Portfolio');
      setQuickActionContext('update-availability');
      return;
    }

    if (actionId === 'view-reviews') {
      setActiveNav('Reviews');
      setQuickActionContext(null);
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <ProviderOverview onQuickAction={handleQuickAction} />;
      case 'My Services':
        return <ProviderServices openAddOnMount={quickActionContext === 'add-service'} />;
      case 'Bookings':
        return <ProviderBookings defaultTab={quickActionContext === 'view-pending' ? 'Pending' : 'All'} />;
      case 'Earnings':
        return <ProviderEarnings />;
      case 'Profile & Portfolio':
        return <ProviderProfile defaultTab={quickActionContext === 'update-availability' ? 'Availability' : 'Profile'} />;
      case 'Reviews':
        return <ProviderReviews />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <ProviderSidebar activeNav={activeNav} setActiveNav={handleSidebarNavChange} />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <div className="bg-card/90 backdrop-blur-2xl border-b border-border px-8 py-3.5 flex items-center justify-between sticky top-0 z-50">
          <div>
            <div className="text-lg font-bold text-foreground">{meta.title}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{meta.sub}</div>
          </div>
        </div>
        <div className="px-8 py-7 flex-1">{renderContent()}</div>
      </div>
    </div>
  );
};

export default ProviderDashboardPage;
