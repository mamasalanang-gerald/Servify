import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserSidebar from '../components/UserSidebar';
import UserOverview from '../components/UserOverview';
import UserBookings from '../components/UserBookings';
import SavedServices from '../components/SavedServices';
import ProfileSettings from '../components/ProfileSettings';
import AccountSettings from '../components/AccountSettings';
import useAuth from '../hooks/useAuth';
import { userService } from '../services/userService';

const DashboardPage = () => {
  const [activeNav, setActiveNav] = useState('Dashboard');
  const [quickActionContext, setQuickActionContext] = useState(null);
  const [servicesInitialCategory, setServicesInitialCategory] = useState(null);
  const { user, updateUserRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const firstName = user?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Refresh user data on mount and when window gains focus
  useEffect(() => {
    const refreshUserData = async () => {
      if (!user) return;
      
      try {
        const userData = await userService.getCurrentUser();
        // Update role if it changed
        if (userData.role !== user.role) {
          updateUserRole(userData.role);
          // Force page reload to update UI
          window.location.reload();
        }
      } catch (err) {
        console.error('Failed to refresh user data:', err);
      }
    };

    refreshUserData();

    // Refresh when window gains focus (user comes back to tab)
    const handleFocus = () => {
      refreshUserData();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, updateUserRole]);

  useEffect(() => {
    const dashboardState = location.state;
    if (!dashboardState || dashboardState.openNav !== 'Services') return;

    navigate('/services', { 
      replace: true, 
      state: { category: dashboardState.category || null } 
    });
  }, [location.pathname, location.state, navigate]);

  const pageMeta = {
    Dashboard: { title: 'Dashboard', sub: `Welcome back, ${firstName}! Here's your overview.` },
    Bookings: { title: 'My Bookings', sub: 'View and manage your service bookings.' },
    'Saved Services': { title: 'Saved Services', sub: 'Your favorite services for quick access.' },
    Profile: { title: 'Profile Settings', sub: 'Update your personal information.' },
    Settings: { title: 'Account Settings', sub: 'Manage your account preferences.' },
  };

  const meta = pageMeta[activeNav] || pageMeta.Dashboard;

  const handleSidebarNavChange = (nextNav) => {
    setQuickActionContext(null);
    setActiveNav(nextNav);
    if (nextNav !== 'Services') {
      setServicesInitialCategory(null);
    }
  };

  const handleQuickAction = (actionId) => {
    if (actionId === 'browse-services') {
      navigate('/services');
      return;
    }
    if (actionId === 'view-bookings') {
      setActiveNav('Bookings');
      setQuickActionContext('view-bookings');
      return;
    }

    if (actionId === 'saved-services') {
      setActiveNav('Saved Services');
      setQuickActionContext(null);
    }
  };

  const renderContent = () => {
    switch (activeNav) {
      case 'Dashboard':
        return <UserOverview onQuickAction={handleQuickAction} />;
      case 'Bookings':
        return <UserBookings />;
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

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors">
      <UserSidebar activeNav={activeNav} setActiveNav={handleSidebarNavChange} />
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        <div className="bg-card/90 backdrop-blur-2xl border-b border-border px-8 py-3.5 flex items-center justify-between sticky top-0 z-50 transition-colors">
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

export default DashboardPage;
