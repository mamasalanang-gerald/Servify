import { useState } from 'react';
import Navbar from '../components/Navbar';
import DashboardSidebar from '../components/DashboardSidebar';
import DashboardStats from '../components/DashboardStats';
import BookingList from '../components/BookingList';
import SavedServices from '../components/SavedServices';
import ProfileSettings from '../components/ProfileSettings';
import AccountSettings from '../components/AccountSettings';
import useAuth from '../hooks/useAuth';
import { Button } from '../components/ui/button';

/* ─── Full-area blur overlay shown when not logged in ─── */
const GuestOverlay = () => (
  <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
    <div className="mx-4 max-w-md space-y-6 rounded-lg border border-border bg-card p-8 text-center shadow-lg">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Sign in to view your Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Access your bookings, saved services, profile, and account settings by logging in or creating a free account.
        </p>
      </div>
      <div className="flex gap-3">
        <Button asChild className="flex-1">
          <a href="/login">Log In</a>
        </Button>
        <Button asChild variant="outline" className="flex-1">
          <a href="/signup">Create Account</a>
        </Button>
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
          <div className="space-y-6">
            <DashboardStats />
            <BookingList />
          </div>
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
    <div className="min-h-screen bg-background">
      <Navbar activePage="dashboard" />

      <div className="flex">
        <DashboardSidebar activeNav={activeNav} setActiveNav={setActiveNav} />

        {/* Wrapper positions the blur + overlay relative to just the main content area */}
        <div className="relative flex-1">
          <main className={isGuest ? "blur-sm" : ""}>
            <div className="border-b border-border bg-card px-8 py-6">
              <h1 className="text-3xl font-bold text-foreground">My Dashboard</h1>
              <p className="text-sm text-muted-foreground">Manage your bookings and account settings</p>
            </div>
            <div className="p-8">
              {renderContent()}
            </div>
          </main>

          {isGuest && <GuestOverlay />}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;