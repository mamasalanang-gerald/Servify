import { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardStats from '../components/DashboardStats';
import BookingList from '../components/BookingList';

import './styles/dashboard.css';

const DashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Bookings');

  const renderContent = () => {
    switch (activeNav) {
      case 'Bookings':
        return (
          <>
            <DashboardStats />
            <BookingList />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="dashboard-page">
      <Navbar activePage="dashboard" />

      <div className="dashboard-layout">
        <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        <main className="dashboard-main">
          <div className="dashboard-header">
            <h1 className="dashboard-header__title">My Dashboard</h1>
            <p className="dashboard-header__sub">Manage your bookings and account settings</p>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;