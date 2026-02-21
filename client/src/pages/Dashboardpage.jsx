import { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardStats from '../components/DashboardStats';
import BookingList from '../components/BookingList';
import SavedServices from '../components/SavedServices';
import ProfileSettings from '../components/ProfileSettings';
import AccountSettings from '../components/AccountSettings';
import useAuth from '../hooks/useAuth';

import './styles/dashboard.css';

/* ─── Full-area blur overlay shown when not logged in ─── */
const GuestOverlay = () => (
  <div className="dash-guest-overlay">
    <div className="dash-guest-card">
      <div className="dash-guest-card__icon">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <h2 className="dash-guest-card__title">Sign in to view your Dashboard</h2>
      <p className="dash-guest-card__desc">
        Access your bookings, saved services, profile, and account settings by logging in or creating a free account.
      </p>
      <div className="dash-guest-card__actions">
        <a href="/login"  className="dash-guest-card__btn dash-guest-card__btn--primary">Log In</a>
        <a href="/signup" className="dash-guest-card__btn dash-guest-card__btn--secondary">Create Account</a>
      </div>
    </div>
  </div>
);

const DashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Bookings');
  const { user } = useAuth();
  const isGuest = !user;

  const renderContent = () => {
    switch (activeNav) {
      case 'Bookings':
        return (
          <>
            <DashboardStats />
            <BookingList />
          </>
        );
      case 'Saved Services':
        return <SavedServices />;
      case 'Profile':
        return <ProfileSettings />;
      case 'Settings':
        return <AccountSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar activePage="dashboard" />

      <div className="dashboard-layout">
        <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* Wrapper positions the blur + overlay relative to just the main content area */}
        <div className="dashboard-main-wrapper">
          <main className={`dashboard-main ${isGuest ? 'dashboard-main--blurred' : ''}`}>
            <div className="dashboard-header">
              <h1 className="dashboard-header__title">My Dashboard</h1>
              <p className="dashboard-header__sub">Manage your bookings and account settings</p>
            </div>
            {renderContent()}
          </main>

          {isGuest && <GuestOverlay />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;